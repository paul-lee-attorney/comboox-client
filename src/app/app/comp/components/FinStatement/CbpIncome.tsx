import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { bigIntToStrNum } from "../../../common/toolsKit";
import { CashflowProps } from "../FinStatement";
import { SumInfo } from "./CashflowList";
import { getPriceAtTimestamp } from "./ethPrice/getPriceAtTimestamp";
import { rate } from "../../../fuel_tank/ft";

export type CbpIncomeSumProps = {
  totalAmt: bigint;
  sumInUsd: bigint;
  royalty: bigint;
  mint: bigint;
  newUserAward: bigint;
  withdrawFuel: bigint;
  transfer: bigint;
  flag: boolean;
}

export const defaultSum: CbpIncomeSumProps = {
  totalAmt: 0n,
  sumInUsd: 0n,
  royalty: 0n,
  mint: 0n,
  newUserAward: 0n,
  withdrawFuel: 0n,
  transfer: 0n,
  flag: false,
}

export interface CashflowRecordsProps {
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

export function CbpIncome({sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:CbpIncomeProps ) {
  const { gk } = useComBooxContext();
  
  const client = usePublicClient();

  const [exRate, setExRate] = useState(1n);

  useEffect(()=>{
    const getRate = async ()=> {
      let rateOfEx = await rate();
      setExRate(rateOfEx);
    }
    getRate();
  });

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
    
          let ethPrice = getPriceAtTimestamp(Number(newItem.timestamp));
          newItem.usd = exRate > 0n && ethPrice
              ? cbpToETH(newItem.amt) * BigInt(ethPrice)
              : 0n;

          sum.totalAmt += newItem.amt;
          sum.sumInUsd += newItem.usd;
          newItem.seq = counter;
  
          switch (newItem.typeOfIncome) {
            case 'Royalty':
              sum.royalty += newItem.amt;
              break;
            case 'NewUserAward': 
              sum.newUserAward += newItem.amt;
              break;
            case 'Mint':
              sum.mint += newItem.amt;
              break;
            case 'Transfer': 
              sum.transfer += newItem.amt;
              break;
          }
          
          arr.push(newItem);
          counter++;
        }
      } 


      let mintLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        fromBlock: 1n,
        args: {
          from: AddrZero,
        }
      });

      let cnt = mintLogs.length;
    
      while (cnt > 0) {
        let log = mintLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'NewUserAward',
          amt: log.args.value ?? 0n,
          addr: log.args.to ?? AddrZero,
          usd: 0n,
          acct: 0n,
        }


        if (item.addr.toLowerCase() == gk?.toLowerCase()) {
          item.typeOfIncome = 'Mint';
        }

        appendItem(item);
        cnt--;
      }

      let transferLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        fromBlock: 1n,
        args: {
          to: gk,
        }
      });

      cnt = transferLogs.length;

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
          usd: 0n,
          addr: log.args.from ?? AddrZero,
          acct: 0n,
        }

        if (item.addr.toLowerCase() == AddrOfTank.toLowerCase() || 
          item.addr.toLowerCase() == "0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7".toLowerCase()) {
          item.typeOfIncome = 'WithdrawFuel'
        } else if (item.addr.toLowerCase() == AddrZero.toLowerCase()) {
          cnt--;
          continue;
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

  },[client, gk, exRate, setSum, setRecords]);

  const showList = () => {
    let arrSumInfo = [
      {title: 'CBP Income - (CBP ', data: sum.totalAmt},
      {title: 'SumInUSD', data: sum.sumInUsd},
      {title: 'Royalty', data: sum.royalty},
      {title: 'Mint', data: sum.mint},
      {title: 'NewUserAward', data: sum.newUserAward},
      {title: 'WithdrawFuel', data: sum.withdrawFuel},
      {title: 'Transfer', data: sum.transfer},
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
        <b>CBP Income: ({bigIntToStrNum(sum.totalAmt/10n**9n, 9) + ' CBP'})</b>
      </Button>
    )}
  </>
  );
} 