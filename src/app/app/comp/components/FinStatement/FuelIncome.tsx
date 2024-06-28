import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, HexType, } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, dateParser, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { ProfitsProps } from "./Revenue";

export type FuelIncomeProps = {
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  amt: bigint,
}

export function FuelIncome({sum, setSum}:ProfitsProps ) {
  const { gk } = useComBooxContext();

  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ records, setRecords ] = useState<FuelIncomeProps[]>([]);

  useEffect(()=>{

    const getEvents = async () => {

      let sum = 0n;

      let logs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReceivedCash(address indexed from, uint indexed amt)'),
        args: {
          from: AddrOfTank,
        },
        fromBlock: 1n,
      });

      let cnt = logs.length;
      let arr: FuelIncomeProps[]=[];

      while (cnt > 0) {

        let blkNo = logs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber:blkNo});  

        let item:FuelIncomeProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: logs[cnt-1].transactionHash,
          amt: logs[cnt-1].args.amt ?? 0n,
        }

        console.log('get fuelIncome: ', item);
        cnt--;

        if (item.amt > 0n) {

          sum += item.amt;

          if (arr.length > 0 ) {
            let last:FuelIncomeProps = arr[arr.length-1];

            if (last.blockNumber == item.blockNumber &&
                last.transactionHash == item.transactionHash) 
            {
              arr[arr.length-1].amt += item.amt;
              continue;
            }
          }

          arr.push(item);          
        }

      }

      setRecords(arr);
      setSum(sum);
    }

    getEvents();

  },[client, gk, setSum]);

  const columns: GridColDef[] = [
    {
      field: 'blockNumber',
      headerName: 'BlockNumber',
      valueGetter: p => longSnParser(p.row.blockNumber.toString()),
      width: 218,
    },
    {
      field: 'timestamp',
      headerName: 'Date',
      valueGetter: p => dateParser(p.row.timestamp.toString()),
      width: 218,
    },
    {
      field: 'amount',
      headerName: 'Amount (ETH)',
      valueGetter: p => bigIntToStrNum(p.row.amt, 18),
      width: 218,
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
        <b>CBP Sales Income: ({ bigIntToStrNum(sum, 18) } ETH)</b>
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
            getRowId={(row:FuelIncomeProps) => (row.blockNumber.toString() + row.transactionHash) } 
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