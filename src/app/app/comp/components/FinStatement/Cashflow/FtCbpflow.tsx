import { useEffect, } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, } from "../../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { HexParser } from "../../../../common/toolsKit";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, setFinData } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";

export type FtCbpflowSum = {
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

export const defFtCbpflowSum:FtCbpflowSum = {
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

export const defFtCbpflowSumArr:FtCbpflowSum[] = [
  defFtCbpflowSum, defFtCbpflowSum, defFtCbpflowSum, defFtCbpflowSum
] 

export const sumArrayOfFtCbpflow = (arr: Cashflow[]) => {

  let sum: FtCbpflowSum = { ...defFtCbpflowSum };

  if (arr.length > 0) {
    arr.forEach(v => {

      switch (v.typeOfIncome) {
        case 'AddCbp':
          sum.totalCbp += v.amt;
          sum.addCbp += v.amt;
          
          sum.totalCbpInUsd += v.usd;
          sum.addCbpInUsd += v.usd;
  
          break;
  
        case 'WithdrawCbp':
          sum.totalCbp -= v.amt;
          sum.withdrawCbp += v.amt;
  
          sum.totalCbpInUsd -= v.usd;
          sum.withdrawCbpInUsd += v.usd;
  
          break;
  
        case 'RefuelCbp':
          sum.totalCbp -= v.amt;
          sum.refuelCbp += v.amt;
  
          sum.totalCbpInUsd -= v.usd;
          sum.refuelCbpInUsd += v.usd;
  
          break;
      }  
    });
  }

  sum.flag = true;
  
  return sum;
}

export const ftHis = [
  AddrOfTank,
  HexParser("0x1ACCB0C9A87714c99Bed5Ed93e96Dc0E67cC92c0"), 
  HexParser("0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7")
];

export const updateFtCbpflowSum = (arr: Cashflow[], startDate:number, endDate:number) => {
  
  let sum: FtCbpflowSum[] = [...defFtCbpflowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfFtCbpflow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfFtCbpflow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfFtCbpflow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  // console.log('ftCbpflow range:', startDate, endDate);
  // console.log('ftCbpflow:', sum);
  return sum;
}

export function FtCbpflow({exRate, setRecords}:CashflowRecordsProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const getFtCashflow = async ()=>{

      if (!gk || !keepers) return;

      let logs = await getFinData(gk, 'ftCbpflow');
      const fromBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      const toBlkNum = await client.getBlockNumber();
      // console.log('lastItemOfFtCbpflow: ', lastBlkNum);

      let arr: Cashflow[] = [];
      let ethPrices: EthPrice[] = [];

      const getEthPrices = async (timestamp: number): Promise<EthPrice[]> => {
        let prices = await getEthPricesForAppendRecords(timestamp * 1000);
        if (!prices) return [];
        else return prices;
      }

      const cbpToETH = (cbp:bigint) => {
        return cbp * 10000n / exRate;
      }    
  

      const appendItem = (newItem: Cashflow, refPrices:EthPrice[]) => {
        if (newItem.amt > 0n) {

          let mark = getPriceAtTimestamp(newItem.timestamp * 1000, refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = cbpToETH(newItem.amt) * newItem.ethPrice / 10n ** 9n;
  
          arr.push(newItem);
        }
      } 

      let startBlkNum = fromBlkNum;
      let addCbpLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: AddrOfRegCenter,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
            args: {
              from: gk,
              to: ftHis,
            },
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          addCbpLogs = [...addCbpLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching addCbpLogs:", error);
          break;
        }
      }

      addCbpLogs = addCbpLogs.filter( v => v.blockNumber > fromBlkNum);
      // console.log('addCbpLogs: ', addCbpLogs);
    
      let len = addCbpLogs.length;
      let cnt = 0;
    
      while (cnt < len) {
        let log = addCbpLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'AddCbp',
          amt: log.args.value ?? 0n,
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

      startBlkNum = fromBlkNum;
      let withdrawCbpLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: ftHis,
            event: parseAbiItem('event WithdrawFuel(address indexed owner, uint indexed amt)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          withdrawCbpLogs = [...withdrawCbpLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching withdrawCbpLogs:", error);
          break;
        }
      }

      withdrawCbpLogs = withdrawCbpLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('withdrawCbpLogs: ', withdrawCbpLogs);

      len = withdrawCbpLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = withdrawCbpLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'WithdrawCbp',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,          
          addr: log.args.owner ?? AddrZero,
          acct: 0n,
        }
    
        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      startBlkNum = fromBlkNum;
      let deprecateLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: AddrOfRegCenter,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
            args: {
              from: `0x${'FE8b7e87bb5431793d2a98D3b8ae796796403fA7'}`,
              to: gk,
            },
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          deprecateLogs = [...deprecateLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching deprecateLogs:", error);
          break;
        }
      }
    
      deprecateLogs = deprecateLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('deprecateLogs: ', deprecateLogs);

      len = deprecateLogs.length;
      cnt = 0;
    
      while (cnt < len) {
        let log = deprecateLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'WithdrawCbp',
          amt: log.args.value ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.from ?? AddrZero,
          acct: 0n,
        }
        
        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      startBlkNum = fromBlkNum;
      let refuelLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: ftHis,
            event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          refuelLogs = [...refuelLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching refuelLogs:", error);
          break;
        }
      }

      refuelLogs = refuelLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('refuelLogs: ', refuelLogs);

      len = refuelLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = refuelLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'RefuelCbp',
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

      if (arr.length > 0) {
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq:i}));
        console.log('arr added into FtCbpflow:', arr);

        await setFinData(gk, 'ftCbpflow', arr);

        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }
        
      } 

      if (logs && logs.length > 0) {
        logs = logs.map((v,i) => ({...v, seq:i}));
        setRecords(logs);
      }

    }

    getFtCashflow();

  }, [gk, client, exRate, keepers, setRecords]);

  return (
  <>
  </>
  );
} 