import { Dispatch, SetStateAction, useEffect, } from "react";
import { Button,} from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, AddrZero, Bytes32Zero, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import {  baseToDollar, bigIntToStrNum, HexParser, } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { CashflowProps } from "../FinStatement";
import { ethers } from "ethers";
import { getFinData, setFinData } from "../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp, updateMonthlyEthPrices } from "../../../../api/firebase/ethPriceTools";


export type EthIncomeSumProps = {
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

export const defaultEthIncomeSum:EthIncomeSumProps = {
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

export interface EthIncomeProps extends CashflowRecordsProps {
  sum: EthIncomeSumProps;
  setSum: Dispatch<SetStateAction<EthIncomeSumProps>>;
}

export function EthIncome({inETH, exRate, centPrice, sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:EthIncomeProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    let sum: EthIncomeSumProps = { ...defaultEthIncomeSum };

    const getEthIncome = async ()=>{

      if (!gk || !keepers) return;

      let logs = await getFinData(gk, 'ethIncome');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      console.log('lastItemOfEthIncome: ', lastBlkNum);

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

      const appendItem = (newItem: CashflowProps, refPrices:EthPrice[]) => {

        if (newItem.amt > 0n) {

          let mark = getPriceAtTimestamp(Number(newItem.timestamp * 1000n), refPrices);

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
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
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
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
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
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
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
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
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
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
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
      console.log('closeInitOfferAgainstBidLogs: ', closeInitOfferAgainstBidLogs);

      len = closeInitOfferAgainstBidLogs.length;
      cnt = 0;
      
      while(cnt < len) {

        let log = closeInitOfferAgainstBidLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
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

        await setFinData(gk, 'ethIncome', arr);

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

    getEthIncome();

  }, [gk, client, keepers, setSum, setRecords]);

  const showList = () => {
    let curSumInUsd = sum.totalAmt * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'ETH Income - (ETH ', data: sum.totalAmt},
          {title: 'GasIncome', data: sum.gas},
          {title: 'PayInCap', data: sum.capital},
          {title: 'TransferIncome', data: sum.transfer} 
        ]
      : [ {title: 'ETH Income - (USD ', data: sum.sumInUsd},
          {title: 'Exchange Gain/Loss', data: curSumInUsd - sum.sumInUsd},
          {title: 'GasIncome', data: sum.gasInUsd},
          {title: 'PayInCap', data: sum.capitalInUsd},
          {title: 'TransferIncome', data: sum.transferInUsd}
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
        <b>ETH Income: ({ inETH
            ? bigIntToStrNum(sum.totalAmt/10n**9n, 9) + ' ETH'
            : baseToDollar((sum.sumInUsd/10n**14n).toString()) + ' USD' })</b>
      </Button>
    )}
  </>
  );
} 