
import { 
  TableContainer, 
  Paper, 
  Toolbar, 
  Chip,
} from '@mui/material';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Member } from '../../../read/lop';
import { centToDollar, longDataParser, longSnParser } from '../../../../../read/toolsKit';
import { GetTeamsListProps } from '../../Manager/read/GetTeamsList';

export function GetMembersList({setSeq, list }:GetTeamsListProps ) {
  
  const handleRowSelect = (ids: GridRowSelectionModel) => setSeq(Number(ids[0]));

  const columns: GridColDef[] = [
    {
      field: 'seqOfTeam', 
      headerName: 'SeqOfTeam',
      valueGetter: p => longSnParser(p.row.seqOfTeam.toString()),
      width: 80,
    },
    {
      field: 'userNo',
      headerName: 'UserNo',
      valueGetter: p => longSnParser(p.row.userNo.toString()),
      width: 128,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='outlined'
          label={ value }
        />
      ),
    },
    { 
      field: 'rate', 
      headerName: 'Rate',
      valueGetter: p => centToDollar(p.row.rate.toString()),
      headerAlign: 'right',
      align:'right',
      width: 128,
    },
    { 
      field: 'estimated', 
      headerName: 'Estimated',
      valueGetter: p => longDataParser(p.row.estimated.toString()),
      headerAlign: 'right',
      align:'right',
      width: 128,
    },
    { 
      field: 'applied', 
      headerName: 'Applied',
      valueGetter: p => longDataParser(p.row.applied.toString()),
      headerAlign: 'right',
      align:'right',
      width: 128,
    },
    { 
      field: 'budgetAmt', 
      headerName: 'BudgetAmt',
      valueGetter: p => centToDollar(p.row.budgetAmt.toString()),
      headerAlign: 'right',
      align:'right',
      width: 128,
    },
    { 
      field: 'pendingAmt', 
      headerName: 'PendingAmt',
      valueGetter: p => centToDollar(p.row.pendingAmt.toString()),
      headerAlign: 'right',
      align:'right',
      width: 128,
    },
    { 
      field: 'receivableAmt', 
      headerName: 'ReceivableAmt',
      valueGetter: p => centToDollar(p.row.receivableAmt.toString()),
      headerAlign: 'right',
      align:'right',
      width: 128,
    },
    { 
      field: 'paidAmt', 
      headerName: 'PaidAmt',
      valueGetter: p => centToDollar(p.row.paidAmt.toString()),
      headerAlign: 'right',
      align:'right',
      width: 128,
    },
    {
      field: 'state',
      headerName: 'State',
      valueGetter: p => p.row.state,
      width: 128,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='filled'
          label={ 
            value == 1
            ? 'Enrolled'
            : value == 2
              ? 'Applied'
              : value == 3
                ? 'Verified'
                : 'Pending'
          } 
          color={
            value == 1
            ? 'primary'
            : value == 2
              ? 'success'
              : value == 3
                ? 'warning'
                : 'default'
          }
        />
      )
    }
  ];
  
  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider'}} >

        <Toolbar sx={{ mr:5, textDecoration:'underline' }}>
          <b>Payroll of Members</b>
        </Toolbar>

      {list && (
        <DataGrid
          initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
          pageSizeOptions={[5, 10, 15, 20]} 
          rows={ list } 
          columns={ columns }
          getRowId={(row:Member | undefined) => (row?.userNo.toString() ?? '0') } 
          onRowSelectionModelChange={ handleRowSelect }
        />
      )}

    </TableContainer>
  )
}



