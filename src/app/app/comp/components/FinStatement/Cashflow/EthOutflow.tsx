import { useEffect } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrZero, keepersMap } from "../../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { HexParser, } from "../../../../common/toolsKit";
import { ethers } from "ethers";
import { Cashflow, CashflowRange, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, setFinData } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";

export type EthOutflowSum = {
  totalAmt: bigint;
  sumInUsd: bigint;
  distribution: bigint;
  distributionInUsd: bigint;
  gmmTransfer: bigint;
  gmmTransferInUsd: bigint;
  gmmExpense: bigint;
  gmmExpenseInUsd: bigint;
  bmmTransfer: bigint;
  bmmTransferInUsd: bigint;
  bmmExpense: bigint;
  bmmExpenseInUsd: bigint;
  flag: boolean;
}

export const defEthOutflowSum:EthOutflowSum = {
  totalAmt: 0n,
  sumInUsd: 0n,
  distribution: 0n,
  distributionInUsd: 0n,
  gmmTransfer: 0n,
  gmmTransferInUsd: 0n,
  gmmExpense: 0n,
  gmmExpenseInUsd: 0n,
  bmmTransfer: 0n,
  bmmTransferInUsd: 0n,
  bmmExpense: 0n,
  bmmExpenseInUsd: 0n,
  flag: false
}

export const defEthOutflowSumArr:EthOutflowSum[] = [
  defEthOutflowSum, defEthOutflowSum, defEthOutflowSum, defEthOutflowSum
] 

export const sumArrayOfEthOutflow = (arr: Cashflow[]) => {
  let sum:EthOutflowSum = {...defEthOutflowSum};

  if (arr.length > 0) {
    arr.forEach(v => {
      sum.totalAmt += v.amt;
      sum.sumInUsd += v.usd;
  
      switch (v.typeOfIncome) {
        case 'GmmTransfer':
          sum.gmmTransfer += v.amt;
          sum.gmmTransferInUsd += v.usd;
          break;
        case 'GmmExpense':
          sum.gmmExpense += v.amt;
          sum.gmmExpenseInUsd += v.usd;
          break;
        case 'BmmTransfer':
          sum.bmmTransfer += v.amt;
          sum.bmmTransferInUsd += v.usd;
          break;
        case 'BmmExpense':
          sum.bmmExpense += v.amt;
          sum.bmmExpenseInUsd += v.usd;
          break;
        case 'Distribution':
          sum.distribution += v.amt;
          sum.distributionInUsd += v.usd;
      }  
    });
  }

  sum.flag = true;

  return sum;
}

export const updateEthOutflowSum = (arr: Cashflow[], startDate:number, endDate:number) => {
  
  let sum: EthOutflowSum[] = [...defEthOutflowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfEthOutflow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfEthOutflow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfEthOutflow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  // console.log('ethOutflow range:', startDate, endDate);
  // console.log('ethOutflow:', sum);
  return sum;
}

export function EthOutflow({ exRate, setRecords}:CashflowRecordsProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const getEthOutflow = async ()=>{

      if (!gk || !keepers ) return;

      let logs = await getFinData(gk, 'ethOutflow');
      const fromBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      const toBlkNum = await client.getBlockNumber();
      // console.log('lastItemOfEthOutflow: ', lastBlkNum);

      let arr: Cashflow[] = [];
      let ethPrices: EthPrice[] = [];

      const getEthPrices = async (timestamp: number): Promise<EthPrice[]> => {
        let prices = await getEthPricesForAppendRecords(timestamp * 1000);
        if (!prices) return [];
        else return prices;
      }

      const appendItem = (newItem: Cashflow, refPrices:EthPrice[]) => {
        if (newItem.amt > 0n) {

          let mark = getPriceAtTimestamp(newItem.timestamp * 1000, refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = newItem.amt * newItem.ethPrice / 10n ** 9n;
              
          arr.push(newItem);
        }
      } 

      let startBlkNum = fromBlkNum;
      let gmmTransferLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: keepers[keepersMap.GMMKeeper],
            event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
            args: {
              isCBP: false
            },
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          gmmTransferLogs = [...gmmTransferLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching gmmTransferLogs:", error);
          break;
        }
      }

      gmmTransferLogs = gmmTransferLogs.filter(v => (v.blockNumber > fromBlkNum) &&
          (v.args.isCBP == false));

      // console.log('gmmTransferEthLogs: ', gmmTransferLogs);

      let len = gmmTransferLogs.length;
      let cnt = 0;
      
      while(cnt < len) {

        let log = gmmTransferLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
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

      startBlkNum = fromBlkNum;
      let gmmExpenseLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: keepers[keepersMap.GMMKeeper],
            event: parseAbiItem('event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          gmmExpenseLogs = [...gmmExpenseLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching gmmExpenseLogs:", error);
          break;
        }
      }

      gmmExpenseLogs = gmmExpenseLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('gmmEthExpLogs: ', gmmExpenseLogs);
      
      len = gmmExpenseLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = gmmExpenseLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'GmmExpense',
          amt: log.args.values ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.targets ?? AddrZero,
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
      let bmmTransferLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: keepers[keepersMap.BMMKeeper],
            event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
            args: {
              isCBP: false
            },
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          bmmTransferLogs = [...bmmTransferLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching bmmTransferLogs:", error);
          break;
        }
      }

      bmmTransferLogs = bmmTransferLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('bmmEthTransferLogs:', bmmTransferLogs);

      len = bmmTransferLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = bmmTransferLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
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

      startBlkNum = fromBlkNum;
      let bmmExpenseLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: keepers[keepersMap.BMMKeeper],
            event: parseAbiItem('event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          bmmExpenseLogs = [...bmmExpenseLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching bmmExpenseLogs:", error);
          break;
        }
      }

      bmmExpenseLogs = bmmExpenseLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('bmmEthExpLogs: ', bmmExpenseLogs);

      len = bmmExpenseLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = bmmExpenseLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'BmmExpense',
          amt: log.args.values ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.targets ?? AddrZero,
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
      let distributionLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: gk,
            event: parseAbiItem('event SaveToCoffer(uint indexed acct, uint256 indexed value, bytes32 indexed reason)'),
            args: {
              reason: HexParser(ethers.encodeBytes32String("DistributeProfits"))
            },
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          distributionLogs = [...distributionLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching distributionLogs:", error);
          break;
        }
      }

      distributionLogs = distributionLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('distributionLogs: ', distributionLogs);

      len = distributionLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = distributionLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: "Distribution",
          amt: log.args.value ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: AddrZero,
          acct: log.args.acct ?? 0n,
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
        console.log('arr added into EthOutflow:', arr);

        await setFinData(gk, 'ethOutflow', arr);

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

    getEthOutflow();

  }, [gk, client, keepers, setRecords]);

  return (
    <>
    </>
  );
} 