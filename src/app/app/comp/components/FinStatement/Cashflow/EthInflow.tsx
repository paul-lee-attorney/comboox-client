import { useEffect, } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, AddrZero, Bytes32Zero, keepersMap } from "../../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { ethers } from "ethers";
import { getFinData, setFinData } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";

export type EthInflowSum = {
  totalAmt: bigint;
  sumInUsd: bigint;
  gas: bigint;
  gasInUsd: bigint;
  capital: bigint;
  capitalInUsd: bigint;
  transfer: bigint;
  transferInUsd: bigint;
  flag: boolean;
}

export const defEthInflowSum:EthInflowSum = {
  totalAmt: 0n,
  sumInUsd: 0n,
  gas: 0n,
  gasInUsd: 0n,
  capital: 0n,
  capitalInUsd: 0n,
  transfer: 0n,
  transferInUsd: 0n,
  flag: false,
}

export const defEthInflowSumArr:EthInflowSum[] = [
  defEthInflowSum, defEthInflowSum, defEthInflowSum, defEthInflowSum,
] 

export const sumArrayOfEthInflow = (arr: Cashflow[]): EthInflowSum => {
  let sum:EthInflowSum = {...defEthInflowSum};

  if (arr.length > 0) {
    arr.forEach(v => {
      sum.totalAmt += v.amt;
      sum.sumInUsd += v.usd;
  
      switch (v.typeOfIncome) {
        case 'TransferIncome':
          sum.transfer += v.amt;
          sum.transferInUsd += v.usd;
          break;
        case 'GasIncome':
          sum.gas += v.amt;
          sum.gasInUsd += v.usd;
          break;
        case 'PayInCap':
        case 'PayOffCIDeal':
        case 'CloseBidAgainstInitOffer':
          sum.capital += v.amt;
          sum.capitalInUsd += v.usd;
          break;
        case 'CloseInitOfferAgainstBid':
          sum.capital += v.amt;
          sum.capitalInUsd += v.usd;
          v.acct = BigInt(v.acct / 2n**40n);
          break;
      }  
    });  
  }

  sum.flag = true;

  return sum;
}

export const updateEthInflowSum = (arr: Cashflow[], startDate:number, endDate:number) => {
  
  let sum: EthInflowSum[] = [...defEthInflowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfEthInflow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfEthInflow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfEthInflow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  console.log('ethInflow range:', startDate, endDate);
  console.log('ethInflow:', sum);
  return sum;
}

export function EthInflow({exRate, setRecords}:CashflowRecordsProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const getEthInflow = async ()=>{

      if (!gk || !keepers) return;

      let logs = await getFinData(gk, 'ethInflow');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      console.log('lastItemOfEthInflow: ', lastBlkNum);

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

      let recievedCashLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReceivedCash(address indexed from, uint indexed amt)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });
    
      recievedCashLogs = recievedCashLogs.filter(v => (v.blockNumber > lastBlkNum) &&
          (v.args.from?.toLowerCase() != AddrOfTank.toLowerCase()));
      console.log('recievedCashLogs: ', recievedCashLogs);

      let len = recievedCashLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = recievedCashLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = { ...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'TransferIncome',
          amt: log.args.amt ?? 0n,
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

      let gasIncomeLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      gasIncomeLogs = gasIncomeLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('gasIncomeLogs: ', gasIncomeLogs);
    
      len = gasIncomeLogs.length;
      cnt = 0;

      while (cnt < len) {
        let log = gasIncomeLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'GasIncome',
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

      let payInCapLogs = await client.getLogs({
        address: keepers[keepersMap.ROMKeeper],
        event: parseAbiItem('event PayInCapital(uint indexed seqOfShare, uint indexed amt, uint indexed valueOfDeal)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      payInCapLogs = payInCapLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('payInCapLogs: ', payInCapLogs);

      len = payInCapLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = payInCapLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'PayInCap',
          amt: log.args.valueOfDeal ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: AddrZero,
          acct: 0n,
        }

        let tran = await client.getTransaction({
          hash: item.transactionHash,
        });

        item.addr = tran.from;

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }
    
        appendItem(item, ethPrices);
        cnt++;
      }

      let payOffCIDealLogs = await client.getLogs({
        address: keepers[keepersMap.ROAKeeper],
        event: parseAbiItem('event PayOffCIDeal(uint indexed caller, uint indexed valueOfDeal)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      payOffCIDealLogs = payOffCIDealLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('payOffCIDealLogs: ', payOffCIDealLogs);

      len = payOffCIDealLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = payOffCIDealLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'PayOffCIDeal',
          amt: log.args.valueOfDeal ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: AddrZero,
          acct: log.args.caller ?? 0n,
        }

        let tran = await client.getTransaction({
          hash: item.transactionHash
        })

        item.addr = tran.from;

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);    
        cnt++;
      }

      let closeBidAgainstInitOfferLogs = await client.getLogs({
        address: keepers[keepersMap.LOOKeeper],
        event: parseAbiItem('event CloseBidAgainstInitOffer(uint indexed buyer, uint indexed amt)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      closeBidAgainstInitOfferLogs = closeBidAgainstInitOfferLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('closeBidAgainstInitOfferLogs: ', closeBidAgainstInitOfferLogs);

      len = closeBidAgainstInitOfferLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = closeBidAgainstInitOfferLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq:0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'CloseBidAgainstInitOffer',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: AddrZero,
          acct: log.args.buyer ?? 0n,
        }

        let tran = await client.getTransaction({
          hash: item.transactionHash
        })

        item.addr = tran.from;

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      let closeInitOfferAgainstBidLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReleaseCustody(uint indexed from, uint indexed to, uint indexed amt, bytes32 reason)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      closeInitOfferAgainstBidLogs = closeInitOfferAgainstBidLogs.filter(v => (v.blockNumber > lastBlkNum) &&
          (v.args.reason == '0x436c6f7365496e69744f66666572416761696e73744269640000000000000000'));
      console.log('CloseInitOfferAgainstBidLogs: ', closeInitOfferAgainstBidLogs);

      len = closeInitOfferAgainstBidLogs.length;
      cnt = 0;
      
      while(cnt < len) {

        let log = closeInitOfferAgainstBidLogs[cnt];
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
          acct: log.args.from ?? 0n,
        }

        let tran = await client.getTransaction({
          hash: item.transactionHash
        })

        item.addr = tran.from;
        console.log('releaseCustodyLogs: ', item);

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

        await setFinData(gk, 'ethInflow', arr);

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

    getEthInflow();

  }, [gk, client, keepers, setRecords]);

  return (
  <>
  </>
  );
} 