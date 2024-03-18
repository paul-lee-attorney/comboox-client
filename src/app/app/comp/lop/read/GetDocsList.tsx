
import { TableContainer, Paper, Toolbar, Chip, Typography } from '@mui/material';

import Link from 'next/link';

import { dateParser, longSnParser } from '../../../read/toolsKit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CopyLongStrSpan } from '../../../read/CopyLongStr';
import { Doc } from '../../../center/read/rc';

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
            pathname: '/app/comp/lop/payroll',
            query: {
              body: p.row.body,
              seq: p.row.head.seqOfDoc,
              creator: p.row.head.creator,
              createDate: p.row.head.createDate
            }
          }}
          // as={ '/comp/pop/Payroll' }
        >
          { parseInt(p.row.head.seqOfDoc).toString().padStart(6, '0') }
        </Link>
      )
    },
    {
      field: 'creator',
      headerName: 'Creator',
      valueGetter: p => BigInt(p.row.head.creator).toString(16),
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

      <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
        <b>Payroll Of Projects</b>
      </Typography>

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



