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
import { EthPrice } from "./ethPrice/getPriceAtTimestamp";
import { getFinData, setFinData } from "../../../../api/firebase/finInfoTools";
import { getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../api/firebase/ethPriceTools";

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

      let logs = await getFinData(gk, 'ethOutflow');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      console.log('lastItemOfEthOutflow: ', lastBlkNum);

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
            case 'GmmTransfer':
              sum.gmmTransfer += v.amt;
              sum.gmmTransferInUsd += v.usd;
              break;
            case 'GmmExpense':
              sum.gmmExpense += v.amt;
              sum.gmmExpenseInUsd += v.usd;
              break;
            case 'BmmTransfer':
              sum.bmmTransfer += v.amt;
              sum.bmmTransferInUsd += v.usd;
              break;
            case 'BmmExpense':
              sum.bmmExpense += v.amt;
              sum.bmmExpenseInUsd += v.usd;
              break;
            case 'Distribution':
              sum.distribution += v.amt;
              sum.distributionInUsd += v.usd;
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

      let gmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        args: {
          isCBP: false
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      gmmTransferLogs = gmmTransferLogs.filter(v => (v.blockNumber > lastBlkNum) &&
          (v.args.isCBP == false));

      console.log('gmmTransferEthLogs: ', gmmTransferLogs);

      let len = gmmTransferLogs.length;
      let cnt = 0;
      
      while(cnt < len) {

        let log = gmmTransferLogs[cnt];

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

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      let gmmExpenseLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      gmmExpenseLogs = gmmExpenseLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('gmmEthExpLogs: ', gmmExpenseLogs);
      
      len = gmmExpenseLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = gmmExpenseLogs[cnt];
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

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);    
        cnt++;
      }

      let bmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.BMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        args: {
          isCBP: false
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      bmmTransferLogs = bmmTransferLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('bmmEthTransferLogs:', bmmTransferLogs);

      len = bmmTransferLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = bmmTransferLogs[cnt];
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

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);    
        cnt++;
      }

      let bmmExpenseLogs = await client.getLogs({
        address: keepers[keepersMap.BMMKeeper],
        event: parseAbiItem('event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      bmmExpenseLogs = bmmExpenseLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('bmmEthExpLogs: ', bmmExpenseLogs);

      len = bmmExpenseLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = bmmExpenseLogs[cnt];
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

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }
        
        appendItem(item, ethPrices);
        cnt++;
      }

      let distributionLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event SaveToCoffer(uint indexed acct, uint256 indexed value, bytes32 indexed reason)'),
        args: {
          reason: HexParser(ethers.encodeBytes32String("DistributeProfits"))
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      distributionLogs = distributionLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('distributionLogs: ', distributionLogs);

      len = distributionLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = distributionLogs[cnt];
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

        await setFinData(gk, 'ethOutflow', arr);

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

    getEthOutflow();

  }, [gk, client, keepers, setSum, setRecords]);

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