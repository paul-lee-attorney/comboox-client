
import { 
  TableContainer, 
  Paper, 
  Toolbar, 
  Chip,
  Stack
} from '@mui/material';

import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { Deal } from '../../../../queries/ia';
import { dateParser, longDataParser, longSnParser } from '../../../../scripts/toolsKit';
import { Dispatch, SetStateAction } from 'react';
import { HexType } from '../../../../interfaces';

interface DealsListProps {
  ia: HexType;
  isFinalized: boolean;
  list: Deal[];
  setDeal: Dispatch<SetStateAction<Deal>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const dealState = ['Drafting', 'Locked', 'Cleared', 'Closed', 'Terminated'];

export function DealsList({ ia, isFinalized, list, setDeal, setOpen }:DealsListProps ) {
  
  const columns: GridColDef[] = [
    {
      field: 'seqOfDeal', 
      headerName: 'Seq',
      valueGetter: p => p.row.head.seqOfDeal.toString(),
      width: 58,
      renderCell: ({ value }) => (
        <Chip
          variant="outlined"
          color='primary'
          // sx={{ minWidth: 58 }}
          label={ value } 
        />
      )
    },
    {
      field: 'seqOfShare',
      headerName: 'SeqOfShare',
      valueGetter: p => longSnParser(p.row.head.seqOfShare.toString()),
      width: 128,
      headerAlign:'right',
      align: 'right',
    },
    {
      field: 'seller',
      headerName: 'Seller',
      valueGetter: p => longSnParser(p.row.head.seller.toString()),
      width: 218,
      headerAlign:'right',
      align: 'right',
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      valueGetter: p => longSnParser(p.row.body.buyer.toString()),
      width: 218,
      headerAlign:'right',
      align: 'right',
    },
    {
      field: 'paid',
      headerName: 'Paid',
      valueGetter: p => longDataParser(p.row.body.paid.toString()),
      width: 218,
      headerAlign:'right',
      align: 'right',
    },
    {
      field: 'par',
      headerName: 'Par',
      valueGetter: p => longDataParser(p.row.body.par.toString()),
      width: 218,
      headerAlign:'right',
      align: 'right',
    },
    {
      field: 'priceOfPaid',
      headerName: 'Price',
      valueGetter: p => longDataParser(p.row.head.priceOfPaid.toString()),
      width: 218,
      headerAlign:'right',
      align: 'right',
    },
    {
      field: 'state',
      headerName: 'State',
      valueGetter: p => p.row.body.state,
      width: 128,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='outlined'
          label={ dealState[value] } 
          sx={{width: 128}}
          color={
            value == 3
            ? 'success'
            : value == 4
              ? 'error'
              : value == 2
                ? 'info'
                : value == 1
                    ? 'primary'
                    : 'default'
          }
        />
      )
    },
  ];
  
  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setDeal({head: p.row.head, body: p.row.body, hashLock: p.row.hashLock});
    setOpen(true);
  }

  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider'}} >

      <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >        

        <Toolbar sx={{ textDecoration:'underline' }}>
          <h4>Deals List</h4>
        </Toolbar>

        {/* <SetTypeOfIa ia={ia} isFinalized={isFinalized} /> */}

      </Stack>

      {list && (
        <DataGrid
          initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
          pageSizeOptions={[5, 10, 15, 20]} 
          rows={ list } 
          columns={ columns }
          getRowId={(row:Deal | undefined) => (row?.head.seqOfDeal ?? '0') } 
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
        />
      )}

    </TableContainer>
  )
}



