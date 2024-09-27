import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { bigIntToStrNum } from "../../../common/toolsKit";
import { CashflowProps } from "../FinStatement";
import { SumInfo } from "./CashflowList";
import { getCentPriceInWeiAtTimestamp } from "./ethPrice/getPriceAtTimestamp";

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

      let arr: CashflowProps[] = [];
      let counter = 0;

      const appendItem = (newItem: CashflowProps) => {
        if (newItem.amt > 0n) {
    
          let centPriceHis = getCentPriceInWeiAtTimestamp(Number(newItem.timestamp * 1000n));

          newItem.ethPrice = centPriceHis ?  10n ** 25n / centPriceHis : 10n ** 25n / centPrice;
          newItem.usd = cbpToETH(newItem.amt) * newItem.ethPrice / 10n ** 9n;

          sum.totalAmt += newItem.amt;
          sum.sumInUsd += newItem.usd;

          newItem.seq = counter;
  
          switch (newItem.typeOfIncome) {
            case 'Royalty':
              sum.royalty += newItem.amt;
              sum.royaltyInUsd += newItem.usd;
              break;
            case 'Transfer': 
              sum.transfer += newItem.amt;
              sum.transferInUsd += newItem.usd;
              break;
            case 'Mint': 
              sum.mint += newItem.amt;
              sum.mintInUsd += newItem.usd;
              break;
            }
          
          arr.push(newItem);
          counter++;
        }
      } 

      let transferLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        fromBlock: 1n,
        args: {
          to: gk,
        }
      });

      let cnt = transferLogs.length;

      while (cnt > 0) {
        let log = transferLogs[cnt-1];

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

        if (item.addr.toLowerCase() == AddrOfTank.toLowerCase() ||
          item.addr.toLowerCase() == "0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7".toLowerCase()) {
          item.typeOfIncome = 'WithdrawFuel';
          cnt--;
          continue;
        } else if (item.addr.toLowerCase() == AddrZero) {
          item.typeOfIncome = 'Mint';
        } else {
          let tran = await client.getTransaction({hash: item.transactionHash});
          
          if ( tran.to?.toLowerCase() == AddrOfRegCenter.toLowerCase() && 
                tran.input.substring(0,10).toLowerCase() == '0xa9059cbb') 
          {  
            item.typeOfIncome = 'Transfer';
          }
        }
        
        appendItem(item);
        cnt--;
      }

      sum.flag = true;
      
      setRecords(arr);
      setSum(sum);
    }

    if (client && gk) getCbpIncome();

  },[client, gk, exRate, centPrice, setSum, setRecords]);

  const showList = () => {

    let curSumInUsd = sum.totalAmt * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = [
      {title: 'CBP Income - (CBP ', data: sum.totalAmt},
      {title: 'Sum (USD)', data: sum.sumInUsd},
      {title: 'Exchange Gain/Loss', data: curSumInUsd - sum.sumInUsd},
      {title: 'Royalty', data: sum.royalty},
      {title: 'Royalty (USD)', data: sum.royaltyInUsd},
      {title: 'Transfer', data: sum.transfer},
      {title: 'Transfer (USD)', data: sum.transferInUsd},
      {title: 'Mint', data: sum.mint},
      {title: 'Mint (USD)', data: sum.mintInUsd},
    ]
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
            ? bigIntToStrNum(sum.totalAmt * 10000n / exRate /10n**9n, 9) + ' ETH' 
            : bigIntToStrNum(sum.sumInUsd / 10n ** 9n, 9) + ' USD' })</b>
      </Button>
    )}
  </>
  );
} 