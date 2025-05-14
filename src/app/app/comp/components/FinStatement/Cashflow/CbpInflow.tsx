import { useEffect } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, keepersMap } from "../../../../common";
import { usePublicClient } from "wagmi";
import { decodeFunctionData, parseAbiItem } from "viem";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, getMonthLableByTimestamp, setFinData, updateRoyaltyByItem } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";
import { generalKeeperABI, usdKeeperABI } from "../../../../../../../generated";

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
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const cbpToETH = (cbp:bigint) => {
      return cbp * 10000n / exRate;
    }

    const getCbpInflow = async () => {

      if (!gk || !keepers ) return;

      const usdKeeper = keepers[keepersMap.UsdKeeper];

      const updateRoyaltyInfo = async (item:Cashflow) => {
        
        // const rs = await getRoyaltySource(item.transactionHash);
        
        // if (rs.api != "") {
        //   item.input = rs.input;
        //   item.api = rs.api;
        //   item.target = rs.target;
        //   item.typeOfDoc = rs.typeOfDoc;
        //   item.version = rs.version;
  
        //   const monthLab = getMonthLableByTimestamp(item.timestamp);
  
        //   await updateRoyaltyByItem(gk, monthLab, item);
        // }

        let tran = await client.getTransaction({hash: item.transactionHash});
                    
        if (tran.to?.toLowerCase() == gk.toLowerCase()) {

          item.input = tran.input;
          item.api = decodeFunctionData({
            abi: generalKeeperABI,
            data: tran.input,
          }).functionName;

        } else if (tran.to?.toLowerCase() == usdKeeper.toLowerCase()) {

          item.input = tran.input;
          item.api = decodeFunctionData({
            abi: usdKeeperABI,
            data: tran.input,
          }).functionName;

        }

        if (item.api) {
          const monthLab = getMonthLableByTimestamp(item.timestamp);  
          await updateRoyaltyByItem(gk, monthLab, item);
        }

      }

      let logs = await getFinData(gk, 'cbpInflow');
      const fromBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      const toBlkNum = await client.getBlockNumber();

      // console.log('lastItemOfCbpInflow: ', lastBlkNum);

      if (logs && client.chain.id == 42161) {
        let len = logs.length; 
        for (let i=0; i<len; i++) {
            const v = logs[i];
            if (v.typeOfIncome == 'Royalty' && v.api == '') {
              await updateRoyaltyInfo(v);
            }
        }
      }

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

      let startBlkNum = fromBlkNum;
      let transferLogs:any = [];

      while(startBlkNum <= toBlkNum) {
        const endBlkNum = startBlkNum + 500n > toBlkNum ? toBlkNum : startBlkNum + 500n;
        try{
          let logs = await client.getLogs({
            address: AddrOfRegCenter,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
            args: {
              to: gk,
            },
            fromBlock: startBlkNum,
            toBlock:endBlkNum,
          });
              
          transferLogs = [...transferLogs, ...logs];
          startBlkNum = endBlkNum + 1n;
        }catch(error){
          console.error("Error fetching transferLogs:", error);
          break;
        }
      }

      transferLogs = transferLogs.filter(v => (v.blockNumber > fromBlkNum) &&
          v.args.from?.toLowerCase() != AddrOfTank.toLowerCase() &&
          v.args.from?.toLowerCase() != "0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7".toLowerCase() &&
          v.args.from?.toLowerCase() != "0x1ACCB0C9A87714c99Bed5Ed93e96Dc0E67cC92c0".toLowerCase());

      // console.log('transferLogs: ', transferLogs);

      let len = transferLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = transferLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
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
          // } else if (client.chain.id == 42161){

          //   const rs = await getRoyaltySource(item.transactionHash);

          //   if (rs.api != "") {
          //     item.input = rs.input;
          //     item.api = rs.api;
          //     item.target = rs.target;
          //     item.typeOfDoc = rs.typeOfDoc;
          //     item.version = rs.version;
          //   }
            
          } else if (tran.to?.toLowerCase() == gk.toLowerCase()) {

            item.input = tran.input;
            item.api = decodeFunctionData({
              abi: generalKeeperABI,
              data: tran.input,
            }).functionName;
            // item.target = tran.from; 



          } else if (tran.to?.toLowerCase() == usdKeeper.toLowerCase()) {

            item.input = tran.input;
            item.api = decodeFunctionData({
              abi: usdKeeperABI,
              data: tran.input,
            }).functionName;

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

      // console.log('arr in cbpInflow:', arr);

      if (arr.length > 0) {
        
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq: i}));
        console.log('add arr into cbpInflow:', arr);

        await setFinData(gk, 'cbpInflow', arr);
        
        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }
      } 
      
      if (logs && logs.length > 0) {
        logs = logs.map((v,i) => ({...v, seq:i}));
        setRecords(logs);
        // console.log('logs in cbpInflow:', logs);
      }
      
    }

    if (gk && client) getCbpInflow();

  },[client, gk, keepers, exRate, setRecords]);

  return (
    <></>
  );

} 