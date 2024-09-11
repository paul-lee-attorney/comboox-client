import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, HexType } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { bigIntToStrNum } from "../../../common/toolsKit";
import { CashflowProps } from "../FinStatement";
import { SumInfo } from "./CashflowList";

export type CbpIncomeSumProps = {
  totalAmt: bigint;
  royalty: bigint;
  mint: bigint;
  transfer: bigint;
  gas: bigint;
  flag: boolean;
}

export const defaultSum: CbpIncomeSumProps = {
  totalAmt: 0n,
  royalty: 0n,
  mint: 0n,
  transfer: 0n,
  gas: 0n,
  flag: false,
}

export interface CashflowRecordsProps {
  records: CashflowProps[];
  setRecords: Dispatch<SetStateAction<CashflowProps[]>>;
  setSumInfo: Dispatch<SetStateAction<SumInfo[]>>;
  setList: Dispatch<SetStateAction<CashflowProps[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}


export interface CbpIncomeProps extends CashflowRecordsProps {
  sum: CbpIncomeSumProps;
  setSum: Dispatch<SetStateAction<CbpIncomeSumProps>>;
}

export function CbpIncome({sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:CbpIncomeProps ) {
  const { gk } = useComBooxContext();
  
  const client = usePublicClient();

  useEffect(()=>{

    let sum:CbpIncomeSumProps = {...defaultSum};

    const getCbpIncome = async () => {

      let arr: CashflowProps[] = [];
      let counter = 0;

      let cbpLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        fromBlock: 1n,
        args: {
          to: gk,
        }
      });

      let cnt = cbpLogs.length;

      while (cnt > 0) {
        let log = cbpLogs[cnt-1];

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'Royalty',
          amt: log.args.value ?? 0n,
          addr: log.args.from ?? AddrZero,
          acct: 0n,
        }

        if (item.addr.toLowerCase() == AddrOfTank.toLowerCase()) {
          item.typeOfIncome = 'Gas'
        } else if (item.addr.toLowerCase() == AddrZero.toLowerCase()) {
          item.typeOfIncome = 'Mint';
        } else {
          let tran = await client.getTransaction({hash: item.transactionHash});

          if ( tran.to?.toLowerCase() == AddrOfRegCenter.toLowerCase() && 
                tran.input.substring(0,10).toLowerCase() == '0xa9059cbb') 
          {  
            item.typeOfIncome = 'Transfer';
          }
        }
        
        if (item.amt > 0n) {

          sum.totalAmt += item.amt;
          item.seq = counter;

          switch (item.typeOfIncome) {
            case 'Royalty':
              sum.royalty += item.amt;
              break;
            case 'Transfer':
              sum.transfer += item.amt;
              break;
            case 'Gas':
              sum.gas += item.amt;
              break;
            default:
              sum.mint += item.amt;
          }

          arr.push(item);
          counter++;
        }
        
        cnt--;
      }

      sum.flag = true;
      
      setRecords(arr);
      setSum(sum);
    }

    if (client && gk) getCbpIncome();

  },[client, gk, setSum, setRecords]);

  const showList = () => {
    let arrSumInfo = [
      {title: 'CBP Income - (CBP ', data: sum.totalAmt},
      {title: 'Royalty', data: sum.royalty},
      {title: 'Mint', data: sum.mint},
      {title: 'Transfer', data: sum.transfer},
      {title: 'Gas', data: sum.gas},
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
        <b>CBP Income: ({bigIntToStrNum(sum.totalAmt/10n**9n, 9) + ' CBP'})</b>
      </Button>
    )}
  </>
  );
} 