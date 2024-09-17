import { Dispatch, SetStateAction, useEffect, } from "react";
import { Button,} from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, AddrZero, Bytes32Zero, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import {  bigIntToStrNum, HexParser, } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { ethers } from "ethers";
import { CashflowProps } from "../FinStatement";


export type EthIncomeSumProps = {
  totalAmt: bigint;
  gas: bigint;
  capital: bigint;
  custody: bigint;
  deposit: bigint;
  transfer: bigint;
  flag: boolean;
}

export const defaultEthIncomeSum:EthIncomeSumProps = {
  totalAmt: 0n,
  gas: 0n,
  capital: 0n,
  custody: 0n,
  deposit: 0n,
  transfer: 0n,
  flag: false,
}

export interface EthIncomeProps extends CashflowRecordsProps {
  sum: EthIncomeSumProps;
  setSum: Dispatch<SetStateAction<EthIncomeSumProps>>;
}

export function EthIncome({sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:EthIncomeProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();
  
  useEffect(()=>{

    let sum: EthIncomeSumProps = { ...defaultEthIncomeSum };
    const getEthIncome = async ()=>{

      if (!gk || !keepers) return;

      let arr: CashflowProps[] = [];
      let counter = 0;

      const appendItem = (newItem: CashflowProps) => {
        let flag = false;

        if (newItem.amt > 0n) {
      
          switch (newItem.typeOfIncome) {
            case 'Transfer':
              sum.transfer += newItem.amt;
              flag = true;
              break;
            case 'Gas Income':
              sum.gas += newItem.amt;
              flag = true;
              break;
            case 'PayInCap':
            case 'PayOffCIDeal':
            case 'CloseBidAgainstInitOffer':
              sum.capital += newItem.amt;
              flag = true;
              break;
            case 'DepositConsiderationOfSTDeal':
            case 'CloseBidAgainstOffer':
            case 'DepositConsiderationOfSwap':
            case 'DepositConsiderOfRejectedDeal':
            case 'DepositBalanceOfOTCDeal':
            case 'DepositBalanceOfBidOrder':
            case 'DepositBalanceOfPayInCap':
            case 'DepositBalanceOfSwap':
            case 'DepositBalanceOfRejectedDeal':
              flag = true;
              sum.deposit += newItem.amt;
              break;
            case 'CustodyValueOfBidOrder' :
              sum.custody += newItem.amt;
              newItem.acct = (newItem.acct / 2n**40n);
              flag = true;
              break;
          } 

          if (flag) {
            sum.totalAmt += newItem.amt;
            newItem.seq = counter;
  
            arr.push(newItem);
            counter++;
          }
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
          addr: log.args.from ?? AddrZero,
          acct: 0n,
        }
        
        if (item.addr.toLowerCase() == AddrOfTank.toLowerCase()) {
          item.typeOfIncome = 'Gas Income';
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

      let depositLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event SaveToCoffer(uint indexed acct, uint256 indexed value, bytes32 indexed reason)'),
        fromBlock: 1n,
      });

      cnt = depositLogs.length;

      while(cnt > 0) {

        let log = depositLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: ethers.decodeBytes32String(log.args.reason ?? Bytes32Zero),
          amt: log.args.value ?? 0n,
          addr: AddrZero,
          acct: log.args.acct ?? 0n,
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

  }, [gk, client, keepers, setSum, setRecords]);

  const showList = () => {
    let arrSumInfo = [
      {title: 'ETH Income - (ETH ', data: sum.totalAmt},
      {title: 'Gas Income', data: sum.gas},
      {title: 'Pay In Cap', data: sum.capital},
      {title: 'Custody', data: sum.custody},
      {title: 'Deposits', data: sum.deposit},
      {title: 'Transfer', data: sum.transfer},
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
        <b>ETH Income: ({ bigIntToStrNum(sum.totalAmt/10n**9n, 9) } ETH)</b>
      </Button>
    )}
  </>
  );
} 