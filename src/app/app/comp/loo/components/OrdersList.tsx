import { IconButton, Paper, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { baseToDollar, dateParser, longDataParser, longSnParser } from "../../../common/toolsKit";
import { OrderWrap } from "../loo";
import { Dispatch, SetStateAction } from "react";
import { Refresh } from "@mui/icons-material";

interface OrdersListProps {
  list: readonly OrderWrap[];
  setOrder: Dispatch<SetStateAction<OrderWrap>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: ()=>void;
}

export function OrdersList({list, setOrder, setOpen, refresh}:OrdersListProps) {

  const columns: GridColDef[] = [

    {
      field: 'seq',
      headerName: 'SeqOfOrder',
      valueGetter: p => longSnParser(p.row.seq.toString()),
      headerAlign: 'center',
      align:'center',      
      width: 218,
    },
    {
      field: 'seqOfShare',
      headerName: 'SeqOfShare',
      valueGetter: p => longSnParser(p.row.node.seqOfShare.toString()),
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
      width: 330,
    },
    { 
      field: 'price', 
      headerName: 'Price',
      valueGetter: p => baseToDollar(p.row.node.price.toString()),
      headerAlign: 'right',
      align:'right',
      width: 330,
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
      field: 'votingWeight', 
      headerName: 'VotingWeight (%)',
      valueGetter: p => longDataParser(p.row.node.votingWeight.toString()),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    { 
      field: 'distrWeight', 
      headerName: 'DistributionWeight (%)',
      valueGetter: p => longDataParser(p.row.node.distrWeight.toString()),
      headerAlign: 'center',
      align:'center',
      width: 180,
    }

  ];

  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setOrder(p.row);
    setOpen(true);
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction={'row'} sx={{ alignItems:'center' }} >

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Orders List</b>
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
        getRowId={ row => row.seq } 
        rows={ list } 
        columns={ columns }
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      />    

    </Paper>
  );
}