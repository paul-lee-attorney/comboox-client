import { Dispatch, SetStateAction, useEffect } from "react";
import { Button,  } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { bigIntToStrNum, } from "../../../common/toolsKit";
import { CashflowProps } from "../FinStatement";
import { CashflowRecordsProps } from "./CbpIncome";

export type CbpOutflowSumProps = {
  totalAmt: bigint;
  newUserAward: bigint;
  fuelCost: bigint;
  gmmTransfer: bigint;
  bmmTransfer: bigint;
  flag: boolean;
}

export const defaultCbpOutSum:CbpOutflowSumProps = {
  totalAmt: 0n,
  newUserAward: 0n,
  fuelCost: 0n,
  gmmTransfer: 0n,
  bmmTransfer: 0n,
  flag: false,
}

export interface CbpOutflowProps extends CashflowRecordsProps {
  sum: CbpOutflowSumProps;
  setSum: Dispatch<SetStateAction<CbpOutflowSumProps>>;
}

export function CbpOutflow({sum, setSum, records, setRecords, setSumInfo, setList, setOpen}:CbpOutflowProps ) {
  const { gk, keepers } = useComBooxContext();
  
  const client = usePublicClient();
  
  useEffect(()=>{

    let sum: CbpOutflowSumProps = { ...defaultCbpOutSum};

    const getEthOutflow = async ()=>{

      if ( !keepers ) return;

      let arr: CashflowProps[] = [];
      let counter = 0;

      const appendItem = (newItem: CashflowProps) => {
        if (newItem.amt > 0n) {
    
          sum.totalAmt += newItem.amt;
          newItem.seq = counter;
  
          switch (newItem.typeOfIncome) {
            case 'NewUserAward': 
              sum.newUserAward += newItem.amt;
              break;
            case 'FuelCost':
              sum.fuelCost += newItem.amt;
              break;
            case 'GmmTransfer - CBP':
              sum.gmmTransfer += newItem.amt;
              break;
            case 'BmmTransfer - CBP':
              sum.bmmTransfer += newItem.amt;
          }
          
          arr.push(newItem);
          counter++;
        }
      } 

      let newUserAwardLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        fromBlock: 1n,
        args: {
          from: AddrZero,
        }
      });
    
      let cnt = newUserAwardLogs.length;
    
      while (cnt > 0) {
        let log = newUserAwardLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'NewUserAward',
          amt: log.args.value ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }
        
        if (item.addr.toLowerCase() == gk?.toLowerCase()) {
          cnt--;
          continue;
        } else {
          appendItem(item);
          cnt--;
        }
      }

      let gmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
        args: {
          isCBP: true
        }
      });
    
      cnt = gmmTransferLogs.length;
    
      while (cnt > 0) {
        let log = gmmTransferLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'GmmTransfer - CBP',
          amt: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }
        
        if (item.addr.toLowerCase() == AddrOfTank.toLowerCase() ||
            item.addr.toLowerCase() == "0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7".toLowerCase()) {
          item.typeOfIncome = 'FuelCost';
        }

        if (log.args.isCBP)
            appendItem(item);

        cnt--;
      }

      let bmmTransferLogs = await client.getLogs({
        address: keepers[keepersMap.BMMKeeper],
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
        args:{
          isCBP: true
        }
      });

      cnt = bmmTransferLogs.length;
      
      while(cnt > 0) {

        let log = bmmTransferLogs[cnt-1];
        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
     
        let item:CashflowProps = {
          seq: 0,
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          typeOfIncome: 'BmmTransfer - CBP',
          amt: log.args.amt ?? 0n,
          addr: log.args.to ?? AddrZero,
          acct: 0n,
        }

        appendItem(item);
    
        cnt--;
      }

      sum.flag = true;

      setRecords(arr);
      setSum(sum);
    }

    getEthOutflow();

  }, [ gk, client, keepers, setSum, setRecords]);

  const showList = () => {
    let arrSumInfo = [
      {title: 'CBP Outflow - (CBP ', data: sum.totalAmt},
      {title: 'New User Award', data: sum.newUserAward},
      {title: 'Fuel Cost', data: sum.fuelCost},
      {title: 'GMM Transfer', data: sum.gmmTransfer},
      {title: 'BMM Transfer', data: sum.bmmTransfer},
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
          <b>CBP Outflow: ({ bigIntToStrNum(sum.totalAmt/10n**9n, 9) + ' CBP' })</b>
        </Button>
      )}
    </>
  );
} 