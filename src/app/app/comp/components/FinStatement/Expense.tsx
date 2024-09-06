import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { AddrOfTank, AddrZero, HexType, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, dateParser, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { CbpIncomeProps, defaultSum, IncomeSumProps } from "./CbpIncome";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";

export type ExpenseProps = {
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  typeOfMotion: string,
  isCBP: boolean,
  amt: bigint,
  rate: bigint,
  value: bigint,
  to: HexType,
}

export interface ExpenseInterfaceProps extends CbpIncomeProps{
  title: string;
}

export function Expense({title, exRate, sum, setSum}: ExpenseInterfaceProps) {
  
  const { keepers } = useComBooxContext();

  const client = usePublicClient();

  const [ open, setOpen ] = useState(false);
  const [ records, setRecords ] = useState<ExpenseProps[]>([]);

  useEffect(()=>{

    const calValue = (item: ExpenseProps): ExpenseProps => {

      if (exRate > 0n) {
        
        item.rate = exRate;

        if (item.isCBP) {
          item.value = item.amt * 10000n / exRate;
        } else {
          item.value = item.amt;
        }

      }

      return item;
    }
  
    const getEvents = async (title:string) => {

      if (!keepers || keepers.length == 0) return;
      
      let addr = title == 'GMM' ? keepers[keepersMap.GMMKeeper] : keepers[keepersMap.BMMKeeper];

      let sum:IncomeSumProps = defaultSum;

      let tfLogs = await client.getLogs({
        address: addr,
        event: parseAbiItem('event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
      });

      let cnt = tfLogs.length;
      let arr: ExpenseProps[]=[];

      while (cnt > 0) {

        let blkNo = tfLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber:blkNo});

        let item:ExpenseProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: tfLogs[cnt-1].transactionHash,
          typeOfMotion: 'TransferFund',
          isCBP: tfLogs[cnt-1].args.isCBP ?? false,
          amt: tfLogs[cnt-1].args.amt ?? 0n,
          rate: 0n,
          value: 0n,
          to: tfLogs[cnt-1].args.to ?? AddrZero,
        }

        item = calValue(item);

        if (item.to == AddrOfTank) {
          if (item.isCBP) {
            item.typeOfMotion = 'FillTank';
          } else {
            item.typeOfMotion = 'RefuelGas';
          }
        } 

        // console.log('get tfItem: ', item);
        cnt--;

        if (item.amt > 0n) {
          sum.totalAmt += item.value;

          switch (item.typeOfMotion) {
            case 'TransferFund':
              sum.transfer += item.value;
              break;
            case 'FillTank':
              sum.mint += item.value;
              break;
            case 'RefuelGas':
              sum.gas += item.value;
          }
        } 

        arr.push(item);
      }

      let eaLogs = await client.getLogs({
        address: addr,
        event: parseAbiItem('event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)'),
        fromBlock: 1n,
      });

      cnt = eaLogs.length;
      while (cnt > 0) {

        if (!eaLogs[cnt-1].args.values) {
          cnt--;
          continue;
        }

        let blkNo = eaLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber:blkNo});

        let item:ExpenseProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: eaLogs[cnt-1].transactionHash,
          typeOfMotion: 'ExecAction',
          isCBP: false,
          amt: eaLogs[cnt-1].args.values ?? 0n,
          rate: 0n,
          value: eaLogs[cnt-1].args.values ?? 0n,
          to: eaLogs[cnt-1].args.targets ?? AddrZero,
        }

        if (item.to == AddrOfTank) {
          item.typeOfMotion = 'RefuelGas';
        }

        // console.log('get eaItem: ', item);
        cnt--;

        if (item.value > 0n) {
          sum.totalAmt += item.value;

          switch (item.typeOfMotion) {
            case 'RefuelGas':
              sum.gas += item.value;
              break;
            case 'ExecAction':
              sum.transfer += item.value;
          }
        }

        arr.push(item);
      }

      setSum(sum);
      setRecords(arr);
    }

    getEvents(title);

  },[client, exRate, title, keepers, setSum]);

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
      field: 'typeOfMotion',
      headerName: 'TypeOfMotion',
      valueGetter: p => p.row.typeOfMotion,
      width: 218,
    },
    {
      field: 'amount',
      headerName: 'Amount (ETH)',
      valueGetter: p => bigIntToStrNum(p.row.value, 18),
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
          <b>Expense - {title} {' - (' + bigIntToStrNum((sum.totalAmt - sum.mint), 18) + ' ETH)'} </b>
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title" 
      >

        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <b>Expense - {title} { sum.totalAmt > sum.mint && ' - (' + bigIntToStrNum(sum.totalAmt - sum.mint, 18) + ' ETH)'} </b>
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