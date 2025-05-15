import { useEffect } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, FirstUser, keepersMap, SecondUser } from "../../../../common";
import { usePublicClient } from "wagmi";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, getFinDataTopBlk, setFinData, setFinDataTopBlk } from "../../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../../api/firebase/ethPriceTools";
import { HexParser } from "../../../../common/toolsKit";
import { fetchLogs } from "../../../../common/getLogs";

export type CbpOutflowSum = {
  totalAmt: bigint;
  sumInUsd: bigint;
  newUserAward: bigint;
  newUserAwardInUsd: bigint;
  startupCost: bigint;
  startupCostInUsd: bigint;
  fuelSold: bigint;
  fuelSoldInUsd: bigint;
  gmmTransfer: bigint;
  gmmTransferInUsd: bigint;
  bmmTransfer: bigint;
  bmmTransferInUsd: bigint;
  flag: boolean;
}

export const defCbpOutflowSum:CbpOutflowSum = {
  totalAmt: 0n,
  sumInUsd: 0n,
  newUserAward: 0n,
  newUserAwardInUsd: 0n,
  startupCost: 0n,
  startupCostInUsd: 0n,
  fuelSold: 0n,
  fuelSoldInUsd: 0n,
  gmmTransfer: 0n,
  gmmTransferInUsd: 0n,
  bmmTransfer: 0n,
  bmmTransferInUsd: 0n,
  flag: false
}

export const defCbpOutflowSumArr:CbpOutflowSum[] = [
  defCbpOutflowSum, defCbpOutflowSum, defCbpOutflowSum, defCbpOutflowSum
]

const sumArrayOfCbpOutflow = (arr: Cashflow[]) => {

  let sum: CbpOutflowSum = {...defCbpOutflowSum};

  if (arr.length > 0) {
    arr.forEach(v => {
      sum.totalAmt += v.amt;
      sum.sumInUsd += v.usd;
  
      switch (v.typeOfIncome) {
        case 'NewUserAward': 
          sum.newUserAward += v.amt;
          sum.newUserAwardInUsd += v.usd;
          break;
        case 'StartupCost': 
          sum.startupCost += v.amt;
          sum.startupCostInUsd += v.usd;
          break;
        case 'FuelSold':
          sum.fuelSold += v.amt;
          sum.fuelSoldInUsd += v.usd;
          break;
        case 'GmmTransfer':
          sum.gmmTransfer += v.amt;
          sum.gmmTransferInUsd += v.usd;
          break;
        case 'BmmTransfer':
          sum.bmmTransfer += v.amt;
          sum.bmmTransferInUsd += v.usd;
          break;
      }
    });  
  }

  sum.flag = true;

  return sum;
}

export const updateCbpOutflowSum = (arr: Cashflow[], startDate:number, endDate:number) => {
  
  let sum: CbpOutflowSum[] = [...defCbpOutflowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfCbpOutflow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfCbpOutflow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfCbpOutflow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  // console.log('cbpOutflow range:', startDate, endDate);
  // console.log('cbpOutflow:', sum);
  return sum;
}

export function CbpOutflow({exRate, setRecords}:CashflowRecordsProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();
 
  useEffect(()=>{

    const cbpToETH = (cbp:bigint) => {
      return cbp * 10000n / exRate;
    }

    const getEthOutflow = async ()=>{

      if ( !gk || !keepers ) return;

      let logs = await getFinData(gk, 'cbpOutflow');

      let fromBlkNum = await getFinDataTopBlk(gk, 'cbpInflow');
      if (!fromBlkNum) {
        fromBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      }
      console.log('topBlk Of CbpOutflow: ', fromBlkNum);
      
      let toBlkNum = await client.getBlockNumber();

      let arr: Cashflow[] = [];
      let ethPrices: EthPrice[] = [];

      const getEthPrices = async (timestamp: number): Promise<EthPrice[]> => {
        let prices = await getEthPricesForAppendRecords(timestamp * 1000);
        if (!prices) return [];
        else return prices;
      }

      const appendItem = (newItem: Cashflow, refPrices:EthPrice[]) => {
        if (newItem.amt > 0n) {

          let mark = getPriceAtTimestamp(newItem.timestamp * 1000, refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = cbpToETH(newItem.amt) * newItem.ethPrice / 10n ** 9n;
            
          arr.push(newItem);
        }
      } 

      let newUserAwardLogs = await fetchLogs({
        address: AddrOfRegCenter,
        eventAbiString: 'event Transfer(address indexed from, address indexed to, uint256 indexed value)',
        args: {
          from: AddrZero,
        },
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });
    
      newUserAwardLogs = newUserAwardLogs.filter((v:any) => v.args.to?.toLowerCase() != gk.toLowerCase());
      console.log('newUserAwardlogs: ', newUserAwardLogs);

      let len = newUserAwardLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = newUserAwardLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'NewUserAward',
          amt: log.args.value ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }
        
        if (item.addr.toLowerCase() == FirstUser.toLowerCase() ||
          item.addr.toLowerCase() == SecondUser.toLowerCase()) {
          item.typeOfIncome = 'StartupCost';
        } 

        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      let fuelSoldLogs = await fetchLogs({
        address: AddrOfTank,
        eventAbiString: 'event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });          

      fuelSoldLogs = [...fuelSoldLogs, ...(await fetchLogs({
        address: HexParser("0x1ACCB0C9A87714c99Bed5Ed93e96Dc0E67cC92c0"), 
        eventAbiString: 'event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      }))];          

      fuelSoldLogs = [...fuelSoldLogs, ...(await fetchLogs({
        address: HexParser("0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7"),
        eventAbiString: 'event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      }))];

      // fuelSoldLogs = fuelSoldLogs.filter((v:any) => v.blockNumber > fromBlkNum);
      console.log('fuelSoldLogs: ', fuelSoldLogs);
    
      len = fuelSoldLogs.length;
      cnt = 0;
    
      while (cnt < len) {
        let log = fuelSoldLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'FuelSold',
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

      let gmmTransferLogs = await fetchLogs({
        address: keepers[keepersMap.GMMKeeper],
        eventAbiString: 'event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)',
        args: {
          isCBP: true
        },
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });
    
      gmmTransferLogs = gmmTransferLogs.filter((v:any) => 
          v.args.isCBP == true &&
          v.args.to?.toLowerCase() != AddrOfTank.toLowerCase() &&
          v.args.to?.toLowerCase() != "0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7".toLowerCase() &&
          v.args.to?.toLowerCase() != "0x1ACCB0C9A87714c99Bed5Ed93e96Dc0E67cC92c0".toLowerCase() );

      console.log('gmmTransferCbpLogs: ', gmmTransferLogs);

      len = gmmTransferLogs.length;
      cnt = 0;

      while (cnt < len) {
        let log = gmmTransferLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
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

      let bmmTransferLogs = await fetchLogs({
        address: keepers[keepersMap.BMMKeeper],
        eventAbiString: 'event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)',
        args:{
          isCBP: true
        },
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      console.log('bmmTransferCbpLogs: ', bmmTransferLogs);

      len = bmmTransferLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = bmmTransferLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:Cashflow = {...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
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

      await setFinDataTopBlk(gk, 'cbpOutflow', toBlkNum);
      console.log('updated topBlk Of CbpOutflow: ', toBlkNum);

      if (arr.length > 0) {

        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq:i}));
        console.log('arr added into cbpOutflow:', arr);

        await setFinData(gk, 'cbpOutflow', arr);

        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }

      } 

      if (logs && logs.length > 0) {
        logs = logs.map((v,i) => ({...v, seq:i}));
        setRecords(logs);
      }

    }

    getEthOutflow();

  }, [ gk, client, exRate, keepers, setRecords]);


  return (
    <>
    </>
  );
} 