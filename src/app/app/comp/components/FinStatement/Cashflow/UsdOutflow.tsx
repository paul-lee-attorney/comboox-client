import { useEffect } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrZero, booxMap, Bytes32Zero, HexType } from "../../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem, hexToString } from "viem";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, setFinData } from "../../../../../api/firebase/finInfoTools";
import { addrToUint, HexParser } from "../../../../common/toolsKit";
import { csHis } from "./UsdInflow";

export type UsdOutflowSum = {
  totalAmt: bigint;
  upgradeCashier: bigint;
  reimburseExp: bigint;
  advanceExp: bigint;
  distributeUsd: bigint;
  flag: boolean;
}

export const defUsdOutflowSum: UsdOutflowSum = {
  totalAmt: 0n,
  upgradeCashier: 0n,
  reimburseExp: 0n,
  advanceExp: 0n,
  distributeUsd: 0n,
  flag: false,
}

export const defUsdOutflowSumArr: UsdOutflowSum[] = [
  defUsdOutflowSum, defUsdOutflowSum, defUsdOutflowSum, defUsdOutflowSum
]

export const sumArrayOfUsdOutflow = (arr: Cashflow[]) => {
  
  let sum: UsdOutflowSum = {...defUsdOutflowSum};

  if (arr.length > 0) {
    arr.forEach(v => {
      sum.totalAmt += v.amt;
  
      switch (v.typeOfIncome) {
        case 'ReimburseExp':
          sum.reimburseExp += v.amt;
          break;
        case 'AdvanceExp': 
          sum.advanceExp += v.amt;
          break;
        case 'DistributeUsd': 
          sum.distributeUsd += v.amt;
          break;
        case 'UpgradeCashier':
          sum.upgradeCashier += v.amt;
          break;
      }
    }); 
  }

  sum.flag = true;

  return sum;
}

export const updateUsdOutflowSum = (arr: Cashflow[], startDate:number, endDate:number ) => {
  
  let sum: UsdOutflowSum[] = [...defUsdOutflowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfUsdOutflow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfUsdOutflow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfUsdOutflow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  console.log('range:', startDate, endDate);
  console.log('usdOutflow:', sum);
  return sum;
}

export function UsdOutflow({exRate, setRecords}:CashflowRecordsProps) {
  const { gk, boox, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const getUsdOutflow = async () => {

      if (!gk || !boox || !keepers) return;

      const cashier = boox[booxMap.Cashier];
      const ros = boox[booxMap.ROS];

      let logs = await getFinData(gk, 'usdOutflow');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;

      let arr: Cashflow[] = [];

      let transferUsdLogs = await client.getLogs({
        address: cashier,
        event: parseAbiItem('event TransferUsd(address indexed to, uint indexed amt, bytes32 indexed remark)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      transferUsdLogs = transferUsdLogs.filter(v => (v.blockNumber > lastBlkNum));
      console.log('transferUsdLogs: ', transferUsdLogs);

      let len = transferUsdLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = transferUsdLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: hexToString(log.args.remark ?? Bytes32Zero, {size:32}),
          amt: log.args.amt ?? 0n,
          ethPrice: addrToUint(cashier),
          usd: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        };
        
        arr.push(item);

        cnt++;
      }

      let distributeUsdLogs = await client.getLogs({
        address: cashier,
        event: parseAbiItem('event DistributeUsd(uint indexed amt)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      distributeUsdLogs = distributeUsdLogs.filter(v => (v.blockNumber > lastBlkNum));
      console.log('distributeUsdLogs: ', distributeUsdLogs);

      len = distributeUsdLogs.length;
      cnt = 0;

      while (cnt < len) {

        let log = distributeUsdLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'DistributeUsd',
          amt: log.args.amt ?? 0n,
          ethPrice: addrToUint(cashier),
          usd: log.args.amt ?? 0n,
          addr: AddrZero,
          acct: 0n,
        };
        
        arr.push(item);

        cnt++;
      }
      
      let upgradeLogs = await client.getLogs({
        address: csHis[0],
        event: parseAbiItem('event TransferUsd(address indexed to, uint indexed amt)'),
        args: {
          to: cashier
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      upgradeLogs = upgradeLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('upgradeLogs: ', upgradeLogs);

      len = upgradeLogs.length;
      cnt = 0;

      while (cnt < len) {

        let log = upgradeLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'UpgradeCashier',
          amt: log.args.amt ?? 0n,
          ethPrice: addrToUint(csHis[0]),
          usd: log.args.amt ?? 0n,
          addr: csHis[0],
          acct: 0n,
        };

        arr.push(item);

        cnt++;
      }      

      console.log('arr in usdOutflow:', arr);

      if (arr.length > 0) {
        
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq: i}));
        console.log('add arr into usdOutflow:', arr);

        await setFinData(gk, 'usdOutflow', arr);
        
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

    if (boox && client) getUsdOutflow();

  },[gk, boox, client, keepers, setRecords]);

  return (
    <></>
  );

} 