import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, HexType } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, dateParser, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { rate } from "../../../fuel_tank/ft";

export interface ProfitsProps {
  sum: bigint;
  setSum: Dispatch<SetStateAction<bigint>>;
}

export type IncomeProps = {
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  typeOfIncome: string,
  isCBP: boolean,
  amt: bigint,
  from: HexType,
}


export function Revenue({sum, setSum}:ProfitsProps ) {
  const { gk } = useComBooxContext();
  
  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ records, setRecords ] = useState<IncomeProps[]>([]);
  const [ value, setValue ] = useState(0n);

  useEffect(()=>{

    const getEvents = async () => {

      let sum = 0n;

      let cbpLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        fromBlock: 1n,
        args: {
          to: gk,
        }
      });

      let cnt = cbpLogs.length;
      let arr: IncomeProps[] = [];

      while (cnt > 0) {

        if (cbpLogs[cnt-1].args.from == AddrOfTank || cbpLogs[cnt-1].args.from == AddrZero) {
            cnt--;
            continue;
        }

        let blkNo = cbpLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:IncomeProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: cbpLogs[cnt-1].transactionHash,
          typeOfIncome: 'Royalty Income',
          isCBP: true,
          amt: cbpLogs[cnt-1].args.value ?? 0n,
          from: cbpLogs[cnt-1].args.from ?? AddrZero,
        }

        // console.log('get cbpIncome: ', item);
        cnt--;

        if (item.amt > 0n) {

          sum += item.amt;

          if (arr.length > 0 ) {
            let last:IncomeProps = arr[arr.length-1];

            if (last.blockNumber == item.blockNumber &&
                last.transactionHash == item.transactionHash &&
                last.from == item.from &&
                last.isCBP == item.isCBP &&
                last.typeOfIncome == item.typeOfIncome) 
            {
              arr[arr.length-1].amt += item.amt;
              continue;
            }
          }

          arr.push(item);          
        }  
        
      }

      let exRate = await rate(undefined);
      if (exRate > 0) {
        sum = sum * 10000n / exRate;
      }

      let ethLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReceivedCash(address indexed from, uint indexed amt)'),
        fromBlock: 1n,
      });

      cnt = ethLogs.length;

      while (cnt > 0) {

        if (ethLogs[cnt-1].args.from == AddrOfTank) {
          cnt--;
          continue;
        }

        let blkNo = ethLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:IncomeProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: ethLogs[cnt-1].transactionHash,
          typeOfIncome: 'Eth Income',
          isCBP: false,
          amt: ethLogs[cnt-1].args.amt ?? 0n,
          from: ethLogs[cnt-1].args.from ?? AddrZero,
        }

        // console.log('get ethIncome: ', item);
        cnt--;

        if (item.amt > 0n) {

          sum += item.amt;

          if (arr.length > 0 ) {
            let last:IncomeProps = arr[arr.length-1];

            if (last.blockNumber == item.blockNumber &&
                last.transactionHash == item.transactionHash &&
                last.from == item.from &&
                last.isCBP == item.isCBP && 
                last.typeOfIncome == item.typeOfIncome) 
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
      setValue(sum);
    }

    getEvents();

  },[client, gk, setSum, setValue]);

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
      field: 'typeOfIncome',
      headerName: 'TypeOfIncome',
      valueGetter: p => p.row.typeOfIncome,
      width: 218,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      valueGetter: p => bigIntToStrNum(p.row.amt, 18),
      width: 218,
    },
    {
      field: 'currency',
      headerName: 'Currency',
      valueGetter: p => p.row.isCBP ? 'CBP' : 'ETH',
      width: 218,
    },
    {
      field: 'from',
      headerName: 'From',
      valueGetter: p => p.row.from,
      width: 258,
      headerAlign: 'center',
      renderCell: ({value}) => (
        <CopyLongStrTF title="Addr" src={value} />
      ),
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
        <b>Revenue: ({ bigIntToStrNum(value, 18) } ETH)</b>
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title" 
      >

        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <b>Revenue - { bigIntToStrNum(value, 18) } ETH </b>
        </DialogTitle>

        <DialogContent>
          <Paper elevation={3} sx={{m:1, p:1 }} >

            <DataGrid 
              initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
              pageSizeOptions={[5, 10, 15, 20]} 
              rows={ records } 
              getRowId={(row:IncomeProps) => (row.blockNumber.toString() + row.transactionHash + row.from) } 
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