import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, HexType } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, dateParser, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { ProfitsProps } from "./EthIncome";

export interface CbpIncomeProps extends ProfitsProps {
  exRate: bigint;
}

export type IncomeProps = {
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  typeOfIncome: string,
  amt: bigint,
  from: HexType,
}

export type IncomeSumProps = {
  totalAmt: bigint;
  royalty: bigint;
  mint: bigint;
  transfer: bigint;
  gas: bigint;
}

export const defaultSum: IncomeSumProps = {
  totalAmt: 0n,
  royalty: 0n,
  mint: 0n,
  transfer: 0n,
  gas: 0n,
}

export function CbpIncome({exRate, sum, setSum}:CbpIncomeProps ) {
  const { gk } = useComBooxContext();
  
  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ cbpRecords, setCbpRecords ] = useState<IncomeProps[]>([]);

  useEffect(()=>{

    const getCbpIncome = async () => {

      let sum:IncomeSumProps = defaultSum;

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

        let blkNo = cbpLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:IncomeProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: cbpLogs[cnt-1].transactionHash,
          typeOfIncome: 'Royalty',
          amt: cbpLogs[cnt-1].args.value ?? 0n,
          from: cbpLogs[cnt-1].args.from ?? AddrZero,
        }

        if (item.from == AddrOfTank) {
          item.typeOfIncome = 'Gas'
        } else if (item.from == AddrZero) {
          item.typeOfIncome = 'Mint';
        } else {
          let tran = await client.getTransaction({hash: item.transactionHash});
          
          console.log('tran: ', tran);

          if (tran.to == AddrOfRegCenter && tran.input.substring(10).toLowerCase() == '0xa9059cbb') {
            item.typeOfIncome = 'Transfer';
          }
        }
        
        cnt--;

        if (item.amt > 0n) {

          sum.totalAmt += item.amt;
          
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

      setCbpRecords(arr);
      setSum(sum);
    }

    getCbpIncome();

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
        <b>Revenue: ({ bigIntToStrNum(sum.royalty * 10000n / exRate, 18) } ETH)</b>
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title" 
      >

        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <b>CBP Income - { bigIntToStrNum(sum.totalAmt, 18) } CBP </b>
        </DialogTitle>

        <DialogContent>
          <Paper elevation={3} sx={{m:1, p:1 }} >

            <Stack direction='row' sx={{m:1, p:1}}>

              <Typography variant="h6" sx={{m:2}}>
                Royalty: { bigIntToStrNum(sum.royalty, 18) } CBP 
              </Typography>

              <Typography variant="h6" sx={{m:2}}>
                Transfer: { bigIntToStrNum(sum.transfer, 18) } CBP 
              </Typography>

              <Typography variant="h6" sx={{m:2}}>
                Gas: { bigIntToStrNum(sum.gas, 18) } CBP 
              </Typography>

              <Typography variant="h6" sx={{m:2}}>
                Mint: { bigIntToStrNum(sum.mint, 18) } CBP 
              </Typography>
            </Stack>

            <DataGrid 
              initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
              pageSizeOptions={[5, 10, 15, 20]} 
              rows={ cbpRecords } 
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