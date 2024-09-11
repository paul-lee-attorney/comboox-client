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

export type DepositsSumProps = {
  totalAmt: bigint;
  consideration: bigint;
  balance: bigint;
  custody: bigint;
  distribution: bigint;
  pickup: bigint;
  flag: boolean;
}

export const defaultDepositsSum:DepositsSumProps = {
  totalAmt: 0n,
  consideration: 0n,
  balance: 0n,
  custody: 0n,
  distribution: 0n,
  pickup: 0n,
  flag: false,
}

export interface DepositsProps extends CashflowRecordsProps {
  sum: DepositsSumProps;
  setSum: Dispatch<SetStateAction<DepositsSumProps>>;
}

export function Deposits({sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:DepositsProps ) {
  const { gk } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    let sum: DepositsSumProps = { ...defaultDepositsSum };

    const getDeposits = async ()=>{

      if (!gk) return;

      let arr: CashflowProps[] = [];
      let counter = 0;

      const appendItem = (newItem: CashflowProps) => {
        if (newItem.amt > 0n) {
          
          newItem.seq = counter;

          switch (newItem.typeOfIncome) {
            case 'Pickup':
              sum.totalAmt -= newItem.amt;
              sum.pickup += newItem.amt;
              newItem.amt = -newItem.amt;
              break;
            case 'DepositConsiderationOfSTDeal':
            case 'CloseBidAgainstOffer':
            case 'DepositConsiderationOfSwap': 
            case 'DepositConsiderOfRejectedDeal':
              sum.totalAmt += newItem.amt;
              sum.consideration += newItem.amt;
              break;
            case 'DepositBalanceOfOTCDeal': 
            case 'DepositBalanceOfPayInCap':
            case 'DepositBalanceOfSwap':
            case 'DepositBalanceOfBidOrder':
            case 'DepositBalanceOfRejectedDeal':
              sum.totalAmt += newItem.amt;
              sum.balance += newItem.amt;
              break;
            case 'CustodyValueOfBidOrder':
              sum.totalAmt += newItem.amt;
              sum.custody += newItem.amt;
              newItem.acct = BigInt(newItem.acct / 2n**40n);
              break;
            case 'CloseOfferAgainstBid': 
            case 'RefundValueOfBidOrder':
              sum.custody -= newItem.amt;
              sum.consideration += newItem.amt;
              break;
            case 'CloseInitOfferAgainstBid':
              sum.totalAmt -= newItem.amt;
              sum.custody -= newItem.amt;
              break;
            case 'DistributeProfits':
              sum.totalAmt += newItem.amt;
              sum.distribution += newItem.amt;
              break;
          }

          arr.push(newItem);

          counter++;
        }
      } 

      let pickupLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event PickupDeposit(address indexed to, uint indexed caller, uint indexed amt)'),
        fromBlock: 1n,
      });

      let cnt = pickupLogs.length;

      while(cnt > 0) {

        let log = pickupLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'Pickup',
          amt: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: log.args.caller ?? 0n,
        }
    
        appendItem(item);

        cnt--;
      }

      let depositLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event SaveToCoffer(uint indexed acct, uint256 indexed value, bytes32 indexed reason)'),
        fromBlock: 1n,
      });

      cnt = depositLogs.length;

      while(cnt > 0) {

        let log = depositLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: ethers.decodeBytes32String(log.args.reason ?? Bytes32Zero),
          amt: log.args.value ?? 0n,
          addr: AddrZero,
          acct: log.args.acct ?? 0n,
        }
  
        appendItem(item);

        cnt--;
      }

      let custodyLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReleaseCustody(uint indexed from, uint indexed to, uint indexed amt, bytes32 reason)'),
        fromBlock: 1n,
      });

      cnt = custodyLogs.length;

      while(cnt > 0) {

        let log = custodyLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq:0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: ethers.decodeBytes32String(log.args.reason ?? Bytes32Zero),
          amt: log.args.amt ?? 0n,
          addr: AddrZero,
          acct: log.args.to ?? 0n,
        }

        appendItem(item);

        cnt--;
      }

      sum.flag = true;

      setRecords(arr);
      setSum(sum);
    }

    getDeposits();

  }, [gk, client, setSum]);

  const showList = () => {
    let arrSumInfo = [
      {title: 'Deposits - (ETH ', data: sum.totalAmt},
      {title: 'Pickup', data: sum.pickup},
      {title: 'Consideration', data: sum.consideration},
      {title: 'Distribution', data: sum.distribution},
      {title: 'Custody', data: sum.custody},
      {title: 'Balance', data: sum.balance},
    ]
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
          <b>Deposits: ({ bigIntToStrNum(sum.totalAmt / 10n**9n,9) + ' ETH'})</b>
        </Button>
      )}
    </>
  );
} 