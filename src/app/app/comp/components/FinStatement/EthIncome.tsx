import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfTank, AddrZero } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, dateParser, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { defaultSum, IncomeProps, IncomeSumProps } from "./CbpIncome";

export interface ProfitsProps {
  sum: IncomeSumProps;
  setSum: Dispatch<SetStateAction<IncomeSumProps>>;
}

export function EthIncome({sum, setSum}:ProfitsProps ) {
  const { gk } = useComBooxContext();
  
  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ ethRecords, setEthRecords ] = useState<IncomeProps[]>([]);

  useEffect(()=>{

    const getEthIncome = async ()=>{

      let ethLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event ReceivedCash(address indexed from, uint indexed amt)'),
        fromBlock: 1n,
      });
    
      let cnt = ethLogs.length;
      let arr: IncomeProps[] = [];
      let sum: IncomeSumProps = defaultSum;
    
      while (cnt > 0) {
        
        let blkNo = ethLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});
    
        let item:IncomeProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: ethLogs[cnt-1].transactionHash,
          typeOfIncome: 'Transfer',
          amt: ethLogs[cnt-1].args.amt ?? 0n,
          from: ethLogs[cnt-1].args.from ?? AddrZero,
        }
    
        cnt--;
    
        if (item.from == AddrOfTank) {
          item.typeOfIncome = 'Gas';
        }

        if (item.amt > 0n) {
    
          sum.totalAmt += item.amt;
  
          switch (item.typeOfIncome) {
            case 'Transfer':
              sum.transfer += item.amt;
              break;
            default:
              sum.gas += item.amt;
          }
          
          if (arr.length > 0 ) {

            let last:IncomeProps = arr[arr.length-1];
    
            if (last.blockNumber == item.blockNumber &&
                last.transactionHash == item.transactionHash &&
                last.from == item.from &&
                last.typeOfIncome == item.typeOfIncome) 
            {
              arr[arr.length-1].amt += item.amt;
              continue;
            }
          }
    
          arr.push(item);
        }
      }

      setEthRecords(arr);
      setSum(sum);
    }

    getEthIncome();
  });


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
        <b>Eth Income: ({ bigIntToStrNum(sum.totalAmt, 18) } ETH)</b>
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title" 
      >

        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <b>Eth Income - { bigIntToStrNum(sum.totalAmt, 18) } ETH </b>
        </DialogTitle>

        <DialogContent>
          <Paper elevation={3} sx={{m:1, p:1 }} >

            <DataGrid 
              initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
              pageSizeOptions={[5, 10, 15, 20]} 
              rows={ ethRecords } 
              getRowId={(row:IncomeProps) => (row.blockNumber.toString() + row.transactionHash + row.typeOfIncome + row.from) } 
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