import { Dispatch, SetStateAction, useEffect } from "react";
import { Button,  } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, FirstUser, keepersMap, SecondUser } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { baseToDollar, bigIntToStrNum, } from "../../../common/toolsKit";
import { CashflowProps } from "../FinStatement";
import { CashflowRecordsProps } from "./CbpIncome";
import { getFinData, setFinData } from "../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../api/firebase/ethPriceTools";

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

      if ( !gk || !keepers ) return;

      let logs = await getFinData(gk, 'cbpOutflow');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      console.log('lastItemOfCbpOutflow: ', lastBlkNum);

      let arr: CashflowProps[] = [];
      let ethPrices: EthPrice[] = [];

      const getEthPrices = async (timestamp: bigint): Promise<EthPrice[]> => {
        let prices = await getEthPricesForAppendRecords(Number(timestamp * 1000n));
        if (!prices) return [];
        else return prices;
      }

      const sumArry = (arr: CashflowProps[]) => {
        arr.forEach(v => {
          sum.totalAmt += v.amt;
          sum.sumInUsd += v.usd;

          switch (v.typeOfIncome) {
            case 'NewUserAward': 
              sum.newUserAward += v.amt;
              sum.newUserAwardInUsd += v.usd;
              break;
            case 'StartupCost': 
              sum.startupCost += v.amt;
              sum.startupCostInUsd += v.usd;
              break;
            case 'FuelSold':
              sum.fuelSold += v.amt;
              sum.fuelSoldInUsd += v.usd;
              break;
            case 'GmmTransfer':
              sum.gmmTransfer += v.amt;
              sum.gmmTransferInUsd += v.usd;
              break;
            case 'BmmTransfer':
              sum.bmmTransfer += v.amt;
              sum.bmmTransferInUsd += v.usd;
              break;
          }

        });
      }

      const appendItem = (newItem: CashflowProps, refPrices:EthPrice[]) => {
        if (newItem.amt > 0n) {

          let mark = getPriceAtTimestamp(Number(newItem.timestamp * 1000n), refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = cbpToETH(newItem.amt) * newItem.ethPrice / 10n ** 9n;
            
          arr.push(newItem);
        }
      } 

      let newUserAwardLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        args: {
          from: AddrZero,
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });
    
      newUserAwardLogs = newUserAwardLogs.filter(v => (v.blockNumber > lastBlkNum) &&
          v.args.to?.toLowerCase() != gk.toLowerCase());
      console.log('newUserAwardlogs: ', newUserAwardLogs);

      let len = newUserAwardLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = newUserAwardLogs[cnt];
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
        
        if (item.addr.toLowerCase() == FirstUser.toLowerCase() ||
          item.addr.toLowerCase() == SecondUser.toLowerCase()) {
          item.typeOfIncome = 'StartupCost';
        } 

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      let fuelSoldLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      fuelSoldLogs = fuelSoldLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('fuelSoldLogs: ')
    
      len = fuelSoldLogs.length;
      cnt = 0;
    
      while (cnt < len) {
        let log = fuelSoldLogs[cnt];
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
        
        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      let gmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        args: {
          isCBP: true
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });
    
      gmmTransferLogs = gmmTransferLogs.filter(v => (v.blockNumber > lastBlkNum) &&
          v.args.isCBP == true &&
          v.args.to?.toLowerCase() != AddrOfTank.toLowerCase() &&
          v.args.to?.toLowerCase() != "0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7".toLowerCase());

      console.log('gmmTransferCbpLogs: ', gmmTransferLogs);

      len = gmmTransferLogs.length;
      cnt = 0;

      while (cnt < len) {
        let log = gmmTransferLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'GmmTransfer',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }
        
        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      let bmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.BMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        args:{
          isCBP: true
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      bmmTransferLogs = bmmTransferLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('bmmTransferCbpLogs: ', bmmTransferLogs);

      len = bmmTransferLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = bmmTransferLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'BmmTransfer',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      if (arr.length > 0) {

        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq:i}));
        console.log('arr: ', arr);

        await setFinData(gk, 'cbpOutflow', arr);

        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }

      } else if (!logs) {
        logs = [];
      }

      sumArry(logs);
      sum.flag = true;

      setRecords(logs);
      setSum(sum);
    }

    getEthOutflow();

  }, [ gk, client, keepers, exRate, setSum, setRecords]);


  const showList = () => {

    let curSumInUsd = sum.totalAmt * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
        ? [ {title: 'CBP Outflow - (CBP ', data: sum.totalAmt},
            {title: 'New User Award', data: sum.newUserAward},
            {title: 'Startup Cost', data: sum.startupCost},
            {title: 'Fuel Sold', data: sum.fuelSold},
            {title: 'GMM Transfer', data: sum.gmmTransfer},
            {title: 'BMM Transfer', data: sum.bmmTransfer} 
          ]
        : [ {title: 'CBP Outflow - (USD ', data: sum.sumInUsd},
            {title: 'Exchange Gain/Loss', data: sum.sumInUsd - curSumInUsd},
            {title: 'New User Award', data: sum.newUserAward},
            {title: 'Startup Cost', data: sum.startupCostInUsd},
            {title: 'Fuel Sold', data: sum.fuelSoldInUsd},
            {title: 'GMM Transfer', data: sum.gmmTransferInUsd},
            {title: 'BMM Transfer', data: sum.bmmTransferInUsd} 
          ];
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
              : baseToDollar((sum.sumInUsd / 10n**14n).toString()) + ' USD' })</b>
        </Button>
      )}
    </>
  );
} 