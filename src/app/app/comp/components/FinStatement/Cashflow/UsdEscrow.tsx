import { useEffect } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrZero, booxMap, Bytes32Zero, HexType } from "../../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem, hexToString } from "viem";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, setFinData } from "../../../../../api/firebase/finInfoTools";
import { addrToUint, delay } from "../../../../common/toolsKit";

export type UsdEscrowSum = {
  totalAmt: bigint;
  forward: bigint;
  escrow: bigint;
  consideration: bigint;
  balance: bigint;
  distribution: bigint;
  pickup: bigint;
  flag: boolean;
}

export const defUsdEscrowSum: UsdEscrowSum = {
  totalAmt: 0n,
  forward: 0n,
  escrow: 0n,
  consideration: 0n,
  balance: 0n,
  distribution: 0n,
  pickup: 0n,
  flag: false,
}

export const defUsdEscrowSumArr: UsdEscrowSum[] = [
  defUsdEscrowSum, defUsdEscrowSum, defUsdEscrowSum, defUsdEscrowSum
]

export const sumArrayOfUsdEscrow = (arr: Cashflow[]) => {
  
  let sum: UsdEscrowSum = {...defUsdEscrowSum};

  if (arr.length > 0) {
    arr.forEach(v => {  
      switch (v.typeOfIncome) {
        case 'PickupUsd':
          sum.totalAmt -= v.amt;
          sum.pickup += v.amt;
          break;
        case 'PayOffSwap': 
        case 'PayOffRejectedDeal':
        case 'PayOffShareTransferDeal':
        case 'PayOffCapIncreaseDeal':
          sum.forward += v.amt;
          break;
        case 'CloseBidAgainstOffer':
        case 'CloseOfferAgainstBid': 
        case 'CloseBidAgainstInitOffer':
        case 'CloseInitOfferAgainstBid':
          sum.totalAmt -= v.amt;
          sum.consideration += v.amt;
          break;
        case 'CustodyValueOfBid':
          sum.totalAmt += v.amt;
          sum.escrow += v.amt;
          break;
        case 'RefundValueOfBidOrder':
        case 'RefundBalanceOfBidOrder':
          sum.totalAmt -= v.amt;
          sum.balance += v.amt;
          break;
        case 'DistributeUsd':
          sum.totalAmt += v.amt;
          sum.distribution += v.amt;
          break;
      }
    }); 
  }

  sum.flag = true;

  return sum;
}

export const updateUsdEscrowSum = (arr: Cashflow[], startDate:number, endDate:number ) => {
  
  let sum: UsdEscrowSum[] = [...defUsdEscrowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfUsdEscrow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfUsdEscrow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfUsdEscrow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  console.log('range:', startDate, endDate);
  console.log('usdEscrow:', sum);
  return sum;
}

export function UsdEscrow({exRate, setRecords}:CashflowRecordsProps) {
  const { gk, boox, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const getUsdEscrow = async () => {

      if (!gk || !boox || !keepers) return;

      const cashier = boox[booxMap.Cashier];

      let logs = await getFinData(gk, 'usdEscrow');
      const fromBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      const toBlkNum = await client.getBlockNumber();

      console.log('obtained usdEscrow logs:', logs);

      let arr: Cashflow[] = [];

      let startBlkNum = fromBlkNum;
      let forwardUsdLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: cashier,
            event: parseAbiItem('event ForwardUsd(address indexed from, address indexed to, uint indexed amt, bytes32 remark)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          console.log("obtained logs:", logs);
          
          forwardUsdLogs = [...forwardUsdLogs, ...logs];
          startBlkNum = endBlkNum + 1n;

          await delay(500);
          
        }catch(error){
          console.error("Error fetching forwardUsdLogs:", error);
          break;
        }
      }

      forwardUsdLogs = forwardUsdLogs.filter((v:any) => (v.blockNumber > fromBlkNum));
      console.log('forwardUsdLogs: ', forwardUsdLogs);

      let len = forwardUsdLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = forwardUsdLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: hexToString(log.args.remark ?? Bytes32Zero, {size:32}),
          amt: log.args.amt ?? 0n,
          ethPrice: addrToUint(log.args.from ?? AddrZero),
          usd: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        };
        
        arr.push(item);

        cnt++;
      }

      startBlkNum = fromBlkNum;
      let releaseUsdLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: cashier,
            event: parseAbiItem('event ReleaseUsd(address indexed from, address indexed to, uint indexed amt, bytes32 remark)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          console.log("obtained logs:", logs);
          
          releaseUsdLogs = [...releaseUsdLogs, ...logs];
          startBlkNum = endBlkNum + 1n;

          await delay(500);

        }catch(error){
          console.error("Error fetching releaseUsdLogs:", error);
          break;
        }
      }

      releaseUsdLogs = releaseUsdLogs.filter((v:any) => v.blockNumber > fromBlkNum);
      console.log('releaseUsdLogs: ', releaseUsdLogs);

      len = releaseUsdLogs.length;
      cnt = 0;

      while (cnt < len) {
        let log = releaseUsdLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: hexToString(log.args.remark ?? Bytes32Zero, {size:32}),
          amt: log.args.amt ?? 0n,
          ethPrice: addrToUint(log.args.from ?? AddrZero),
          usd: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        };
        
        arr.push(item);

        cnt++;
      }

      startBlkNum = fromBlkNum;
      let custodyUsdLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: cashier,
            event: parseAbiItem('event CustodyUsd(address indexed from, uint indexed amt, bytes32 indexed remark)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          console.log("obtained logs:", logs);
          
          custodyUsdLogs = [...custodyUsdLogs, ...logs];
          startBlkNum = endBlkNum + 1n;

          await delay(500);

        }catch(error){
          console.error("Error fetching custodyUsdLogs:", error);
          break;
        }
      }

      custodyUsdLogs = custodyUsdLogs.filter((v:any) => (v.blockNumber > fromBlkNum));
      console.log('custodyUsdLogs: ', custodyUsdLogs);

      len = custodyUsdLogs.length;
      cnt = 0;

      while (cnt < len) {

        let log = custodyUsdLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: hexToString(log.args.remark ?? Bytes32Zero, {size:32}),
          amt: log.args.amt ?? 0n,
          ethPrice: addrToUint(log.args.from ?? AddrZero),
          usd: log.args.amt ?? 0n,
          addr: cashier,
          acct: 0n,
        };
        
        arr.push(item);

        cnt++;
      }
      
      startBlkNum = fromBlkNum;
      let distributeUsdLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: cashier,
            event: parseAbiItem('event DistributeUsd(uint indexed amt)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          console.log("obtained logs:", logs);
          
          distributeUsdLogs = [...distributeUsdLogs, ...logs];
          startBlkNum = endBlkNum + 1n;

          await delay(500);

        }catch(error){
          console.error("Error fetching distributeUsdLogs:", error);
          break;
        }
      }

      distributeUsdLogs = distributeUsdLogs.filter((v:any) => (v.blockNumber > fromBlkNum));
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
          ethPrice: 0n,
          usd: log.args.amt ?? 0n,
          addr: cashier,
          acct: 0n,
        };
        
        arr.push(item);

        cnt++;
      }

      startBlkNum = fromBlkNum;
      let pickupUsdLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 499n > toBlkNum ? toBlkNum : startBlkNum + 499n;
        try{
          let logs = await client.getLogs({
            address: cashier,
            event: parseAbiItem('event PickupUsd(address indexed msgSender, uint indexed caller, uint indexed value)'),
            fromBlock: startBlkNum,
            toBlock: endBlkNum,
          });
          console.log("obtained logs:", logs);
          
          pickupUsdLogs = [...pickupUsdLogs, ...logs];
          startBlkNum = endBlkNum + 1n;

          await delay(500);

        }catch(error){
          console.error("Error fetching pickupUsdLogs:", error);
          break;
        }
      }

      pickupUsdLogs = pickupUsdLogs.filter((v:any) => (v.blockNumber > fromBlkNum));
      console.log('pickupUsdLogs: ', pickupUsdLogs);

      len = pickupUsdLogs.length;
      cnt = 0;

      while (cnt < len) {

        let log = pickupUsdLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'PickupUsd',
          amt: log.args.value ?? 0n,
          ethPrice: 0n,
          usd: log.args.value ?? 0n,
          addr: log.args.msgSender ?? AddrZero,
          acct: log.args.caller ?? 0n,
        };
        
        arr.push(item);

        cnt++;
      }

      console.log('arr in usdEscrow:', arr);

      if (arr.length > 0) {
        
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq: i}));
        console.log('add arr into usdEscrow:', arr);

        await setFinData(gk, 'usdEscrow', arr);
        
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

    if (boox && client) getUsdEscrow();

  },[gk, boox, client, keepers, setRecords]);

  return (
    <></>
  );

} 