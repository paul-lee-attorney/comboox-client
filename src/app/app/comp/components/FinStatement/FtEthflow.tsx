import { Dispatch, SetStateAction, useEffect, } from "react";
import { Button } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, AddrZero, } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import {  baseToDollar, bigIntToStrNum } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { CashflowProps } from "../FinStatement";
import { getCentPriceInWeiAtTimestamp } from "./ethPrice/getPriceAtTimestamp";
import { getFinData, setFinData } from "../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../api/firebase/ethPriceTools";

export type FtEthflowSumProps = {
  totalEth: bigint;
  totalEthInUsd: bigint;
  refuelEth: bigint;
  refuelEthInUsd: bigint;
  withdrawEth: bigint;
  withdrawEthInUsd: bigint;
  flag: boolean;
}

export const defaultFtEthSum:FtEthflowSumProps = {
  totalEth: 0n,
  totalEthInUsd: 0n,
  refuelEth: 0n,
  refuelEthInUsd: 0n,
  withdrawEth: 0n,
  withdrawEthInUsd: 0n,
  flag: false,
}

export interface FtEthflowProps extends CashflowRecordsProps {
  sum: FtEthflowSumProps;
  setSum: Dispatch<SetStateAction<FtEthflowSumProps>>;
}

export function FtEthflow({ inETH, exRate, centPrice, sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:FtEthflowProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    let sum: FtEthflowSumProps = { ...defaultFtEthSum };

    const getFtCashflow = async ()=>{

      if (!gk || !keepers) return;

      let logs = await getFinData(gk, 'ftEthflow');
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
          switch (v.typeOfIncome) {            
            case 'WithdrawEth':
              sum.totalEth -= v.amt;
              sum.withdrawEth += v.amt;

              sum.totalEthInUsd -= v.usd;
              sum.withdrawEthInUsd += v.usd;

              break;
            case 'RefuelEth':
              sum.totalEth += v.amt;
              sum.refuelEth += v.amt;

              sum.totalEthInUsd += v.usd;
              sum.refuelEthInUsd += v.usd;

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

      let refuelLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      refuelLogs = refuelLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('refuelLogs: ', refuelLogs);

      let len = refuelLogs.length;
      let cnt = 0;
      
      while(cnt < len) {

        let log = refuelLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'RefuelEth',
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

      let withdrawEthLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event WithdrawIncome(address indexed owner, uint indexed amt)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      withdrawEthLogs = withdrawEthLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('withdrawEthLogs: ', withdrawEthLogs);
      
      len = withdrawEthLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = withdrawEthLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'WithdrawEth',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.owner ?? AddrZero,
          acct: 0n,
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

        await setFinData(gk, 'ftEthflow', arr);

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

    getFtCashflow();

  }, [gk, client, keepers, setSum, setRecords]);

  const showList = () => {
    let curSumInUsd = sum.totalEth * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'Eth Balance in FT - (ETH ', data: sum.totalEth},
          {title: 'Gas Income', data: sum.refuelEth},
          {title: 'Income Pickup', data: sum.withdrawEth},
        ]
      : [ {title: 'Eth Balance in FT - (USD ', data: sum.totalEthInUsd},
          {title: 'Exchange Gain/Loss', data: curSumInUsd - sum.totalEthInUsd},
          {title: 'Gas Income', data: sum.refuelEthInUsd},
          {title: 'Income Pickup', data: sum.withdrawEthInUsd},
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
        <b>ETH in Fuel Tank: ({ inETH
            ? bigIntToStrNum(sum.totalEth / 10n**9n, 9) + ' ETH'
            : baseToDollar((sum.totalEthInUsd / 10n**14n).toString()) + ' USD' })</b>
      </Button>
    )}
  </>
  );
} 