import { Dispatch, SetStateAction, useState, } from "react";
import { IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { MaxPrice } from "../../../common";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { baseToDollar, dateParser, defFormResults, FormResults, longSnParser, onlyInt } from "../../../common/toolsKit";
import { Deal, DealProps, defaultDeal } from "../loo";
import { Refresh } from "@mui/icons-material";

export interface DealsListProps {
  list: readonly DealProps[];
  qty: string;
  amt: string;
  left: number;
  setLeft: Dispatch<SetStateAction<number>>;
  right: number;
  setRight: Dispatch<SetStateAction<number>>;
  setDeal: Dispatch<SetStateAction<DealProps | undefined>>;
  setShow: Dispatch<SetStateAction<boolean>>;
  refresh: ()=>void;
}

export function DealsList({list, qty, amt, left, setLeft, right, setRight, refresh, setDeal, setShow}: DealsListProps) {

  const columns: GridColDef[] = [
    {
      field: 'blockNumber',
      headerName: 'BlockNumber',
      valueGetter: p => longSnParser(p.row.blockNumber.toString()),
      headerAlign: 'center',
      align:'center',      
      width: 218,
    },
    {
      field: 'timestamp',
      headerName: 'Date',
      valueGetter: p => dateParser(p.row.timestamp.toString()),
      headerAlign: 'center',
      align:'center',      
      width: 180,
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      valueGetter: p => p.row.buyer,
      headerAlign: 'center',
      align:'center',      
      width: 218,
    },
    {
      field: 'paid',
      headerName: 'Paid',
      valueGetter: p => baseToDollar(p.row.paid.toString()),
      headerAlign: 'right',
      align:'right',      
      width: 256,
    },
    {
      field: 'price',
      headerName: 'PriceOfPaid',
      valueGetter: p => baseToDollar(p.row.price.toString()),
      headerAlign: 'right',
      align:'right',      
      width: 256,
    },
    {
      field: 'value',
      headerName: 'Value',
      valueGetter: p => baseToDollar((BigInt(p.row.paid) * BigInt(p.row.price) / 10000n).toString()),
      headerAlign: 'right',
      align:'right',      
      width: 256,
    },
    { 
      field: 'consideration', 
      headerName: 'Value (ETH)',
      valueGetter: p => baseToDollar((p.row.consideration / 10n ** 14n).toString()),
      headerAlign: 'right',
      align:'right',
      width: 256,
    },    
  ];

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setDeal(p.row);
    setShow(true);
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction={'row'} sx={{ alignItems:'center' }} >

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Deals List</b>  
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          (Paid: { qty} / Value: { amt })
        </Typography>

        <Tooltip 
          title='Refresh List' 
          placement='right' 
          arrow 
        >
          <IconButton 
            size='small'
            sx={{ mx:5 }}
            onClick={()=>refresh()}
            color="primary"
          >
            <Refresh />
          </IconButton>
        </Tooltip>

        <TextField 
          variant='outlined'
          size="small"
          label='StartBlock'
          error={ valid['StartBlock']?.error }
          helperText={ valid['StartBlock']?.helpTx ?? ' ' }
          sx={{
            m:1, ml:20,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyInt('StartBlock', input, MaxPrice, setValid);
            setLeft(Number(input));
          }}

          value={ left.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='EndBlock'
          error={ valid['EndBlock']?.error }
          helperText={ valid['EndBlock']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyInt('EndBlock', input, MaxPrice, setValid);
            setRight(Number(input));
          }}

          value={ right.toString() } 
        />

      </Stack>

      <DataGrid 
        initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        rows={ list } 
        getRowId={(row:DealProps) => (row.seqOfDeal)} 
        columns={ columns }
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
      />
    </Paper>
  );
} 