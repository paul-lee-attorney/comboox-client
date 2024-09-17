import { Dispatch, SetStateAction, useEffect, } from "react";
import { Button,} from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, Bytes32Zero, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import {  bigIntToStrNum, HexParser, } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { CashflowProps } from "../FinStatement";

export type FtCashflowSumProps = {
  totalCbp: bigint;
  totalEth: bigint;
  addCbp: bigint;
  withdrawCbp: bigint;
  refuelCbp: bigint;
  refuelEth: bigint;
  withdrawEth: bigint;
  flag: boolean;
}

export const defaultFtSum:FtCashflowSumProps = {
  totalCbp: 0n,
  totalEth: 0n,
  addCbp: 0n,
  withdrawCbp: 0n,
  refuelCbp: 0n,
  refuelEth: 0n,
  withdrawEth: 0n,
  flag: false,
}

export interface FtCashflowProps extends CashflowRecordsProps {
  sum: FtCashflowSumProps;
  setSum: Dispatch<SetStateAction<FtCashflowSumProps>>;
}

export function FtCashflow({sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:FtCashflowProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();
  
  useEffect(()=>{

    let sum: FtCashflowSumProps = { ...defaultFtSum };
    const getFtCashflow = async ()=>{

      if (!gk || !keepers) return;

      let arr: CashflowProps[] = [];
      let counter = 0;

      const appendItem = (newItem: CashflowProps) => {

        if (newItem.amt > 0n) {
      
          switch (newItem.typeOfIncome) {
            case 'AddCbp':
              sum.totalCbp += newItem.amt;
              sum.addCbp += newItem.amt;
              break;
            case 'WithdrawCbp':
              sum.totalCbp -= newItem.amt;
              sum.withdrawCbp += newItem.amt;
              break;
            case 'WithdrawEth':
              sum.totalEth -= newItem.amt;
              sum.withdrawEth += newItem.amt;
              break;
            case 'RefuelCbp':
              sum.totalCbp -= newItem.amt;
              sum.refuelCbp += newItem.amt;
              break; 
            case 'RefuelEth':
              sum.totalEth += newItem.amt;
              sum.refuelEth += newItem.amt;
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
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'RefuelEth',
          amt: log.args.amtOfEth ?? 0n,
          addr: log.args.buyer ?? AddrZero,
          acct: 0n,
        }

        appendItem(item);

        item = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'RefuelCbp',
          amt: log.args.amtOfCbp ?? 0n,
          addr: log.args.buyer ?? AddrZero,
          acct: 0n,
        }

        appendItem(item);
            
        cnt--;
      }

      let withdrawEthLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event WithdrawIncome(address indexed owner, uint indexed amt)'),
        fromBlock: 1n,
      });

      cnt = withdrawEthLogs.length;
      
      while(cnt > 0) {

        let log = withdrawEthLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'WithdrawEth',
          amt: log.args.amt ?? 0n,
          addr: log.args.owner ?? AddrZero,
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

  }, [gk, client, keepers, setSum, setRecords]);

  const showList = () => {
    let arrSumInfo = [
      {title: 'Gas Income - (ETH ', data: sum.refuelEth},
      {title: 'Eth Balance: ', data: sum.totalEth},
      {title: 'Cbp Balance: ', data: sum.totalCbp},
      {title: 'Income Pickup (Wei): ', data: sum.withdrawEth},
      {title: 'Fuel Cost (Lee)', data: sum.refuelCbp},
      {title: 'Fuel Withdrawn (Lee)', data: sum.withdrawCbp},
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
        <b>ETH in FT: ({ bigIntToStrNum(sum.totalEth/10n**9n, 9) } ETH)</b>
      </Button>
    )}
  </>
  );
} 