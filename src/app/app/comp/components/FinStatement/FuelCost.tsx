import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrOfRegCenter, AddrOfTank, AddrZero, HexType } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, longDataParser, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { ProfitsProps } from "./Revenue";
import { rate } from "../../../fuel_tank/ft";

export type FuelCostProps = {
  blockNumber: bigint,
  transactionHash: HexType,
  amt: bigint,
  rate: bigint,
  value: bigint,
}


export function FuelCost({sum, setSum}:ProfitsProps) {
  const { gk } = useComBooxContext();
  
  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ records, setRecords ] = useState<FuelCostProps[]>([]);
  const [ cost, setCost ] = useState(0n);

  useEffect(()=>{
  
    const calValue = async (item: FuelCostProps): Promise<FuelCostProps> => {
      let rateOfEx = await rate(item.blockNumber);

      console.log('rateOfEx: ', rateOfEx);

      if (rateOfEx > 0) {
        item.rate = rateOfEx;
        item.value = item.amt * 10000n / rateOfEx;
      }

      return item;
    }

    const getEvents = async () => {

      let blk = await client.getBlockNumber();
      let sum = 0n;

      let tfLogs = await client.getLogs({
        address: AddrOfRegCenter,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed value)'),
        args: {
          from: gk,
          to: AddrOfTank,
        },
        fromBlock: blk > (8640n * 1095n) ? blk - (8640n * 1095n) : 1n,
      });

      let cnt = tfLogs.length;
      let arr: FuelCostProps[]=[];

      while (cnt > 0) {

        if (!tfLogs[cnt-1].args.value) {
          cnt--;
          continue;
        }

        let item:FuelCostProps = {
          blockNumber: tfLogs[cnt-1].blockNumber,
          transactionHash: tfLogs[cnt-1].transactionHash,
          amt: tfLogs[cnt-1].args.value ?? 0n,
          rate: 0n,
          value: 0n,
        };

        item = await calValue(item);

        console.log('get fuel cost item: ', item);
        cnt--;

        sum += item.value;
        arr.push(item);
      }

      setSum(sum);
      setCost(sum);
      setRecords(arr);
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
      field: 'amount',
      headerName: 'Amount (CBP)',
      valueGetter: p => bigIntToStrNum(p.row.amt, 18),
      width: 218,
    },
    {
      field: 'rate',
      headerName: 'Ex-Rate(CBP/ETH)',
      valueGetter: p => longDataParser(p.row.rate.toString()),
      width: 218,
    },
    {
      field: 'value',
      headerName: 'Value (ETH)',
      valueGetter: p => bigIntToStrNum(p.row.value, 18),
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
        <b>Fuel Cost: {'(' + bigIntToStrNum(cost, 18) + ' ETH)'} </b>
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title" 
      >

        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <b>Fuel Cost {' - (' + bigIntToStrNum(cost, 18) + ' ETH)'} </b>
        </DialogTitle>

        <DialogContent>

          <DataGrid 
            initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
            pageSizeOptions={[5, 10, 15, 20]} 
            rows={ records } 
            getRowId={(row:FuelCostProps) => row.blockNumber.toString() } 
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