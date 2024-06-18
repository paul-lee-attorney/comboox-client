import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, AddrZero, HexType } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { ProfitsProps } from "./Revenue";
import { rate } from "../../../fuel_tank/ft";

export type ExpenseProps = {
  blockNumber: bigint,
  transactionHash: HexType,
  typeOfMotion: string,
  isCBP: boolean,
  amt: bigint,
  rate: bigint,
  value: bigint,
  to: HexType,
}

export interface ExpenseInterfaceProps extends ProfitsProps{
  addr: HexType;
  title: string;
}

export function Expense({addr, title, sum, setSum}: ExpenseInterfaceProps) {
  const { gk } = useComBooxContext();
  
  const client = usePublicClient();

  const [ open, setOpen ] = useState(false);
  const [ records, setRecords ] = useState<ExpenseProps[]>([]);
  const [ exp, setExp ] = useState(0n);

  useEffect(()=>{

    const calValue = async (item: ExpenseProps): Promise<ExpenseProps> => {
      let rateOfEx = await rate(item.blockNumber);

      if (rateOfEx > 0) {
        
        item.rate = rateOfEx;

        if (item.isCBP) {
          item.value = item.amt * 10000n / rateOfEx;
        } else {
          item.value = item.amt;
        }

      }

      return item;
    }
  
    const getEvents = async (addr:HexType) => {

      let blk = await client.getBlockNumber();
      let sum = 0n;

      let tfLogs = await client.getLogs({
        address: addr,
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: blk > (8640n * 1095n) ? blk - (8640n * 1095n) : 1n,
      });

      let cnt = tfLogs.length;
      let arr: ExpenseProps[]=[];

      while (cnt > 0) {

        if (tfLogs[cnt-1].args.to == AddrOfTank ||
            !tfLogs[cnt-1].args.amt) {
          cnt--;
          continue;
        }

        let item:ExpenseProps = {
          blockNumber: tfLogs[cnt-1].blockNumber,
          transactionHash: tfLogs[cnt-1].transactionHash,
          typeOfMotion: 'TransferFund',
          isCBP: tfLogs[cnt-1].args.isCBP ?? false,
          amt: tfLogs[cnt-1].args.amt ?? 0n,
          rate: 0n,
          value: 0n,
          to: tfLogs[cnt-1].args.to ?? AddrZero,
        }

        item = await calValue(item);

        console.log('get tfItem: ', item);
        cnt--;

        sum += item.value;
        arr.push(item);
      }

      let eaLogs = await client.getLogs({
        address: addr,
        event: parseAbiItem('event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)'),
        fromBlock: blk > (8640n * 1095n) ? blk - (8640n * 1095n) : 1n,
      });

      cnt = eaLogs.length;
      while (cnt > 0) {

        if (!eaLogs[cnt-1].args.values ||
          eaLogs[cnt-1].args.targets == AddrOfTank
        ) {
          cnt--;
          continue;
        }

        let item:ExpenseProps = {
          blockNumber: eaLogs[cnt-1].blockNumber,
          transactionHash: eaLogs[cnt-1].transactionHash,
          typeOfMotion: 'ExecAction',
          isCBP: false,
          amt: eaLogs[cnt-1].args.values ?? 0n,
          rate: 0n,
          value: 0n,
          to: AddrZero,
        }

        item = await calValue(item);

        console.log('get eaItem: ', item);
        cnt--;

        sum += item.value;
        arr.push(item);
      }

      setSum(sum);
      setExp(sum);
      setRecords(arr);
    }

    getEvents(addr);

  },[client, gk, addr, setSum]);

  const columns: GridColDef[] = [
    {
      field: 'blockNumber',
      headerName: 'BlockNumber',
      valueGetter: p => longSnParser(p.row.blockNumber.toString()),
      width: 218,
    },
    {
      field: 'typeOfMotion',
      headerName: 'TypeOfMotion',
      valueGetter: p => p.row.typeOfMotion,
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
      field: 'to',
      headerName: 'To',
      valueGetter: p => p.row.to,
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
          <b>Expense - {title} {' - (' + bigIntToStrNum(exp, 18) + ' ETH)'} </b>
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title" 
      >

        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <b>Expense - {title} { exp > 0 && ' - (' + bigIntToStrNum(exp, 18) + ' ETH)'} </b>
        </DialogTitle>

        <DialogContent>

          <DataGrid 
            initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
            pageSizeOptions={[5, 10, 15, 20]} 
            rows={ records } 
            getRowId={(row:ExpenseProps) => row.blockNumber.toString() } 
            columns={ columns }
            disableRowSelectionOnClick
          />

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  );
} 