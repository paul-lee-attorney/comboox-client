
import { 
  TableContainer, 
  Paper, 
  Toolbar, 
  Chip,
} from '@mui/material';

import Link from '../../../scripts/common/Link';

import { dateParser, longSnParser } from '../../../scripts/common/toolsKit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CopyLongStrSpan } from '../../common/utils/CopyLongStr';
import { Doc } from '../../../scripts/center/rc';

interface GetDocsListProps {
  list: readonly Doc[] | undefined,
}

export function GetDocsList({ list }:GetDocsListProps ) {
  
  const columns: GridColDef[] = [
    {
      field: 'seqOfDoc', 
      headerName: 'Seq',
      valueGetter: p => p.row.head.seqOfDoc,
      width: 80,
      renderCell: ( p ) => (
        <Link
          href={{
            pathname: '/center/pop/Payroll',
            query: {
              body: p.row.body,
              seq: p.row.head.seqOfDoc,
              creator: p.row.head.creator,
              createDate: p.row.head.createDate
            }
          }}
          as={ '/center/pop/Payroll' }
        >
          { parseInt(p.row.head.seqOfDoc).toString().padStart(6, '0') }
        </Link>
      )
    },
    {
      field: 'creator',
      headerName: 'Creator',
      valueGetter: p => longSnParser(parseInt(p.row.head.creator).toString()),
      width: 218,
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
      field: 'createDate',
      headerName: 'CreateDate',
      valueGetter: p => dateParser(parseInt(p.row.head.createDate).toString()),
      width: 218,
      headerAlign:'center',
      align: 'center',
    },
    {
      field: 'addr',
      headerName: 'Address',
      valueGetter: p => p.row.body,
      width: 218,
      headerAlign:'center',
      align: 'center',
      renderCell:({value})=>(
        <CopyLongStrSpan title='Addr' src={value} />
      )
    },
  ];
  
  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider'}} >

        <Toolbar sx={{ mr:5, textDecoration:'underline' }}>
          <h3>Payroll Of Projects</h3>
        </Toolbar>

      {list && (
        <DataGrid
          initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
          pageSizeOptions={[5, 10, 15, 20]} 
          rows={ list } 
          columns={ columns }
          getRowId={(row:Doc | undefined) => (row?.head.seqOfDoc.toString() ?? '0') } 
          disableRowSelectionOnClick
        />
      )}


    </TableContainer>
  )
}



