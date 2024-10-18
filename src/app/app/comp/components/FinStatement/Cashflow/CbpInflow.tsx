import { useEffect } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero } from "../../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { Cashflow, CashflowRecordsProps } from "../../FinStatement";
import { getFinData, setFinData } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";

export type CbpInflowSum = {
  totalAmt: bigint;
  sumInUsd: bigint;
  royalty: bigint;
  royaltyInUsd: bigint;
  transfer: bigint;
  transferInUsd: bigint;
  mint:bigint;
  mintInUsd: bigint;
  flag: boolean;
}

export const defCbpInflowSum: CbpInflowSum = {
  totalAmt: 0n,
  sumInUsd: 0n,
  royalty: 0n,
  royaltyInUsd: 0n,
  transfer: 0n,
  transferInUsd: 0n,
  mint: 0n,
  mintInUsd: 0n,
  flag: false,
}

export const defCbpInflowSumArr: CbpInflowSum[] = [
  defCbpInflowSum, defCbpInflowSum, defCbpInflowSum, defCbpInflowSum
]

export const sumArrayOfCbpInflow = (arr: Cashflow[]) => {
  
  let sum: CbpInflowSum = {...defCbpInflowSum};

  if (arr.length > 0) {
    arr.forEach(v => {
      sum.totalAmt += v.amt;
      sum.sumInUsd += v.usd;
  
      switch (v.typeOfIncome) {
        case 'Royalty':
          sum.royalty += v.amt;
          sum.royaltyInUsd += v.usd;
          break;
        case 'Transfer': 
          sum.transfer += v.amt;
          sum.transferInUsd += v.usd;
          break;
        case 'Mint': 
          sum.mint += v.amt;
          sum.mintInUsd += v.usd;
          break;
      }
    }); 
  }

  sum.flag = true;

  return sum;
}

export const updateCbpInflowSum = (arr: Cashflow[], startDate:number, endDate:number ) => {
  
  let sum: CbpInflowSum[] = [...defCbpInflowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfCbpInflow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfCbpInflow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfCbpInflow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  console.log('range:', startDate, endDate);
  console.log('cbpInflow:', sum);
  return sum;
}


export function CbpInflow({exRate, setRecords}:CashflowRecordsProps) {
  const { gk } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const cbpToETH = (cbp:bigint) => {
      return cbp * 10000n / exRate;
    }

    const getCbpInflow = async () => {

      if (!gk) return;

      let logs = await getFinData(gk, 'cbpInflow');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      console.log('lastItemOfCbpInflow: ', lastBlkNum);

      let arr: Cashflow[] = [];
      let ethPrices: EthPrice[] | undefined = [];

      const appendItem = (newItem: Cashflow, refPrices: EthPrice[]) => {
        if (newItem.amt > 0n && refPrices.length > 0) {

          const mark = getPriceAtTimestamp(newItem.timestamp * 1000, refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = cbpToETH(newItem.amt) * newItem.ethPrice / 10n ** 9n;
           
          arr.push(newItem);
        }
      } 

      let transferLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        args: {
          to: gk,
        },
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      transferLogs = transferLogs.filter(v => (v.blockNumber > lastBlkNum) &&
          v.args.from?.toLowerCase() != AddrOfTank.toLowerCase() &&
          v.args.from?.toLowerCase() != "0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7".toLowerCase());

      console.log('transferLogs: ', transferLogs);

      let len = transferLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = transferLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'Royalty',
          amt: log.args.value ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.from ?? AddrZero,
          acct: 0n,
        }

        if (item.addr.toLowerCase() == AddrZero) {
          item.typeOfIncome = 'Mint';
        } else {
          let tran = await client.getTransaction({hash: item.transactionHash});
          
          if ( tran.to?.toLowerCase() == AddrOfRegCenter.toLowerCase() && 
                tran.input.substring(0,10).toLowerCase() == '0xa9059cbb') 
          {  
            item.typeOfIncome = 'Transfer';
          }
        }

        if (cnt == 0) {
          ethPrices = await getEthPricesForAppendRecords(item.timestamp * 1000);
          if (!ethPrices) return;
          else console.log('ethPrices: ', ethPrices);
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      if (arr.length > 0) {
        
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq: i}));
        console.log('arr: ', arr);

        await setFinData(gk, 'cbpInflow', arr);
        
        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }
      } 
      
      if (logs && logs.length > 0) {
        setRecords(logs);
      }
      
    }

    if (gk && client) getCbpInflow();

  },[client, gk, exRate, setRecords]);

  return (
    <></>
  );

} 