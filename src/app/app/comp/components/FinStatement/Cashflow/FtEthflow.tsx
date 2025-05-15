import { useEffect, } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, AddrZero, } from "../../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, setFinData } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";
import { delay, HexParser } from "../../../../common/toolsKit";

export type FtEthflowSum = {
  totalEth: bigint;
  totalEthInUsd: bigint;
  refuelEth: bigint;
  refuelEthInUsd: bigint;
  withdrawEth: bigint;
  withdrawEthInUsd: bigint;
  flag: boolean;
}

export const defFtEthflowSum:FtEthflowSum = {
  totalEth: 0n,
  totalEthInUsd: 0n,
  refuelEth: 0n,
  refuelEthInUsd: 0n,
  withdrawEth: 0n,
  withdrawEthInUsd: 0n,
  flag: false,
}

export const defFtEthflowSumArr:FtEthflowSum[] = [
  defFtEthflowSum, defFtEthflowSum, defFtEthflowSum, defFtEthflowSum
] 


export const sumArrayOfFtEthflow = (arr: Cashflow[]) => {
  let sum: FtEthflowSum = {...defFtEthflowSum};

  if (arr.length > 0) {
    arr.forEach(v => {
      switch (v.typeOfIncome) {            
        case 'WithdrawEth':
          sum.totalEth -= v.amt;
          sum.withdrawEth += v.amt;
  
          sum.totalEthInUsd -= v.usd;
          sum.withdrawEthInUsd += v.usd;
  
          break;
        case 'RefuelEth':
          sum.totalEth += v.amt;
          sum.refuelEth += v.amt;
  
          sum.totalEthInUsd += v.usd;
          sum.refuelEthInUsd += v.usd;
  
          break;
      }
    });  
  }

  sum.flag = true;

  return sum;
}

export const updateFtEthflowSum = (arr: Cashflow[], startDate:number, endDate:number) => {
  
  let sum: FtEthflowSum[] = [...defFtEthflowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfFtEthflow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfFtEthflow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfFtEthflow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  // console.log('ftCbpflow range:', startDate, endDate);
  // console.log('ftEthflow:', sum);
  return sum;
}

export function FtEthflow({ exRate, setRecords }:CashflowRecordsProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const getFtCashflow = async ()=>{

      if (!gk || !keepers) return;

      let logs = await getFinData(gk, 'ftEthflow');
      const fromBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      const toBlkNum = await client.getBlockNumber();
      // console.log('lastItemOfEthOutflow: ', lastBlkNum);

      let arr:Cashflow[] = [];
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
      let refuelLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: [  AddrOfTank, 
              HexParser("0x1ACCB0C9A87714c99Bed5Ed93e96Dc0E67cC92c0"), 
              HexParser("0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7") ],
            event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          refuelLogs = [...refuelLogs, ...logs];
          startBlkNum = endBlkNum + 1n;

          await delay(500);

        }catch(error){
          console.error("Error fetching refuelLogs:", error);
          break;
        }
      }

      refuelLogs = refuelLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('refuelLogs: ', refuelLogs);

      let len = refuelLogs.length;
      let cnt = 0;
      
      while(cnt < len) {

        let log = refuelLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'RefuelEth',
          amt: log.args.amtOfEth ?? 0n,
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

      startBlkNum = fromBlkNum;
      let withdrawEthLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: [  AddrOfTank, 
              HexParser("0x1ACCB0C9A87714c99Bed5Ed93e96Dc0E67cC92c0"),
              HexParser("0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7") ],
            event: parseAbiItem('event WithdrawIncome(address indexed owner, uint indexed amt)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          
          withdrawEthLogs = [...withdrawEthLogs, ...logs];
          startBlkNum = endBlkNum + 1n;

          await delay(500);

        }catch(error){
          console.error("Error fetching withdrawEthLogs:", error);
          break;
        }
      }

      withdrawEthLogs = withdrawEthLogs.filter(v => v.blockNumber > fromBlkNum);
      // console.log('withdrawEthLogs: ', withdrawEthLogs);
      
      len = withdrawEthLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = withdrawEthLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'WithdrawEth',
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

      if (arr.length > 0) {
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq:i}));
        console.log('arr added into FtEthflow:', arr);

        await setFinData(gk, 'ftEthflow', arr);

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

  }, [gk, client, keepers, setRecords]);

  return (
  <>
  </>
  );
} 