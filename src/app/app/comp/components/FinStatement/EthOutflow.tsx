import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrZero, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { baseToDollar, bigIntToStrNum,  HexParser, } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { ethers } from "ethers";
import { CashflowProps } from "../FinStatement";
import { getCentPriceInWeiAtTimestamp } from "./ethPrice/getPriceAtTimestamp";

export type EthOutflowSumProps = {
  totalAmt: bigint;
  sumInUsd: bigint;
  distribution: bigint;
  distributionInUsd: bigint;
  gmmTransfer: bigint;
  gmmTransferInUsd: bigint;
  gmmExpense: bigint;
  gmmExpenseInUsd: bigint;
  bmmTransfer: bigint;
  bmmTransferInUsd: bigint;
  bmmExpense: bigint;
  bmmExpenseInUsd: bigint;
  flag: boolean;
}

export const defaultEthOutSum:EthOutflowSumProps = {
  totalAmt: 0n,
  sumInUsd: 0n,
  distribution: 0n,
  distributionInUsd: 0n,
  gmmTransfer: 0n,
  gmmTransferInUsd: 0n,
  gmmExpense: 0n,
  gmmExpenseInUsd: 0n,
  bmmTransfer: 0n,
  bmmTransferInUsd: 0n,
  bmmExpense: 0n,
  bmmExpenseInUsd: 0n,
  flag: false
}

export interface EthOutflowProps extends CashflowRecordsProps {
  sum: EthOutflowSumProps;
  setSum: Dispatch<SetStateAction<EthOutflowSumProps>>;
}

export function EthOutflow({ inETH, exRate, centPrice, sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:EthOutflowProps ) {
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

          let mark = getCentPriceInWeiAtTimestamp(Number(newItem.timestamp * 1000n));
          newItem.ethPrice = mark.centPrice ?  10n ** 25n / mark.centPrice : 10n ** 25n / centPrice;
          newItem.usd = newItem.amt * newItem.ethPrice / 10n ** 9n;          
    
          sum.totalAmt += newItem.amt;
          sum.sumInUsd += newItem.usd;
  
          newItem.seq = counter;
  
          switch (newItem.typeOfIncome) {
            case 'GmmTransfer':
              sum.gmmTransfer += newItem.amt;
              sum.gmmTransferInUsd += newItem.usd;
              break;
            case 'GmmExpense':
              sum.gmmExpense += newItem.amt;
              sum.gmmExpenseInUsd += newItem.usd;
              break;
            case 'BmmTransfer':
              sum.bmmTransfer += newItem.amt;
              sum.bmmTransferInUsd += newItem.usd;
              break;
            case 'BmmExpense':
              sum.bmmExpense += newItem.amt;
              sum.bmmExpenseInUsd += newItem.usd;
              break;
            case 'Distribution':
              sum.distribution += newItem.amt;
              sum.distributionInUsd += newItem.usd;
          }
          
          arr.push(newItem);
          counter++;
        }
      } 

      let gmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
        args: {
          isCBP: false
        }
      });

      let cnt = gmmTransferLogs.length;
      
      while(cnt > 0) {

        let log = gmmTransferLogs[cnt-1];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'GmmTransfer',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
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
          typeOfIncome: 'GmmExpense',
          amt: log.args.values ?? 0n,
          ethPrice: 0n,
          usd: 0n,
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
          typeOfIncome: 'BmmTransfer',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
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
          typeOfIncome: 'BmmExpense',
          amt: log.args.values ?? 0n,
          ethPrice: 0n,
          usd: 0n,
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
          ethPrice: 0n,
          usd: 0n,
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

  }, [gk, client, keepers, centPrice, setSum, setRecords]);

  const showList = () => {
    let curSumInUsd = sum.totalAmt * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'ETH Outflow - (ETH ', data: sum.totalAmt},
          {title: 'Distribution', data: sum.distribution},
          {title: 'GMM Transfer', data: sum.gmmTransfer},
          {title: 'GMM Expense', data: sum.gmmExpense},
          {title: 'BMM Transfer', data: sum.bmmTransfer},
          {title: 'BMM Expense', data: sum.bmmExpense},
        ]
      : [ {title: 'ETH Outflow - (USD ', data: sum.sumInUsd},
          {title: 'Exchange Gain/Loss', data: sum.sumInUsd - curSumInUsd},
          {title: 'Distribution', data: sum.distributionInUsd},
          {title: 'GMM Transfer', data: sum.gmmTransferInUsd},
          {title: 'GMM Expense', data: sum.gmmExpenseInUsd},
          {title: 'BMM Transfer', data: sum.bmmTransferInUsd},
          {title: 'BMM Expense', data: sum.bmmExpenseInUsd}
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
        <b>Eth Outflow: ({ inETH 
            ? bigIntToStrNum(sum.totalAmt / 10n**9n, 9) + ' ETH'
            : baseToDollar((sum.sumInUsd / 10n**14n).toString()) + ' USD'})</b>
      </Button>
    )}
  </>
  );
} 