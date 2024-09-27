import { Dispatch, SetStateAction, useEffect, } from "react";
import { Button,} from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import {  bigIntToStrNum, HexParser, } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { CashflowProps } from "../FinStatement";
import { getCentPriceInWeiAtTimestamp } from "./ethPrice/getPriceAtTimestamp";

export type FtCbpflowSumProps = {
  totalCbp: bigint;
  totalCbpInUsd: bigint;
  addCbp: bigint;
  addCbpInUsd: bigint;
  withdrawCbp: bigint;
  withdrawCbpInUsd: bigint;
  refuelCbp: bigint;
  refuelCbpInUsd: bigint;
  flag: boolean;
}

export const defaultFtCbpSum:FtCbpflowSumProps = {
  totalCbp: 0n,
  totalCbpInUsd: 0n,
  addCbp: 0n,
  addCbpInUsd: 0n,
  withdrawCbp: 0n,
  withdrawCbpInUsd: 0n,
  refuelCbp: 0n,
  refuelCbpInUsd: 0n,
  flag: false,
}

export interface FtCbpflowProps extends CashflowRecordsProps {
  sum: FtCbpflowSumProps;
  setSum: Dispatch<SetStateAction<FtCbpflowSumProps>>;
}

export function FtCbpflow({inETH, exRate, centPrice, sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:FtCbpflowProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    let sum: FtCbpflowSumProps = { ...defaultFtCbpSum };
    const getFtCashflow = async ()=>{

      if (!gk || !keepers) return;

      let arr: CashflowProps[] = [];
      let counter = 0;

      const cbpToETH = (cbp:bigint) => {
        return cbp * 10000n / exRate;
      }    
  
      const appendItem = (newItem: CashflowProps) => {

        if (newItem.amt > 0n) {

          let centPriceHis = getCentPriceInWeiAtTimestamp(Number(newItem.timestamp * 1000n));
          newItem.ethPrice = centPriceHis ?  10n ** 25n / centPriceHis : 10n ** 25n / centPrice;
          newItem.usd = cbpToETH(newItem.amt) * newItem.ethPrice / 10n ** 9n;

          switch (newItem.typeOfIncome) {
            case 'AddCbp':
              sum.totalCbp += newItem.amt;
              sum.addCbp += newItem.amt;
              
              sum.totalCbpInUsd += newItem.usd;
              sum.addCbpInUsd += newItem.usd;

              break;
            case 'WithdrawCbp':
              sum.totalCbp -= newItem.amt;
              sum.withdrawCbp += newItem.amt;

              sum.totalCbpInUsd -= newItem.usd;
              sum.withdrawCbpInUsd += newItem.usd;

              break;
            case 'RefuelCbp':
              sum.totalCbp -= newItem.amt;
              sum.refuelCbp += newItem.amt;

              sum.totalCbpInUsd -= newItem.usd;
              sum.refuelCbpInUsd += newItem.usd;

              break; 
          } 

          newItem.seq = counter;
  
          arr.push(newItem);
          counter++;          
        }
      } 

      let addCbpLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        fromBlock: 1n,
        args: {
          from: gk,
          to: AddrOfTank,
        }
      });
    
      let cnt = addCbpLogs.length;
    
      while (cnt > 0) {
        let log = addCbpLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'AddCbp',
          amt: log.args.value ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.from ?? AddrZero,
          acct: 0n,
        }
        
        appendItem(item);
        cnt--;
      }

      let withdrawCbpLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event WithdrawFuel(address indexed owner, uint indexed amt)'),
        fromBlock: 1n,
      });

      cnt = withdrawCbpLogs.length;
      
      while(cnt > 0) {

        let log = withdrawCbpLogs[cnt-1];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'WithdrawCbp',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,          
          addr: log.args.owner ?? AddrZero,
          acct: 0n,
        }
    
        appendItem(item);
        cnt--;
      }

      let refuelLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
        fromBlock: 1n,
      });

      cnt = refuelLogs.length;
      
      while(cnt > 0) {

        let log = refuelLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'RefuelCbp',
          amt: log.args.amtOfCbp ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.buyer ?? AddrZero,
          acct: 0n,
        }

        appendItem(item);
            
        cnt--;
      }

      sum.flag = true;

      setRecords(arr);
      setSum(sum);
    }

    getFtCashflow();

  }, [gk, client, exRate, centPrice, keepers, setSum, setRecords]);

  const showList = () => {
    let curSumCbpInUsd =  sum.totalCbp * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = [
      {title: 'Cbp Balance - (CBP', data: sum.totalCbp},
      {title: 'Cbp Balance (USD)', data: sum.totalCbpInUsd},
      {title: 'Exchange Gain/Loss', data: sum.totalCbpInUsd - curSumCbpInUsd},
      {title: 'Fuel Sold', data: sum.refuelCbp},
      {title: 'Fuel Sold (USD)', data: sum.refuelCbpInUsd},
      {title: 'Fuel Withdrawn', data: sum.withdrawCbp},
      {title: 'Fuel Withdrawn (USD)', data: sum.withdrawCbpInUsd},
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
        <b>CBP in FT: ({ inETH
            ? bigIntToStrNum(sum.totalCbp * 10000n / exRate / 10n**9n, 9) + ' ETH'
            : bigIntToStrNum(sum.totalCbpInUsd / 10n**9n, 9) + ' USD' })</b>
      </Button>
    )}
  </>
  );
} 