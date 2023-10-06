import { 
  Chip,
  Toolbar,
  Paper,
} from '@mui/material';

import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'

import { centToDollar, dateParser, longDataParser, longSnParser, ppToPercent, toPercent } from '../../../scripts/common/toolsKit';
import { Share } from '../../../scripts/comp/ros';

const columns: GridColDef[] = [
  { 
    field: 'seq', 
    headerName: 'Seq',
    valueGetter: p => longSnParser(p.row.head.seqOfShare.toString()),
    width: 120,
  },
  { 
    field: 'class', 
    headerName: 'Class',
    valueGetter: p => p.row.head.class,
    renderCell: ({ value }) => (
      <Chip 
        label={value} 
        color={ value % 7 == 1
          ? 'primary'
          : value % 7 == 2
            ? 'default'
              : value % 7 == 3
                ? 'secondary'
                  : value % 7 == 4
                    ? 'info' 
                      : value % 7 == 5
                        ? 'success'
                          : value % 7 == 6
                            ? 'warning'
                            : 'error'} 
      />),
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
    headerName: 'Par (Dollar)',
    valueGetter: p => centToDollar(p.row.body.par.toString()),
    headerAlign: 'right',
    align:'right',
    width: 218,
  },
  { 
    field: 'paid', 
    headerName: 'Paid (Dollar)',
    valueGetter: p => centToDollar(p.row.body.paid.toString()),
    headerAlign: 'right',
    align:'right',
    width: 288,
  },
  { 
    field: 'clean', 
    headerName: 'CleanPaid (Dollar)',
    valueGetter: p => centToDollar(p.row.body.cleanPaid.toString()),
    headerAlign: 'right',
    align:'right',
    width: 288,
  },
  { 
    field: 'votingWeight', 
    headerName: 'VotingWeight (%)',
    valueGetter: p => longDataParser(p.row.head.votingWeight.toString()),
    headerAlign: 'center',
    align:'center',
    width: 218,
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
    width: 128,  
  },
];

interface SharesListProps {
  list: readonly Share[],
  setShare: (share:Share)=>void,
  setOpen: (flag:boolean)=>void,
}

export function SharesList({ list, setShare, setOpen }:SharesListProps ) {

  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setShare({head: p.row.head, body: p.row.body});
    setOpen(true);
  }

  return (
    <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }} >

      <Toolbar sx={{ textDecoration:'underline' }} >
        <h3>Shares List</h3>
      </Toolbar>
      <DataGrid 
        initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        getRowId={row => row.head.seqOfShare} 
        rows={ list } 
        columns={ columns }
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      />   

    </Paper>
  )
}



