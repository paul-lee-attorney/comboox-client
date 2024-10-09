import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrZero, Bytes32Zero } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { baseToDollar, bigIntToStrNum } from "../../../common/toolsKit";
import { ethers } from "ethers";
import { CashflowProps } from "../FinStatement";
import { CashflowRecordsProps } from "./CbpIncome";
import { getFinData, setFinData } from "../../../../api/firebase/finInfoTools";
import { EthPrice, getEthPricesForAppendRecords, getPriceAtTimestamp } from "../../../../api/firebase/ethPriceTools";

export type DepositsSumProps = {
  totalAmt: bigint;
  sumInUsd: bigint;
  consideration: bigint;
  considerationInUsd: bigint;
  balance: bigint;
  balanceInUsd: bigint;
  custody: bigint;
  custodyInUsd: bigint;
  distribution: bigint;
  distributionInUsd: bigint;
  pickup: bigint;
  pickupInUsd: bigint;
  flag: boolean;
}

export const defaultDepositsSum:DepositsSumProps = {
  totalAmt: 0n,
  sumInUsd: 0n,
  consideration: 0n,
  considerationInUsd: 0n,
  balance: 0n,
  balanceInUsd: 0n,
  custody: 0n,
  custodyInUsd: 0n,
  distribution: 0n,
  distributionInUsd: 0n,
  pickup: 0n,
  pickupInUsd: 0n,
  flag: false,
}

export interface DepositsProps extends CashflowRecordsProps {
  sum: DepositsSumProps;
  setSum: Dispatch<SetStateAction<DepositsSumProps>>;
}

export function Deposits({ inETH, exRate, centPrice, sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:DepositsProps ) {
  const { gk } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    let sum: DepositsSumProps = { ...defaultDepositsSum };

    const getDeposits = async ()=>{

      if (!gk) return;

      let logs = await getFinData(gk, 'deposits');
      let lastBlkNum = logs ? logs[logs.length - 1].blockNumber : 0n;
      console.log('latestBlkOfDeposits: ', lastBlkNum);

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
            case 'Pickup':
              sum.totalAmt -= v.amt;
              sum.sumInUsd -= v.usd;
              sum.pickup += v.amt;
              sum.pickupInUsd += v.usd;
              break;
            case 'DepositConsiderationOfSTDeal':
            case 'CloseBidAgainstOffer':
            case 'DepositConsiderationOfSwap': 
            case 'DepositConsiderOfRejectedDeal':
              sum.totalAmt += v.amt;
              sum.sumInUsd += v.usd;
              sum.consideration += v.amt;
              sum.considerationInUsd += v.usd;
              break;
            case 'DepositBalanceOfOTCDeal': 
            case 'DepositBalanceOfPayInCap':
            case 'DepositBalanceOfSwap':
            case 'DepositBalanceOfBidOrder':
            case 'DepositBalanceOfRejectedDeal':
              sum.totalAmt += v.amt;
              sum.sumInUsd += v.usd;
              sum.balance += v.amt;
              sum.balanceInUsd += v.usd;
              break;
            case 'CustodyValueOfBidOrder':
              sum.totalAmt += v.amt;
              sum.sumInUsd += v.usd;
              sum.custody += v.amt;
              sum.custodyInUsd += v.usd;
              v.acct = BigInt(v.acct / 2n**40n);
              break;
            case 'CloseOfferAgainstBid': 
              sum.custody -= v.amt;
              sum.custodyInUsd -= v.usd;
              sum.consideration += v.amt;
              sum.considerationInUsd += v.usd;
              break;
            case 'RefundValueOfBidOrder':
              sum.custody -= v.amt;
              sum.custodyInUsd -= v.usd;
              sum.balance += v.amt;
              sum.balanceInUsd += v.usd;
              break;
            case 'CloseInitOfferAgainstBid':
              sum.totalAmt -= v.amt;
              sum.sumInUsd -= v.usd;
              sum.custody -= v.amt;
              sum.custodyInUsd -= v.usd;
              break;
            case 'DistributeProfits':
              sum.totalAmt += v.amt;
              sum.sumInUsd += v.usd;
              sum.distribution += v.amt;
              sum.distributionInUsd += v.usd;
              break;
          }

        });
      }


      const appendItem = (newItem: CashflowProps, refPrices: EthPrice[]) => {
        if (newItem.amt > 0n) {

          let mark = getPriceAtTimestamp(Number(newItem.timestamp * 1000n), refPrices);
          newItem.ethPrice = 10n ** 25n / mark.centPrice;
          newItem.usd = newItem.amt * newItem.ethPrice / 10n ** 9n;
          
          arr.push(newItem);
        }
      } 

      let pickupLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event PickupDeposit(address indexed to, uint indexed caller, uint indexed amt)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      pickupLogs = pickupLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('pickupLogs: ', pickupLogs);

      let len = pickupLogs.length;
      let cnt = 0;

      while(cnt < len) {

        let log = pickupLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'Pickup',
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: log.args.to ?? AddrZero,
          acct: log.args.caller ?? 0n,
        }
    
        if (cnt == 0) {
          ethPrices = await getEthPrices(item.timestamp);
          if (ethPrices.length == 0) return;
        }

        appendItem(item, ethPrices);
        cnt++;
      }

      let depositLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event SaveToCoffer(uint indexed acct, uint256 indexed value, bytes32 indexed reason)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      depositLogs = depositLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('depositLogs: ', depositLogs);

      len = depositLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = depositLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: ethers.decodeBytes32String(log.args.reason ?? Bytes32Zero),
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

      let custodyLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReleaseCustody(uint indexed from, uint indexed to, uint indexed amt, bytes32 reason)'),
        fromBlock: lastBlkNum > 0n ? (lastBlkNum + 1n) : 'earliest',
      });

      custodyLogs = custodyLogs.filter(v => v.blockNumber > lastBlkNum);
      console.log('custodyLogs: ', custodyLogs);

      len = custodyLogs.length;
      cnt = 0;

      while(cnt < len) {

        let log = custodyLogs[cnt];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: ethers.decodeBytes32String(log.args.reason ?? Bytes32Zero),
          amt: log.args.amt ?? 0n,
          ethPrice: 0n,
          usd: 0n,
          addr: AddrZero,
          acct: log.args.to ?? 0n,
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

        await setFinData(gk, 'deposits', arr);

        if (logs) {
          logs = logs.concat(arr);
        } else {
          logs = arr;
        }
        
      } else if (!logs) {
        return;
      }

      sumArry(logs);
      sum.flag = true;

      setRecords(logs);
      setSum(sum);
    }

    getDeposits();

  }, [gk, client, setSum, setRecords]);

  const showList = () => {

    let curSumInUsd = sum.totalAmt * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'Deposits - (ETH ', data: sum.totalAmt},
          {title: 'Pickup', data: sum.pickup},     
          {title: 'Consideration', data: sum.consideration},
          {title: 'Distribution', data: sum.distribution},
          {title: 'Custody', data: sum.custody},
          {title: 'Balance', data: sum.balance} 
        ]
      : [ {title: 'Deposits - (USD ', data: sum.sumInUsd},
          {title: 'Exchange Gain / Loss', data: sum.sumInUsd - curSumInUsd},
          {title: 'Pickup', data: sum.pickupInUsd},
          {title: 'Consideration', data: sum.considerationInUsd},
          {title: 'Distribution', data: sum.distributionInUsd},
          {title: 'Custody', data: sum.custodyInUsd},
          {title: 'Balance', data: sum.balanceInUsd}
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
          <b>ETH In Deposits: ({ inETH
              ? bigIntToStrNum(sum.totalAmt / 10n**9n, 9) + ' ETH'
              : baseToDollar((sum.sumInUsd / 10n**14n).toString()) + ' USD'})</b>
        </Button>
      )}
    </>
  );
} 