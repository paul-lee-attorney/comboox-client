import { useEffect } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrZero, Bytes32Zero } from "../../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { ethers } from "ethers";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, setFinData } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";

export type DepositsSum = {
  totalAmt: bigint;
  sumInUsd: bigint;
  consideration: bigint;
  considerationInUsd: bigint;
  balance: bigint;
  balanceInUsd: bigint;
  custody: bigint;
  custodyInUsd: bigint;
  distribution: bigint;
  distributionInUsd: bigint;
  pickup: bigint;
  pickupInUsd: bigint;
  flag: boolean;
}

export const defDepositsSum:DepositsSum = {
  totalAmt: 0n,
  sumInUsd: 0n,
  consideration: 0n,
  considerationInUsd: 0n,
  balance: 0n,
  balanceInUsd: 0n,
  custody: 0n,
  custodyInUsd: 0n,
  distribution: 0n,
  distributionInUsd: 0n,
  pickup: 0n,
  pickupInUsd: 0n,
  flag: false,
}

export const defDepositsSumArr:DepositsSum[] = [
  defDepositsSum, defDepositsSum, defDepositsSum, defDepositsSum
] 

export const sumArrayOfDeposits = (arr: Cashflow[]) => {

  let sum: DepositsSum = {...defDepositsSum};

  if (arr.length > 0) {
    arr.forEach(v => {
      switch (v.typeOfIncome) {
        case 'Pickup':
          sum.totalAmt -= v.amt;
          sum.sumInUsd -= v.usd;
          sum.pickup += v.amt;
          sum.pickupInUsd += v.usd;
          break;
        case 'DepositConsiderationOfSTDeal':
        case 'CloseBidAgainstOffer':
        case 'DepositConsiderationOfSwap': 
        case 'DepositConsiderOfRejectedDeal':
          sum.totalAmt += v.amt;
          sum.sumInUsd += v.usd;
          sum.consideration += v.amt;
          sum.considerationInUsd += v.usd;
          break;
        case 'DepositBalanceOfOTCDeal': 
        case 'DepositBalanceOfPayInCap':
        case 'DepositBalanceOfSwap':
        case 'DepositBalanceOfBidOrder':
        case 'DepositBalanceOfRejectedDeal':
          sum.totalAmt += v.amt;
          sum.sumInUsd += v.usd;
          sum.balance += v.amt;
          sum.balanceInUsd += v.usd;
          break;
        case 'CustodyValueOfBidOrder':
          sum.totalAmt += v.amt;
          sum.sumInUsd += v.usd;
          sum.custody += v.amt;
          sum.custodyInUsd += v.usd;
          v.acct = BigInt(v.acct / 2n**40n);
          break;
        case 'CloseOfferAgainstBid': 
          sum.custody -= v.amt;
          sum.custodyInUsd -= v.usd;
          sum.consideration += v.amt;
          sum.considerationInUsd += v.usd;
          break;
        case 'RefundValueOfBidOrder':
          sum.custody -= v.amt;
          sum.custodyInUsd -= v.usd;
          sum.balance += v.amt;
          sum.balanceInUsd += v.usd;
          break;
        case 'CloseInitOfferAgainstBid':
          sum.totalAmt -= v.amt;
          sum.sumInUsd -= v.usd;
          sum.custody -= v.amt;
          sum.custodyInUsd -= v.usd;
          break;
        case 'DistributeProfits':
          sum.totalAmt += v.amt;
          sum.sumInUsd += v.usd;
          sum.distribution += v.amt;
          sum.distributionInUsd += v.usd;
          break;
      }
    });
  }

  sum.flag = true;

  return sum;
}

export const updateDepositsSum = (arr: Cashflow[], startDate:number, endDate:number) => {
  
  let sum: DepositsSum[] = [...defDepositsSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfDeposits(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfDeposits(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfDeposits(arr.filter(v => v.timestamp <= endDate));  
  }
  
  // console.log('deposits range:', startDate, endDate);
  // console.log('deposits:', sum);
  return sum;
}

export function Deposits({ exRate, setRecords}:CashflowRecordsProps ) {
  const { gk } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const getDeposits = async ()=>{

      if (!gk) return;

      let logs = await getFinData(gk, 'deposits');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      // console.log('latestBlkOfDeposits: ', lastBlkNum);

      let arr: Cashflow[] = [];
      let ethPrices: EthPrice[] = [];

      const getEthPrices = async (timestamp: number): Promise<EthPrice[]> => {
        let prices = await getEthPricesForAppendRecords(timestamp * 1000);
        if (!prices) return [];
        else return prices;
      }

      const appendItem = (newItem: Cashflow, refPrices: EthPrice[]) => {
        if (newItem.amt > 0n) {

          let mark = getPriceAtTimestamp(newItem.timestamp * 1000, refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = newItem.amt * newItem.ethPrice / 10n ** 9n;
          
          arr.push(newItem);
        }
      } 

      let pickupLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event PickupDeposit(address indexed to, uint indexed caller, uint indexed amt)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      pickupLogs = pickupLogs.filter(v => v.blockNumber > lastBlkNum);
      // console.log('pickupLogs: ', pickupLogs);

      let len = pickupLogs.length;
      let cnt = 0;

      while(cnt < len) {

        let log = pickupLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'Pickup',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.to ?? AddrZero,
          acct: log.args.caller ?? 0n,
        }
    
        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      let depositLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event SaveToCoffer(uint indexed acct, uint256 indexed value, bytes32 indexed reason)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      depositLogs = depositLogs.filter(v => v.blockNumber > lastBlkNum);
      // console.log('depositLogs: ', depositLogs);

      len = depositLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = depositLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: ethers.decodeBytes32String(log.args.reason ?? Bytes32Zero),
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

      let custodyLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReleaseCustody(uint indexed from, uint indexed to, uint indexed amt, bytes32 reason)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      custodyLogs = custodyLogs.filter(v => v.blockNumber > lastBlkNum);
      // console.log('custodyLogs: ', custodyLogs);

      len = custodyLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = custodyLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: ethers.decodeBytes32String(log.args.reason ?? Bytes32Zero),
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: AddrZero,
          acct: log.args.to ?? 0n,
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
        console.log('arr added into Deposits:', arr);

        await setFinData(gk, 'deposits', arr);

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

    getDeposits();

  }, [gk, client, setRecords]);

  return (
    <>
    </>
  );
} 