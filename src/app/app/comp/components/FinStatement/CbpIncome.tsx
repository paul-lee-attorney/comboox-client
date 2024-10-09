import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { baseToDollar, bigIntToStrNum } from "../../../common/toolsKit";
import { CashflowProps } from "../FinStatement";
import { SumInfo } from "./CashflowList";
import { getFinData, setFinData } from "../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp, updateMonthlyEthPrices } from "../../../../api/firebase/ethPriceTools";
import { start } from "repl";

export type CbpIncomeSumProps = {
  totalAmt: bigint;
  sumInUsd: bigint;
  royalty: bigint;
  royaltyInUsd: bigint;
  transfer: bigint;
  transferInUsd: bigint;
  mint:bigint;
  mintInUsd: bigint;
  flag: boolean;
}

export const defaultSum: CbpIncomeSumProps = {
  totalAmt: 0n,
  sumInUsd: 0n,
  royalty: 0n,
  royaltyInUsd: 0n,
  transfer: 0n,
  transferInUsd: 0n,
  mint: 0n,
  mintInUsd: 0n,
  flag: false,
}

export interface CashflowRecordsProps {
  inETH: boolean;
  exRate: bigint;
  centPrice: bigint;
  records: CashflowProps[];
  setRecords: Dispatch<SetStateAction<CashflowProps[]>>;
  setSumInfo: Dispatch<SetStateAction<SumInfo[]>>;
  setList: Dispatch<SetStateAction<CashflowProps[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface CbpIncomeProps extends CashflowRecordsProps {
  sum: CbpIncomeSumProps;
  setSum: Dispatch<SetStateAction<CbpIncomeSumProps>>;
}

export function CbpIncome({inETH, exRate, centPrice, sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:CbpIncomeProps ) {
  const { gk } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    let sum:CbpIncomeSumProps = {...defaultSum};

    const cbpToETH = (cbp:bigint) => {
      return cbp * 10000n / exRate;
    }

    const getCbpIncome = async () => {

      if (!gk) return;

      let logs = await getFinData(gk, 'cbpIncome');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      console.log('lastItemOfCbpIncome: ', lastBlkNum);

      let arr: CashflowProps[] = [];
      let ethPrices: EthPrice[] | undefined = [];

      const sumArry = (arr: CashflowProps[]) => {
        arr.forEach(v => {
          sum.totalAmt += v.amt;
          sum.sumInUsd += v.usd;
  
          switch (v.typeOfIncome) {
            case 'Royalty':
              sum.royalty += v.amt;
              sum.royaltyInUsd += v.usd;
              break;
            case 'Transfer': 
              sum.transfer += v.amt;
              sum.transferInUsd += v.usd;
              break;
            case 'Mint': 
              sum.mint += v.amt;
              sum.mintInUsd += v.usd;
              break;
          }
        });
      }

      const appendItem = (newItem: CashflowProps, refPrices: EthPrice[]) => {
        if (newItem.amt > 0n && refPrices.length > 0) {

          const mark = getPriceAtTimestamp(Number(newItem.timestamp * 1000n), refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = cbpToETH(newItem.amt) * newItem.ethPrice / 10n ** 9n;
           
          arr.push(newItem);
        }
      } 

      let transferLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        args: {
          to: gk,
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      transferLogs = transferLogs.filter(v => (v.blockNumber > lastBlkNum) &&
          v.args.from?.toLowerCase() != AddrOfTank.toLowerCase() &&
          v.args.from?.toLowerCase() != "0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7".toLowerCase());

      console.log('transferLogs: ', transferLogs);

      let len = transferLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = transferLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'Royalty',
          amt: log.args.value ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.from ?? AddrZero,
          acct: 0n,
        }

        if (item.addr.toLowerCase() == AddrZero) {
          item.typeOfIncome = 'Mint';
        } else {
          let tran = await client.getTransaction({hash: item.transactionHash});
          
          if ( tran.to?.toLowerCase() == AddrOfRegCenter.toLowerCase() && 
                tran.input.substring(0,10).toLowerCase() == '0xa9059cbb') 
          {  
            item.typeOfIncome = 'Transfer';
          }
        }

        if (cnt == 0) {
          ethPrices = await getEthPricesForAppendRecords(Number(item.timestamp * 1000n));
          if (!ethPrices) return;
          else console.log('ethPrices: ', ethPrices);
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      if (arr.length > 0) {
        
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq: i}));
        console.log('arr: ', arr);

        await setFinData(gk, 'cbpIncome', arr);
        
        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }
      } else if (!logs) {
        return;
      }

      sumArry(logs);
      sum.flag = true;
      
      setRecords(logs);
      setSum(sum);
    }

    if (client && gk) getCbpIncome();

  },[client, gk, exRate, centPrice, setSum, setRecords]);

  const showList = () => {

    let curSumInUsd = sum.totalAmt * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
        ? [ {title: 'CBP Income - (CBP ', data: sum.totalAmt},
            {title: 'Royalty', data: sum.royalty},
            {title: 'Transfer', data: sum.transfer}, 
            {title: 'Mint', data: sum.mint}]
        : [ {title: 'CBP Income - (USD ', data: sum.sumInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - sum.sumInUsd},
            {title: 'Royalty', data: sum.royaltyInUsd},
            {title: 'Transfer', data: sum.transferInUsd},
            {title: 'Mint', data: sum.mintInUsd}]; 
    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }

  return (
  <>
    {sum.flag && (
      <Button 
        variant="outlined"
        fullWidth
        sx={{m:0.5, minWidth:288, justifyContent:'start'}}
        onClick={()=>showList()}
      >
        <b>CBP Income: ({ inETH
            ? bigIntToStrNum(sum.totalAmt * 10000n / exRate / 10n ** 9n, 9) + ' ETH' 
            : baseToDollar((sum.sumInUsd / 10n ** 14n).toString()) + ' USD' })</b>
      </Button>
    )}
  </>
  );
} 