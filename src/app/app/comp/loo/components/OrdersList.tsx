import { IconButton, Paper, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { baseToDollar, dateParser, longDataParser, longSnParser } from "../../../common/toolsKit";
import { Order } from "../loo";
import { Dispatch, SetStateAction } from "react";
import { Refresh } from "@mui/icons-material";

interface OrdersListProps {
  name: string;
  list: readonly Order[];
  setOrder: Dispatch<SetStateAction<Order>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: ()=>void;
}

export function OrdersList({name, list, setOrder, setOpen, refresh}:OrdersListProps) {

  const colums: GridColDef[] = [

    {
      field: 'seq',
      headerName: 'SeqOfOrder',
      valueGetter: p => longSnParser(p.row.data.seq.toString()),
      headerAlign: 'center',
      align:'center',      
      width: 218,
    },
    { 
      field: 'expireDate', 
      headerName: 'ExpireDate',
      valueGetter: p => dateParser(p.row.node.expireDate.toString()),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    {
      field: 'issuer',
      headerName: name == "Offers" ? 'Seller' : 'Buyer',
      valueGetter: p => longSnParser(p.row.node.issuer.toString()),
      headerAlign: 'center',
      align:'center',      
      width: 218,
    },
    { 
      field: 'paid', 
      headerName: 'Paid',
      valueGetter: p => baseToDollar(p.row.node.paid.toString()),
      headerAlign: 'right',
      align:'right',
      width: 256,
    },
    { 
      field: 'price', 
      headerName: 'PriceOfPaid',
      valueGetter: p => baseToDollar(p.row.node.price.toString()),
      headerAlign: 'right',
      align:'right',
      width: 256,
    },
    { 
      field: 'value', 
      headerName: 'Value',
      valueGetter: p => baseToDollar((BigInt(p.row.node.price) * p.row.node.paid / 10000n).toString()),
      headerAlign: 'right',
      align:'right',
      width: 256,
    },    
    { 
      field: 'centPrice', 
      headerName: 'CentPrice (GWei)',
      valueGetter: p => baseToDollar((p.row.data.centPriceInWei / 10n ** 9n).toString()),
      headerAlign: 'right',
      align:'right',
      width: 256,
    },    
  ];

  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setOrder(p.row);
    setOpen(true);
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction={'row'} sx={{ alignItems:'center' }} >

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>{name} List</b>
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
  
      </Stack>

      <DataGrid 
        initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
        pageSizeOptions={[5, 10, 20, 50, 100]} 
        getRowId={ row => row.data.seq } 
        rows={ list }
        columns={ colums }
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      />

    </Paper>
  );
}