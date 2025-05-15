import { useEffect } from "react";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { AddrZero, booxMap, Bytes32Zero, HexType, keepersMap } from "../../../../common";
import { usePublicClient } from "wagmi";
import { decodeEventLog } from "viem";
import { Cashflow, CashflowRecordsProps, defaultCashflow } from "../../FinStatement";
import { getFinData, getFinDataTopBlk, setFinData, setFinDataTopBlk } from "../../../../../api/firebase/finInfoTools";
import { registerOfSharesABI, usdRomKeeperABI } from "../../../../../../../generated";
import { getShare, parseSnOfShare } from "../../../ros/ros";
import { addrToUint, HexParser } from "../../../../common/toolsKit";
import { fetchLogs } from "../../../../common/getLogs";

export type UsdInflowSum = {
  totalAmt: bigint;
  upgradeCashier: bigint;
  capital: bigint;
  premium: bigint;
  flag: boolean;
}

export const defUsdInflowSum: UsdInflowSum = {
  totalAmt: 0n,
  upgradeCashier: 0n,
  capital: 0n,
  premium: 0n,
  flag: false,
}

interface ReleaseUsdLog {
  txHash: HexType;
  blockNumber: bigint;
  from: HexType;
  amt: bigint;
}

export const defUsdInflowSumArr: UsdInflowSum[] = [
  defUsdInflowSum, defUsdInflowSum, defUsdInflowSum, defUsdInflowSum
]

export const sumArrayOfUsdInflow = (arr: Cashflow[]) => {
  
  let sum: UsdInflowSum = {...defUsdInflowSum};

  if (arr.length > 0) {
    arr.forEach(v => {
      sum.totalAmt += v.amt;
  
      switch (v.typeOfIncome) {
        case 'PayInCap':
          sum.capital += v.amt;
          break;
        case 'PayInPremium': 
          sum.premium += v.amt;
          break;
        case 'UpgradeCashier':
          sum.upgradeCashier += v.amt;
          break;
      }
    }); 
  }

  sum.flag = true;

  return sum;
}

export const csHis = [
  HexParser("0x8871e3Bb5Ac263E10e293Bee88cce82f336Cb20a"),
];

export const updateUsdInflowSum = (arr: Cashflow[], startDate:number, endDate:number ) => {
  
  let sum: UsdInflowSum[] = [...defUsdInflowSumArr];

  if (arr.length > 0 ) {
    sum[1] = sumArrayOfUsdInflow(arr.filter(v => v.timestamp < startDate));
    sum[2] = sumArrayOfUsdInflow(arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate));
    sum[3] = sumArrayOfUsdInflow(arr.filter(v => v.timestamp <= endDate));  
  }
  
  console.log('range:', startDate, endDate);
  console.log('usdInflow:', sum);
  return sum;
}

export function UsdInflow({exRate, setRecords}:CashflowRecordsProps) {
  const { gk, boox, keepers } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    const getUsdInflow = async () => {

      if (!gk || !boox || !keepers) return;

      const cashier = boox[booxMap.Cashier];
      const usdRomKeeper = keepers[keepersMap.UsdROMKeeper];
      const ros = boox[booxMap.ROS];

      let logs = await getFinData(gk, 'usdInflow');

      let fromBlkNum = await getFinDataTopBlk(gk, 'usdInflow');
      if (!fromBlkNum) {
        fromBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      };

      console.log('topBlk of usdInflow: ', fromBlkNum);
      let toBlkNum = await client.getBlockNumber();

      let arr: Cashflow[] = [];

      const appendPayInCapLog = async (log:ReleaseUsdLog, paid:bigint, acct:number) => {
        
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let itemOfCap:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.txHash,
          typeOfIncome: 'PayInCap',
          amt: paid,
          ethPrice: addrToUint(log.from ?? AddrZero) ,
          usd: paid,
          addr: log.from ?? AddrZero,
          acct: BigInt(acct),
        };

        arr.push(itemOfCap);

        let premium = log.amt - paid;

        if (premium > 0n) {

          let itemOfPremium:Cashflow = { ...itemOfCap,
            typeOfIncome: 'PayInPremium',
            amt: premium,
            ethPrice: addrToUint(log.from ?? AddrZero),
            usd: premium,
          };
  
          arr.push(itemOfPremium);
        } 
      }

      let payInCapLogs = await fetchLogs({
        address: cashier,
        eventAbiString: 'event ReceiveUsd(address indexed from, uint indexed amt)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      payInCapLogs = [...payInCapLogs, ...(await fetchLogs({
        address: csHis[0],
        eventAbiString: 'event ReceiveUsd(address indexed from, uint indexed amt)',
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      }))];

      console.log('payInCapLogs: ', payInCapLogs);

      let len = payInCapLogs.length;
      let cnt = 0;

      while (cnt < len) {
        let log = payInCapLogs[cnt];

        let input:ReleaseUsdLog = {
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          from: log.args.from ?? Bytes32Zero,
          amt: log.args.amt ?? 0n
        }

        let receipt = await client.getTransactionReceipt({
          hash: log.transactionHash
        });

        let usdRomKeeperLog = receipt.logs
          .filter(v => v.address === usdRomKeeper.toLowerCase())
          .map(v => {
            try {
              return decodeEventLog({
                abi: usdRomKeeperABI,
                eventName: 'PayInCapital',
                data: v.data,
                topics: v.topics,
              });
            } catch {
              return null;
            }
          }).filter(Boolean)
          .find(v => v?.eventName == 'PayInCapital');
        
        if (usdRomKeeperLog) {
          let paid = (usdRomKeeperLog?.args.paid ?? 0n) * 100n;
          let acct =  (await getShare(ros, (usdRomKeeperLog?.args.seqOfShare.toString() ?? '0')))
              .head.shareholder;

          await appendPayInCapLog(input, paid, acct);
        } 

        cnt++;
      }

      let releaseUsdLogs = await fetchLogs({
        address: cashier,
        eventAbiString: 'event ReleaseUsd(address indexed from, address indexed to, uint indexed amt, bytes32 remark)',
        args: {
          to: cashier
        },        
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      console.log('releaseUsdLogs: ', releaseUsdLogs);

      len = releaseUsdLogs.length;
      cnt = 0;

      while (cnt < len) {

        let log = releaseUsdLogs[cnt];

        let input:ReleaseUsdLog = {
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          from: log.args.from ?? Bytes32Zero,
          amt: log.args.amt ?? 0n
        }

        let receipt = await client.getTransactionReceipt({
          hash: log.transactionHash
        });

        let rosLog = receipt.logs
          .filter(v => v.address === ros.toLowerCase())
          .map(v => {
            try {
              return decodeEventLog({
                abi: registerOfSharesABI,
                eventName: 'IssueShare',
                data: v.data,
                topics: v.topics,
              });
            } catch {
              return null;
            }
          }).filter(Boolean)
          .find(v => v && v.eventName == 'IssueShare' &&
            v.args.paid * BigInt(parseSnOfShare(
              v.args.shareNumber
            ).priceOfPaid) / 100n === log.args.amt
          );

        let paid = (rosLog?.args.paid ?? 0n) * 100n;
        let acct = parseSnOfShare(rosLog?.args.shareNumber ?? Bytes32Zero)
          .shareholder;

        await appendPayInCapLog(input, paid, acct);  

        cnt++;
      }

      let forwardUsdLogs = await fetchLogs({
        address: cashier,
        eventAbiString: 'event ForwardUsd(address indexed from, address indexed to, uint indexed amt, bytes32 remark)',
        args: {
          to: cashier
        },        
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      console.log('forwardUsdLogs: ', forwardUsdLogs);

      len = forwardUsdLogs.length;
      cnt = 0;

      while (cnt < len) {

        let log = forwardUsdLogs[cnt];

        let input:ReleaseUsdLog = {
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          from: log.args.from ?? Bytes32Zero,
          amt: log.args.amt ?? 0n
        }

        let receipt = await client.getTransactionReceipt({
          hash: log.transactionHash
        });

        let rosLog = receipt.logs
          .filter(v => v.address === ros.toLowerCase())
          .map(v => {
            try {
              return decodeEventLog({
                abi: registerOfSharesABI,
                eventName: 'IssueShare',
                data: v.data,
                topics: v.topics,
              });
            } catch {
              return null;
            }
          }).filter(Boolean)
          .find(v => v && v.eventName == 'IssueShare' &&
            v.args.paid * BigInt(parseSnOfShare(
              v.args.shareNumber
            ).priceOfPaid) / 100n === log.args.amt
          );

        let paid = (rosLog?.args.paid ?? 0n) * 100n;
        let acct = parseSnOfShare(rosLog?.args.shareNumber ?? Bytes32Zero)
          .shareholder;

        await appendPayInCapLog(input, paid, acct);  

        cnt++;
      }

      let upgradeLogs = await fetchLogs({
        address: csHis[0],
        eventAbiString: 'event TransferUsd(address indexed to, uint indexed amt)',
        args: {
          to: cashier
        },        
        fromBlkNum: fromBlkNum,
        toBlkNum: toBlkNum,
        client: client,
      });

      console.log('upgradeLogs: ', upgradeLogs);

      len = upgradeLogs.length;
      cnt = 0;

      while (cnt < len) {

        let log = upgradeLogs[cnt];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:Cashflow = { ...defaultCashflow,
          seq: 0,
          blockNumber: blkNo,
          timestamp: Number(blk.timestamp),
          transactionHash: log.transactionHash,
          typeOfIncome: 'UpgradeCashier',
          amt: log.args.amt ?? 0n,
          ethPrice: addrToUint(csHis[0]),
          usd: log.args.amt ?? 0n,
          addr: csHis[0],
          acct: 0n,
        };

        arr.push(item);

        cnt++;
      }      

      await setFinDataTopBlk(gk, 'usdInflow', toBlkNum);
      console.log('updated topBlk Of usdInflow: ', toBlkNum);

      if (arr.length > 0) {
        
        arr = arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        arr = arr.map((v, i) => ({...v, seq: i}));
        console.log('add arr into usdInflow:', arr);

        await setFinData(gk, 'usdInflow', arr);
        
        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }
      } 
      
      if (logs && logs.length > 0) {
        logs = logs.map((v,i) => ({...v, seq:i}));
        setRecords(logs);
        console.log('logs in usdInflow:', logs);
      }
    }

    getUsdInflow();

  },[gk, boox, client, keepers, setRecords]);

  return (
    <></>
  );

} 