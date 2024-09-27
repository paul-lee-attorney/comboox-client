import { Dispatch, SetStateAction, useEffect, } from "react";
import { Button,} from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, AddrZero, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import {  bigIntToStrNum, } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { CashflowProps } from "../FinStatement";
import { getCentPriceInWeiAtTimestamp } from "./ethPrice/getPriceAtTimestamp";


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

      let arr: CashflowProps[] = [];
      let counter = 0;

      const appendItem = (newItem: CashflowProps) => {

        if (newItem.amt > 0n) {

          let centPriceHis = getCentPriceInWeiAtTimestamp(Number(newItem.timestamp * 1000n));
          newItem.ethPrice = centPriceHis ?  10n ** 25n / centPriceHis : 10n ** 25n / centPrice;
          newItem.usd = newItem.amt * newItem.ethPrice / 10n ** 9n;          

          switch (newItem.typeOfIncome) {
            case 'Transfer':
              sum.transfer += newItem.amt;
              sum.transferInUsd += newItem.usd;
              break;
            case 'Gas Income':
              sum.gas += newItem.amt;
              sum.gasInUsd += newItem.usd;
              break;
            case 'PayInCap':
            case 'PayOffCIDeal':
            case 'CloseBidAgainstInitOffer':
              sum.capital += newItem.amt;
              sum.capitalInUsd += newItem.usd;
              break;
          } 

          sum.totalAmt += newItem.amt;
          sum.sumInUsd += newItem.usd;
          newItem.seq = counter;

          arr.push(newItem);
          counter++;
        }
      } 

      let recievedCashLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReceivedCash(address indexed from, uint indexed amt)'),
        fromBlock: 1n,
      });
    
      let cnt = recievedCashLogs.length;
    
      while (cnt > 0) {
        let log = recievedCashLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'Transfer',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.from ?? AddrZero,
          acct: 0n,
        }
        
        if (item.addr.toLowerCase() == AddrOfTank.toLowerCase()) {
          item.typeOfIncome = 'Gas Income';
          cnt--;
          continue;
        }

        appendItem(item);
        cnt--;
      }

      let gasIncomeLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
        fromBlock: 1n,
      });
    
      cnt = gasIncomeLogs.length;
    
      while (cnt > 0) {
        let log = gasIncomeLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'Gas Income',
          amt: log.args.amtOfEth ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.buyer ?? AddrZero,
          acct: 0n,
        }
        
        appendItem(item);
        cnt--;
      }

      let payInCapLogs = await client.getLogs({
        address: keepers[keepersMap.ROMKeeper],
        event: parseAbiItem('event PayInCapital(uint indexed seqOfShare, uint indexed amt, uint indexed valueOfDeal)'),
        fromBlock: 1n,
      });

      cnt = payInCapLogs.length;
      
      while(cnt > 0) {

        let log = payInCapLogs[cnt-1];

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
    
        appendItem(item);

        cnt--;
      }

      let payOffCIDealLogs = await client.getLogs({
        address: keepers[keepersMap.ROAKeeper],
        event: parseAbiItem('event PayOffCIDeal(uint indexed caller, uint indexed valueOfDeal)'),
        fromBlock: 1n,
      });

      cnt = payOffCIDealLogs.length;
      
      while(cnt > 0) {

        let log = payOffCIDealLogs[cnt-1];
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

        appendItem(item);
    
        cnt--;
      }

      let closeBidAgainstInitOfferLogs = await client.getLogs({
        address: keepers[keepersMap.LOOKeeper],
        event: parseAbiItem('event CloseBidAgainstInitOffer(uint indexed buyer, uint indexed amt)'),
        fromBlock: 1n,
      });

      cnt = closeBidAgainstInitOfferLogs.length;
      
      while(cnt > 0) {

        let log = closeBidAgainstInitOfferLogs[cnt-1];
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

        appendItem(item);
    
        cnt--;
      }

      sum.flag = true;

      setRecords(arr);
      setSum(sum);
    }

    getEthIncome();

  }, [gk, client, keepers, centPrice, setSum, setRecords]);

  const showList = () => {
    let curSumInUsd = sum.totalAmt * 10n ** 16n / centPrice;

    let arrSumInfo = [
      {title: 'ETH Income - (ETH ', data: sum.totalAmt},
      {title: 'Sum (USD)', data: sum.sumInUsd},
      {title: 'Exchange Gain/Loss', data: curSumInUsd - sum.sumInUsd},
      {title: 'Gas Income', data: sum.gas},
      {title: 'Gas Income (USD)', data: sum.gasInUsd},
      {title: 'Pay In Cap', data: sum.capital},
      {title: 'Pay In Cap (USD)', data: sum.capitalInUsd},
      {title: 'Transfer', data: sum.transfer},
      {title: 'Transfer (USD)', data: sum.transferInUsd},
    ]
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
            : bigIntToStrNum(sum.sumInUsd/10n**9n, 9) + ' USD' })</b>
      </Button>
    )}
  </>
  );
} 