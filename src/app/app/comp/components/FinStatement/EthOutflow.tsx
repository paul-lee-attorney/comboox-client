import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrZero, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { bigIntToStrNum,  HexParser, } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { ethers } from "ethers";
import { CashflowProps } from "../FinStatement";

export type EthOutflowSumProps = {
  totalAmt: bigint;
  ownersEquity: bigint;
  deposit: bigint;
  gmmTransfer: bigint;
  gmmExpense: bigint;
  bmmTransfer: bigint;
  bmmExpense: bigint;
  flag: boolean;
}

export const defaultEthOutSum:EthOutflowSumProps = {
  totalAmt: 0n,
  ownersEquity: 0n,
  deposit: 0n,
  gmmTransfer: 0n,
  gmmExpense: 0n,
  bmmTransfer: 0n,
  bmmExpense: 0n,  
  flag: false,
}

export interface EthOutflowProps extends CashflowRecordsProps {
  sum: EthOutflowSumProps;
  setSum: Dispatch<SetStateAction<EthOutflowSumProps>>;
}

export function EthOutflow({sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:EthOutflowProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();
  
  useEffect(()=>{

    let sum: EthOutflowSumProps = { ...defaultEthOutSum };
    const getEthOutflow = async ()=>{

      if (!gk || !keepers ) return;

      let arr: CashflowProps[] = [];
      let counter = 0;

      const appendItem = (newItem: CashflowProps) => {
        if (newItem.amt > 0n) {
    
          sum.totalAmt += newItem.amt;
          newItem.seq = counter;
  
          switch (newItem.typeOfIncome) {
            case 'PickupDeposit':
              sum.deposit += newItem.amt;
              break;
            case 'GmmTransfer - ETH':
              sum.gmmTransfer += newItem.amt;
              break;
            case 'GmmExpense - ETH':
              sum.gmmExpense += newItem.amt;
              break;
            case 'BmmTransfer - ETH':
              sum.bmmTransfer += newItem.amt;
              break;
            case 'BmmExpense - ETH':
              sum.bmmExpense += newItem.amt;
              break;
            case 'Distribution':
              sum.totalAmt -= newItem.amt;
              // sum.deposit -= newItem.amt;
              sum.ownersEquity += newItem.amt;
          }
          
          arr.push(newItem);
          counter++;
        }
      } 

      let pickupDepositLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event PickupDeposit(address indexed to, uint indexed caller, uint indexed amt)'),
        fromBlock: 1n,
      });
    
      let cnt = pickupDepositLogs.length;
    
      while (cnt > 0) {
        let log = pickupDepositLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'PickupDeposit',
          amt: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: log.args.caller ?? 0n,
        }
        
        appendItem(item);

        cnt--;
      }

      let gmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
        args: {
          isCBP: false
        }
      });

      cnt = gmmTransferLogs.length;
      
      while(cnt > 0) {

        let log = gmmTransferLogs[cnt-1];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'GmmTransfer - ETH',
          amt: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }

        if (!log.args.isCBP)
            appendItem(item);

        cnt--;
      }

      let gmmExpenseLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
      });

      cnt = gmmExpenseLogs.length;
      
      while(cnt > 0) {

        let log = gmmExpenseLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'GmmExpense - ETH',
          amt: log.args.values ?? 0n,
          addr: log.args.targets ?? AddrZero,
          acct: 0n,
        }

        appendItem(item);
    
        cnt--;
      }

      let bmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.BMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
        args: {
          isCBP: false
        }
      });

      cnt = bmmTransferLogs.length;
      
      while(cnt > 0) {

        let log = bmmTransferLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'BmmTransfer - ETH',
          amt: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }

        appendItem(item);
    
        cnt--;
      }

      let bmmExpenseLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
      });

      cnt = bmmExpenseLogs.length;

      while(cnt > 0) {

        let log = bmmExpenseLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'BmmExpense - ETH',
          amt: log.args.values ?? 0n,
          addr: log.args.targets ?? AddrZero,
          acct: 0n,
        }
    
        appendItem(item);

        cnt--;
      }

      let distributionLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event SaveToCoffer(uint indexed acct, uint256 indexed value, bytes32 indexed reason)'),
        fromBlock: 1n,
        args: {
          reason: HexParser(ethers.encodeBytes32String("DistributeProfits"))
        }
      });

      cnt = distributionLogs.length;

      while(cnt > 0) {

        let log = distributionLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: "Distribution",
          amt: log.args.value ?? 0n,
          addr: AddrZero,
          acct: log.args.acct ?? 0n,
        }
    
        appendItem(item);

        cnt--;
      }

      sum.flag = true;

      setRecords(arr);
      setSum(sum);
    }

    getEthOutflow();

  }, [gk, client, keepers, setSum, setRecords]);

  const showList = () => {
    let arrSumInfo = [
      {title: 'ETH Outflow - (ETH ', data: sum.totalAmt},
      {title: 'Distribution', data: sum.ownersEquity},
      {title: 'Deposit', data: sum.deposit},
      {title: 'GMM Transfer', data: sum.gmmTransfer},
      {title: 'GMM Expense', data: sum.gmmExpense},
      {title: 'BMM Transfer', data: sum.bmmTransfer},
      {title: 'BMM Expense', data: sum.bmmExpense},
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
        <b>Eth Outflow: ({ bigIntToStrNum(sum.totalAmt/10n**9n, 9) + ' ETH'})</b>
      </Button>
    )}
  </>
  );
} 