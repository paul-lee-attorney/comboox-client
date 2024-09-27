import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button,  } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, FirstUser, keepersMap, SecondUser } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { bigIntToStrNum, } from "../../../common/toolsKit";
import { CashflowProps } from "../FinStatement";
import { CashflowRecordsProps } from "./CbpIncome";
import { rate } from "../../../fuel_tank/ft";
import { getCentPriceInWei } from "../../../rc";
import { getCentPriceInWeiAtTimestamp } from "./ethPrice/getPriceAtTimestamp";

export type CbpOutflowSumProps = {
  totalAmt: bigint;
  sumInUsd: bigint;
  newUserAward: bigint;
  newUserAwardInUsd: bigint;
  startupCost: bigint;
  startupCostInUsd: bigint;
  fuelSold: bigint;
  fuelSoldInUsd: bigint;
  gmmTransfer: bigint;
  gmmTransferInUsd: bigint;
  bmmTransfer: bigint;
  bmmTransferInUsd: bigint;
  flag: boolean;
}

export const defaultCbpOutSum:CbpOutflowSumProps = {
  totalAmt: 0n,
  sumInUsd: 0n,
  newUserAward: 0n,
  newUserAwardInUsd: 0n,
  startupCost: 0n,
  startupCostInUsd: 0n,
  fuelSold: 0n,
  fuelSoldInUsd: 0n,
  gmmTransfer: 0n,
  gmmTransferInUsd: 0n,
  bmmTransfer: 0n,
  bmmTransferInUsd: 0n,
  flag: false
}

export interface CbpOutflowProps extends CashflowRecordsProps {
  sum: CbpOutflowSumProps;
  setSum: Dispatch<SetStateAction<CbpOutflowSumProps>>;
}

export function CbpOutflow({inETH, exRate, centPrice, sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:CbpOutflowProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();
 
  useEffect(()=>{

    let sum: CbpOutflowSumProps = { ...defaultCbpOutSum};

    const cbpToETH = (cbp:bigint) => {
      return cbp * 10000n / exRate;
    }


    const getEthOutflow = async ()=>{

      if ( !keepers ) return;

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
            case 'NewUserAward': 
              sum.newUserAward += newItem.amt;
              sum.newUserAwardInUsd += newItem.usd;
              break;
            case 'StartupCost': 
              sum.startupCost += newItem.amt;
              sum.startupCostInUsd += newItem.usd;
              break;
            case 'FuelSold':
              sum.fuelSold += newItem.amt;
              sum.fuelSoldInUsd += newItem.usd;
              break;
            case 'GmmTransfer - CBP':
              sum.gmmTransfer += newItem.amt;
              sum.gmmTransferInUsd += newItem.usd;
              break;
            case 'BmmTransfer - CBP':
              sum.bmmTransfer += newItem.amt;
              sum.bmmTransferInUsd += newItem.usd;
          }
          
          arr.push(newItem);
          counter++;
        }
      } 

      let newUserAwardLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        fromBlock: 1n,
        args: {
          from: AddrZero,
        }
      });
    
      let cnt = newUserAwardLogs.length;
    
      while (cnt > 0) {
        let log = newUserAwardLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'NewUserAward',
          amt: log.args.value ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }
        
        if (item.addr.toLowerCase() == gk?.toLowerCase()) {
          cnt--;
          continue;
        } else if (item.addr.toLowerCase() == FirstUser.toLowerCase() ||
          item.addr.toLocaleLowerCase() == SecondUser.toLowerCase()) {
          item.typeOfIncome = 'StartupCost';
        } else {
          appendItem(item);
          cnt--;
        }
      }

      let fuelSoldLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
        fromBlock: 1n,
      });
    
      cnt = fuelSoldLogs.length;
    
      while (cnt > 0) {
        let log = fuelSoldLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'FuelSold',
          amt: log.args.amtOfCbp ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.buyer ?? AddrZero,
          acct: 0n,
        }
        
        appendItem(item);
        cnt--;
      }

      let gmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
        args: {
          isCBP: true
        }
      });
    
      cnt = gmmTransferLogs.length;
    
      while (cnt > 0) {
        let log = gmmTransferLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'GmmTransfer - CBP',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }
        
        if (item.addr.toLowerCase() == AddrOfTank.toLowerCase()) {
          item.typeOfIncome = 'FuelCost';
          cnt--;
          continue;
        }

        appendItem(item);
        cnt--;
      }

      let bmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.BMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
        args:{
          isCBP: true
        }
      });

      cnt = bmmTransferLogs.length;
      
      while(cnt > 0) {

        let log = bmmTransferLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'BmmTransfer - CBP',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }

        appendItem(item);
        cnt--;
      }

      sum.flag = true;

      setRecords(arr);
      setSum(sum);
    }

    getEthOutflow();

  }, [ gk, client, keepers, centPrice, exRate, setSum, setRecords]);


  const showList = () => {

    let curSumInUsd = sum.totalAmt * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = [
      {title: 'CBP Outflow - (CBP ', data: sum.totalAmt},
      {title: 'Sum (USD)', data: sum.sumInUsd},
      {title: 'Exchange Gain / Loss', data: sum.sumInUsd - curSumInUsd},
      {title: 'New User Award', data: sum.newUserAward},
      {title: 'New User Award (USD)', data: sum.newUserAward},
      {title: 'Startup Cost', data: sum.startupCost},
      {title: 'Startup Cost (USD)', data: sum.startupCostInUsd},
      {title: 'Fuel Sold', data: sum.fuelSold},
      {title: 'Fuel Sold (USD)', data: sum.fuelSoldInUsd},
      {title: 'GMM Transfer', data: sum.gmmTransfer},
      {title: 'GMM Transfer (USD)', data: sum.gmmTransferInUsd},
      {title: 'BMM Transfer', data: sum.bmmTransfer},
      {title: 'BMM Transfer (USD)', data: sum.bmmTransferInUsd},
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
          <b>CBP Outflow: ({ inETH 
              ? bigIntToStrNum(sum.totalAmt * 10000n / exRate /10n**9n, 9) + ' ETH'
              : bigIntToStrNum(sum.sumInUsd / 10n**9n, 9) + ' USD' })</b>
        </Button>
      )}
    </>
  );
} 