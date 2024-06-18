import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { HexType, booxMap, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { getShare } from "../../ros/ros";
import { ProfitsProps } from "./Revenue";

export type PaidInCapProps = {
  blockNumber: bigint,
  transactionHash: HexType,
  typeOfIncome: string,
  amt: bigint,
  from: number,
}

export function PaidInCap({sum, setSum}:ProfitsProps ) {
  const { gk, keepers, boox } = useComBooxContext();
  
  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ records, setRecords ] = useState<PaidInCapProps[]>([]);

  useEffect(()=>{

    const getEvents = async () => {

      let blk = await client.getBlockNumber();
      let sum = 0n;


      if (!keepers) return;

      let payInLogs = await client.getLogs({
        address: keepers[keepersMap.ROMKeeper],
        event: parseAbiItem('event PayInCapital(uint indexed seqOfShare, uint indexed amt, uint indexed valueOfDeal)'),
        fromBlock: blk > (8640n * 1095n) ? blk - (8640n * 1095n) : 1n,
      });  
      
      let cnt = payInLogs.length;
      let arr: PaidInCapProps[]=[];

      while (cnt > 0) {

        if (!payInLogs[cnt-1].args.valueOfDeal) {
          cnt--;
          continue;
        }

        let seqOfShare = payInLogs[cnt-1].args.seqOfShare?.toString() ?? '0';

        if (seqOfShare == '0' || !boox) return;

        let share = await getShare(boox[booxMap.ROS], seqOfShare);

        let item:PaidInCapProps = {
          blockNumber: payInLogs[cnt-1].blockNumber,
          transactionHash: payInLogs[cnt-1].transactionHash,
          typeOfIncome: 'via Areements',
          amt: payInLogs[cnt-1].args.valueOfDeal ?? 0n,
          from: share.head.shareholder,
        }

        console.log('get item: ', item);
        cnt--;

        sum += item.amt;

        if (arr.length > 0) {
          
          let lastEle = arr[arr.length - 1];

          if (lastEle.blockNumber == item.blockNumber && 
              lastEle.transactionHash == item.transactionHash &&
              lastEle.from == item.from)
          {
              arr[arr.length - 1].amt += item.amt;
              continue;
          }
        } 
        
        arr.push(item);
      }

      let buyListLogs = await client.getLogs({
        address: keepers[keepersMap.LOOKeeper],
        event: parseAbiItem('event AcquireListedOffer(uint indexed paid, uint indexed valueOfDeal, uint indexed caller)'),
        fromBlock: blk > (8640n * 1095n) ? blk - (8640n * 1095n) : 1n,
      });  
      
      cnt = buyListLogs.length;

      while (cnt > 0) {

        if (!buyListLogs[cnt-1].args.valueOfDeal) {
          cnt--;
          continue;
        }

        let item:PaidInCapProps = {
          blockNumber: buyListLogs[cnt-1].blockNumber,
          transactionHash: buyListLogs[cnt-1].transactionHash,
          typeOfIncome: 'via Listing',
          amt: buyListLogs[cnt-1].args.valueOfDeal ?? 0n,
          from: Number(buyListLogs[cnt-1].args.caller) ?? 0,
        }

        console.log('get ethIncome: ', item);
        cnt--;

        sum += item.amt;

        if (arr.length > 0) {

          let lastEle = arr[arr.length-1];

          if (lastEle.blockNumber == item.blockNumber &&
              lastEle.transactionHash == item.transactionHash &&
              lastEle.from == item.from) 
          {
              arr[arr.length-1].amt += item.amt;
              continue;
          } 
        } 
        
        arr.push(item);
      }

      setRecords(arr);
      setSum(sum);
    }

    getEvents();

  },[client, gk, boox, keepers, setSum]);

  const columns: GridColDef[] = [
    {
      field: 'blockNumber',
      headerName: 'BlockNumber',
      valueGetter: p => longSnParser(p.row.blockNumber.toString()),
      width: 218,
    },
    {
      field: 'typeOfIncome',
      headerName: 'TypeOfIncome',
      valueGetter: p => p.row.typeOfIncome,
      width: 218,
    },
    {
      field: 'amount',
      headerName: 'Amount (ETH)',
      valueGetter: p => bigIntToStrNum(p.row.amt, 18),
      width: 218,
    },
    {
      field: 'from',
      headerName: 'From',
      valueGetter: p => p.row.from,
      width: 258,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({value}) => {
        if (typeof value == 'number')
            return (longSnParser(value.toString()));
        else return (<CopyLongStrTF title="Addr" src={value} />);
      },
    },
    {
      field: 'transactionHash',
      headerName: 'TransactionHash',
      valueGetter: p => longSnParser(p.row.transactionHash),
      width: 258,
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <CopyLongStrTF title="Hash" src={value} />
      ),
    },
  ];


  return (
    <>
      <Button 
        variant="outlined"
        fullWidth
        sx={{m:0.5, minWidth:218, justifyContent:'start'}}
        onClick={()=>setOpen(true)}
      >
        <b>Paid-In Cap: ({ bigIntToStrNum(sum, 18) } ETH)</b>
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title" 
      >

        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <b>Paid-In Capital - ({ bigIntToStrNum(sum, 18) } ETH) </b>
        </DialogTitle>

        <DialogContent>
          <Paper elevation={3} sx={{m:1, p:1 }} >

          <DataGrid 
            initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
            pageSizeOptions={[5, 10, 15, 20]} 
            rows={ records } 
            getRowId={(row:PaidInCapProps) => (row.blockNumber.toString() + row.transactionHash + row.from) } 
            columns={ columns }
            disableRowSelectionOnClick
          />

          </Paper>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog> 

    </>
  );
} 