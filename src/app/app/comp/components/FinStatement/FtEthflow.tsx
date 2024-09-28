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

      let arr: CashflowProps[] = [];
      let counter = 0;
  
      const appendItem = (newItem: CashflowProps) => {

        if (newItem.amt > 0n) {

          let mark = getCentPriceInWeiAtTimestamp(Number(newItem.timestamp * 1000n));
          newItem.ethPrice = mark.centPrice ?  10n ** 25n / mark.centPrice : 10n ** 25n / centPrice;
          newItem.usd = newItem.amt * newItem.ethPrice / 10n ** 9n;

          switch (newItem.typeOfIncome) {
            case 'WithdrawEth':
              sum.totalEth -= newItem.amt;
              sum.withdrawEth += newItem.amt;

              sum.totalEthInUsd -= newItem.usd;
              sum.withdrawEthInUsd += newItem.usd;

              break;
            case 'RefuelEth':
              sum.totalEth += newItem.amt;
              sum.refuelEth += newItem.amt;

              sum.totalEthInUsd += newItem.usd;
              sum.refuelEthInUsd += newItem.usd;

            break;
          } 

          newItem.seq = counter;
  
          arr.push(newItem);
          counter++;          
        }
      } 

      let refuelLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)'),
        fromBlock: 1n,
      });

      let cnt = refuelLogs.length;
      
      while(cnt > 0) {

        let log = refuelLogs[cnt-1];
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

        appendItem(item);
            
        cnt--;
      }

      let withdrawEthLogs = await client.getLogs({
        address: AddrOfTank,
        event: parseAbiItem('event WithdrawIncome(address indexed owner, uint indexed amt)'),
        fromBlock: 1n,
      });

      cnt = withdrawEthLogs.length;
      
      while(cnt > 0) {

        let log = withdrawEthLogs[cnt-1];
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

        appendItem(item);
    
        cnt--;
      }

      sum.flag = true;

      setRecords(arr);
      setSum(sum);
    }

    getFtCashflow();

  }, [gk, client, centPrice, keepers, setSum, setRecords]);

  const showList = () => {
    let curSumInUsd = sum.totalEth * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'Eth Balance in FT - (ETH ', data: sum.totalEth},
          {title: 'Fuel Income', data: sum.refuelEth},
          {title: 'Income Pickup', data: sum.withdrawEth},
        ]
      : [ {title: 'Eth Balance in FT - (USD ', data: sum.totalEthInUsd},
          {title: 'Exchange Gain/Loss', data: curSumInUsd - sum.totalEthInUsd},
          {title: 'Fuel Income', data: sum.refuelEthInUsd},
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