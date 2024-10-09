import { Dispatch, SetStateAction, useEffect, } from "react";
import { Button,} from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import {  baseToDollar, bigIntToStrNum, HexParser } from "../../../common/toolsKit";
import { CashflowRecordsProps } from "./CbpIncome";
import { CashflowProps } from "../FinStatement";
import { getCentPriceInWeiAtTimestamp } from "./ethPrice/getPriceAtTimestamp";
import { getFinData, setFinData } from "../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../api/firebase/ethPriceTools";

export type FtCbpflowSumProps = {
  totalCbp: bigint;
  totalCbpInUsd: bigint;
  addCbp: bigint;
  addCbpInUsd: bigint;
  withdrawCbp: bigint;
  withdrawCbpInUsd: bigint;
  refuelCbp: bigint;
  refuelCbpInUsd: bigint;
  flag: boolean;
}

export const defaultFtCbpSum:FtCbpflowSumProps = {
  totalCbp: 0n,
  totalCbpInUsd: 0n,
  addCbp: 0n,
  addCbpInUsd: 0n,
  withdrawCbp: 0n,
  withdrawCbpInUsd: 0n,
  refuelCbp: 0n,
  refuelCbpInUsd: 0n,
  flag: false,
}

export interface FtCbpflowProps extends CashflowRecordsProps {
  sum: FtCbpflowSumProps;
  setSum: Dispatch<SetStateAction<FtCbpflowSumProps>>;
}

export function FtCbpflow({inETH, exRate, centPrice, sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:FtCbpflowProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    let sum: FtCbpflowSumProps = { ...defaultFtCbpSum };

    const getFtCashflow = async ()=>{

      if (!gk || !keepers) return;

      let logs = await getFinData(gk, 'ftCbpflow');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      console.log('lastItemOfFtCbpflow: ', lastBlkNum);

      let arr: CashflowProps[] = [];
      let ethPrices: EthPrice[] = [];

      const getEthPrices = async (timestamp: bigint): Promise<EthPrice[]> => {
        let prices = await getEthPricesForAppendRecords(Number(timestamp * 1000n));
        if (!prices) return [];
        else return prices;
      }

      const cbpToETH = (cbp:bigint) => {
        return cbp * 10000n / exRate;
      }    
  
      const sumArry = (arr: CashflowProps[]) => {

        arr.forEach(v => {

          switch (v.typeOfIncome) {
            case 'AddCbp':
              sum.totalCbp += v.amt;
              sum.addCbp += v.amt;
              
              sum.totalCbpInUsd += v.usd;
              sum.addCbpInUsd += v.usd;

              break;

            case 'WithdrawCbp':
              sum.totalCbp -= v.amt;
              sum.withdrawCbp += v.amt;

              sum.totalCbpInUsd -= v.usd;
              sum.withdrawCbpInUsd += v.usd;

              break;

            case 'RefuelCbp':
              sum.totalCbp -= v.amt;
              sum.refuelCbp += v.amt;

              sum.totalCbpInUsd -= v.usd;
              sum.refuelCbpInUsd += v.usd;

              break;
          }

        });
      }


      const appendItem = (newItem: CashflowProps, refPrices:EthPrice[]) => {
        if (newItem.amt > 0n) {

          let mark = getPriceAtTimestamp(Number(newItem.timestamp * 1000n), refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = cbpToETH(newItem.amt) * newItem.ethPrice / 10n ** 9n;
  
          arr.push(newItem);
        }
      } 

      let addCbpLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        args: {
          from: gk,
          to: [ HexParser("0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7"),
              AddrOfTank],
        },
        fromBlock: lastBlkNum ? lastBlkNum + 1n : 'earliest',
      });

      addCbpLogs = addCbpLogs.filter( v => v.blockNumber > lastBlkNum);
      console.log('addCbpLogs: ', addCbpLogs);
    
      let len = addCbpLogs.length;
      let cnt = 0;
    
      while (cnt < len) {
        let log = addCbpLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'AddCbp',
          amt: log.args.value ?? 0n,
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

      let withdrawCbpLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event WithdrawFuel(address indexed owner, uint indexed amt)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      withdrawCbpLogs = withdrawCbpLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('withdrawCbpLogs: ', withdrawCbpLogs);

      len = withdrawCbpLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = withdrawCbpLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'WithdrawCbp',
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

      let deprecateLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        args: {
          from: `0x${'FE8b7e87bb5431793d2a98D3b8ae796796403fA7'}`,
          to: gk,
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });
    
      deprecateLogs = deprecateLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('deprecateLogs: ', deprecateLogs);

      len = deprecateLogs.length;
      cnt = 0;
    
      while (cnt < len) {
        let log = deprecateLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'WithdrawCbp',
          amt: log.args.value ?? 0n,
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

      let refuelLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      refuelLogs = refuelLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('refuelLogs: ', refuelLogs);

      len = refuelLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = refuelLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'RefuelCbp',
          amt: log.args.amtOfCbp ?? 0n,
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

      if (arr.length > 0) {
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq:i}));
        console.log('arr: ', arr);

        await setFinData(gk, 'ftCbpflow', arr);

        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }
        
      } else if (!logs) {
        return;
      }

      if (logs) {
        sumArry(logs);
        sum.flag = true;
      }

      setRecords(logs);
      setSum(sum);
    }

    getFtCashflow();

  }, [gk, client, exRate, keepers, setSum, setRecords]);

  const showList = () => {
    let curSumCbpInUsd =  sum.totalCbp * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'CBP Balance in FT - (CBP ', data: sum.totalCbp},
          {title: '+ Add Fuel', data: sum.addCbp},
          {title: '- Fuel Sold', data: sum.refuelCbp},
          {title: '- Fuel Withdrawn', data: sum.withdrawCbp}
        ]
      : [ {title: 'CBP Balance in FT - (USD ', data: sum.totalCbpInUsd},
          {title: 'Exchange Gain/Loss', data: curSumCbpInUsd - sum.totalCbpInUsd},
          {title: '+ Add Fuel', data: sum.addCbpInUsd},
          {title: '- Fuel Sold', data: sum.refuelCbpInUsd},
          {title: '- Fuel Withdrawn', data: sum.withdrawCbpInUsd}
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
        <b>CBP in Fuel Tank: ({ inETH
            ? bigIntToStrNum(sum.totalCbp * 10000n / exRate / 10n**9n, 9) + ' ETH'
            : baseToDollar((sum.totalCbpInUsd / 10n**14n).toString()) + ' USD' })</b>
      </Button>
    )}
  </>
  );
} 