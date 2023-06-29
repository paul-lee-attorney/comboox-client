import { 
  Chip,
  Box,
} from '@mui/material';

import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'

import { dateParser, longDataParser, longSnParser } from '../../../scripts/toolsKit';
import { Share } from '../../../queries/bos';

const columns: GridColDef[] = [
  { 
    field: 'sn', 
    headerName: 'Sn',
    valueGetter: p => longSnParser(p.row.head.seqOfShare.toString()),
    width: 120,
  },
  { 
    field: 'class', 
    headerName: 'Class',
    valueGetter: p => p.row.head.class,
    renderCell: ({ value }) => (<Chip label={value} />),
    headerAlign:'center',
    align: 'center',
    width: 80,
  },
  { 
    field: 'issueDate', 
    headerName: 'IssueDate',
    valueGetter: p => dateParser(p.row.head.issueDate),
    headerAlign: 'center',
    align:'center',
    width: 180,
  },
  { 
    field: 'shareholder', 
    headerName: 'Shareholder',
    valueGetter: p => longSnParser(p.row.head.shareholder.toString()),
    headerAlign: 'center',
    align: 'center',
    width: 160,
  },
  { 
    field: 'par', 
    headerName: 'Par',
    valueGetter: p => longDataParser(p.row.body.par.toString()),
    headerAlign: 'right',
    align:'right',
    width: 330,
  },
  { 
    field: 'paid', 
    headerName: 'Paid',
    valueGetter: p => longDataParser(p.row.body.paid.toString()),
    headerAlign: 'right',
    align:'right',
    width: 330,
  },
  { 
    field: 'clean', 
    headerName: 'CleanPaid',
    valueGetter: p => longDataParser(p.row.body.cleanPaid.toString()),
    headerAlign: 'right',
    align:'right',
    width: 330,
  },
  { 
    field: 'state', 
    headerName: 'State',
    valueGetter: p => (p.row.body.state == 0 ? 'Normal' : 'Freezed'),
    renderCell: ({ value }) => (
      <Chip 
        label={ value } 
        variant='filled' 
        color={ value=='Normal' ? 'success' : 'warning' } 
      />
    ),
    headerAlign: 'center',
    align: 'center',
    width: 120,  
  },
];

interface SharesListProps {
  list: Share[],
  setShare: (share:Share)=>void,
  setOpen: (flag:boolean)=>void,
}

export function SharesList({ list, setShare, setOpen }:SharesListProps ) {

  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setShare({sn: p.row.sn, head: p.row.head, body: p.row.body});
    setOpen(true);
  }

  return (
    <Box sx={{width: '100%' }}>
      <DataGrid 
        initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        getRowId={row => row.sn} 
        rows={ list } 
        columns={ columns }
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      />      
    </Box>
  )
}



