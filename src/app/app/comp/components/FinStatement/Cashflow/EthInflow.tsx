import { useEffect, } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrZero, booxMap, Bytes32Zero, HexType, keepersMap } from "../../../../common";
import { usePublicClient } from "wagmi";
import { decodeEventLog } from "viem";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, getFinDataTopBlk, setFinData, setFinDataTopBlk } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";
import { listOfOrdersABI, registerOfSharesABI } from "../../../../../../../generated";
import { getShare, parseSnOfShare } from "../../../ros/ros";
import { briefParser } from "../../../loe/loe";
import { ftHis } from "./FtCbpflow";
import { fetchLogs } from "../../../../common/getLogs";

export type EthInflowSum = {
  totalAmt: bigint;
  sumInUsd: bigint;
  gas: bigint;
  gasInUsd: bigint;
  capital: bigint;
  capitalInUsd: bigint;
  premium: bigint;
  premiumInUsd: bigint;
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
  premium: 0n,
  premiumInUsd: 0n,
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
          sum.capital += v.amt;
          sum.capitalInUsd += v.usd;
          break;
        case 'PayInPremium':
          sum.premium += v.amt;
          sum.premiumInUsd += v.usd;
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

  return sum;
}

interface CapLog {
  blockNumber: bigint;
  txHash: HexType;
  addr: HexType;
  acct: bigint;
  value: bigint;
  paid: bigint;
  premium: bigint;  
}

export function EthInflow({exRate, setRecords}:CashflowRecordsProps ) {
  const { gk, keepers, boox } = useComBooxContext();
  
  const client = usePublicClient();


  useEffect(()=>{

    const getEthInflow = async ()=>{

      if (!gk || !keepers || !boox ) return;

      const ros = boox[booxMap.ROS];
      const loo = boox[booxMap.LOO];

      let logs = await getFinData(gk, 'ethInflow');
      let fromBlkNum = await getFinDataTopBlk(gk, 'ethInflow');
      if (!fromBlkNum) {
        fromBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      };

      console.log('topBlk of EthInflow: ', fromBlkNum);
      let toBlkNum = await client.getBlockNumber();

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
     
      const appendCapItems = async (capLog:CapLog) => {
        let blk = await client.getBlock({blockNumber: capLog.blockNumber});
     
        let itemCap:Cashflow = {...defaultCashflow,
          blockNumber: capLog.blockNumber,
          timestamp: Number(blk.timestamp),
          transactionHash: capLog.txHash,
          typeOfIncome: 'PayInCap',
          usd: capLog.paid * 10n ** 14n,
          addr: capLog.addr,
          acct: capLog.acct ?? 0n,
        }

        ethPrices = await getEthPrices(itemCap.timestamp);
        let mark = getPriceAtTimestamp(itemCap.timestamp * 1000, ethPrices);

        itemCap.ethPrice = 10n ** 25n / mark.centPrice;
        itemCap.amt = capLog.paid * mark.centPrice / 100n; 

        let itemPremium:Cashflow = {...itemCap,
          typeOfIncome: 'PayInPremium',
          amt: capLog.value - itemCap.amt,
          usd: capLog.premium * 10n ** 14n,
        }

        arr.push(itemCap);
        arr.push(itemPremium);
      }

      let recievedCashLogs = await fetchLogs({
        address: gk,
        eventAbiString: 'event ReceivedCash(address indexed from, uint indexed amt)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });
    
      recievedCashLogs = recievedCashLogs.filter((v:any) => 
          (v.args.from?.toLowerCase() != ftHis[0].toLowerCase()) && 
          (v.args.from?.toLowerCase() != ftHis[1].toLowerCase()) && 
          (v.args.from?.toLowerCase() != ftHis[2].toLowerCase()));
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

      let gasIncomeLogs = await fetchLogs({
        address: ftHis[0],
        eventAbiString: 'event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      gasIncomeLogs = [...gasIncomeLogs, ...(await fetchLogs({
        address: ftHis[1],
        eventAbiString: 'event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      }))];

      gasIncomeLogs = [...gasIncomeLogs, ...(await fetchLogs({
        address: ftHis[2],
        eventAbiString: 'event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      }))];

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

      let payInCapLogs = await fetchLogs({
        address: keepers[keepersMap.ROMKeeper],
        eventAbiString: 'event PayInCapital(uint indexed seqOfShare, uint indexed amt, uint indexed valueOfDeal)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      console.log('payInCapLogs: ', payInCapLogs);

      len = payInCapLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = payInCapLogs[cnt];

        let receipt = await client.getTransactionReceipt({
          hash: log.transactionHash
        });

        let share = await getShare(ros, (log?.args?.seqOfShare ?? 0n).toString());

        let paid = log?.args?.amt ?? 0n;
        let premium = BigInt(share.head.priceOfPaid - 10000) * paid / 10000n;

        let acct = BigInt(share.head.shareholder);  

        let capLog:CapLog = {
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
          addr: receipt.from,
          acct: acct,
          value: log.args.valueOfDeal ?? 0n,
          paid: paid,
          premium: premium,
        }

        await appendCapItems(capLog);

        cnt++;
      }

      let payOffCIDealLogs = await fetchLogs({
        address: keepers[keepersMap.ROAKeeper],
        eventAbiString: 'event PayOffCIDeal(uint indexed caller, uint indexed valueOfDeal)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      console.log('payOffCIDealLogs: ', payOffCIDealLogs);

      len = payOffCIDealLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = payOffCIDealLogs[cnt];

        let receipt = await client.getTransactionReceipt({
          hash: log.transactionHash
        });

        let rosLog = receipt.logs
          .filter(v => v.address === ros.toLowerCase())
          .map(v => {
            try {
              return decodeEventLog({
                abi: registerOfSharesABI,
                eventName: 'IssueShare',
                data: v.data,
                topics: v.topics,
              });
            } catch {
              return null;
            }
          }).filter(Boolean)
          .find(v => v?.eventName == 'IssueShare');

        let paid = rosLog?.args.paid ?? 0n;
        let headOfShare = parseSnOfShare(rosLog?.args.shareNumber ?? Bytes32Zero);
        let premium = BigInt(headOfShare.priceOfPaid - 10000) * paid / 10000n;

        let capLog:CapLog = {
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
          addr: receipt.from,
          acct: log.args.caller ?? 0n,
          value: log.args.valueOfDeal ?? 0n,
          paid: paid,
          premium: premium,
        }

        await appendCapItems(capLog);

        cnt++;
      }

      let closeBidAgainstInitOfferLogs = await fetchLogs({
        address: keepers[keepersMap.LOOKeeper],
        eventAbiString: 'event CloseBidAgainstInitOffer(uint indexed buyer, uint indexed amt)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      console.log('closeBidAgainstInitOfferLogs: ', closeBidAgainstInitOfferLogs);

      len = closeBidAgainstInitOfferLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = closeBidAgainstInitOfferLogs[cnt];

        let receipt = await client.getTransactionReceipt({
          hash: log.transactionHash
        });

        let looLog = receipt.logs
          .filter(v => v.address === loo.toLowerCase())
          .map(v => {
            try {
              return decodeEventLog({
                abi: listOfOrdersABI,
                eventName: 'DealClosed',
                data: v.data,
                topics: v.topics,
              });
            } catch {
              return null;
            }
          }).filter(Boolean)
          .find(v => v?.eventName == 'DealClosed' && 
            briefParser(v.args.deal).consideration == log.args.amt &&
            briefParser(v.args.deal).seqOfShare == '0'
          );

        let dealBrief = briefParser(looLog?.args.deal ?? Bytes32Zero);
        let paid = dealBrief.paid;
        let premium = (dealBrief.price - 10000n) * paid / 10000n;

        let capLog:CapLog = {
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
          addr: receipt.from,
          acct: log.args.buyer ?? 0n,
          value: log.args.amt ?? 0n,
          paid: paid,
          premium: premium,
        }

        await appendCapItems(capLog);

        cnt++;
      }

      let closeInitOfferAgainstBidLogs = await fetchLogs({
        address: gk,
        eventAbiString: 'event ReleaseCustody(uint indexed from, uint indexed to, uint indexed amt, bytes32 reason)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      closeInitOfferAgainstBidLogs = closeInitOfferAgainstBidLogs.filter((v:any) => 
          (v.args.reason == '0x436c6f7365496e69744f66666572416761696e73744269640000000000000000'));
      console.log('CloseInitOfferAgainstBidLogs: ', closeInitOfferAgainstBidLogs);

      len = closeInitOfferAgainstBidLogs.length;
      cnt = 0;
      
      while(cnt < len) {

        let log = closeInitOfferAgainstBidLogs[cnt];

        let receipt = await client.getTransactionReceipt({
          hash: log.transactionHash
        });

        let looLog = receipt.logs
          .filter(v => v.address === loo.toLowerCase())
          .map(v => {
            try {
              return decodeEventLog({
                abi: listOfOrdersABI,
                eventName: 'DealClosed',
                data: v.data,
                topics: v.topics,
              });
            } catch {
              return null;
            }
          }).filter(Boolean)
          .find(v => v?.eventName == 'DealClosed' && 
            briefParser(v.args.deal).consideration == log.args.amt &&
            briefParser(v.args.deal).seqOfShare == '0'
          );

        let dealBrief = briefParser(looLog?.args.deal ?? Bytes32Zero);
        let paid = dealBrief.paid;
        let premium = (dealBrief.price - 10000n) * paid / 10000n;

        let capLog:CapLog = {
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
          addr: receipt.from,
          acct: log.args.from ?? 0n,
          value: log.args.amt ?? 0n,
          paid: paid,
          premium: premium,
        }

        await appendCapItems(capLog);

        cnt++;
      } 

      await setFinDataTopBlk(gk, 'ethInflow', toBlkNum);
      console.log('updated topBlk Of ethInflow: ', toBlkNum);
      
      if (arr.length > 0) {
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq:i}));
        console.log('arr added into EthInflow:', arr);

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

  }, [gk, boox, client, keepers, setRecords]);

  return (
  <>
  </>
  );
} 