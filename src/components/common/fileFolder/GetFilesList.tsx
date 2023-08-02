
import { 
  TableContainer, 
  Paper, 
  Toolbar, 
  Chip
} from '@mui/material';

import Link from '../../../scripts/Link';

import { dateParser, longSnParser } from '../../../scripts/toolsKit';
import { InfoOfFile } from '../../../queries/filesFolder';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CopyLongStrSpan } from '../utils/CopyLongStr';

interface GetFilesListProps {
  list: InfoOfFile[],
  title: string,
  pathName: string,
  pathAs: string,
}

const labState = ['Created', 'Circulated', 'Established', 
'Proposed', 'Approved', 'Rejected', 'Closed', 'Terminated'];


export function GetFilesList({ list, title, pathName, pathAs }:GetFilesListProps ) {

  
  const columns: GridColDef[] = [
    {
      field: 'sn', 
      headerName: 'Sn',
      valueGetter: p => p.row.sn.substring(6, 26),
      width: 218,
      renderCell: ( p ) => (
        <Link
          href={{
            pathname: pathName,
            query: {
              addr: p.row.addr,
              snOfDoc: p.row.sn.substring(6, 26),
            }
          }}
          as={ pathAs }
        >
          { p.row.sn.substring(6, 26) }
        </Link>
      )
    },
    {
      field: 'creator',
      headerName: 'Creator',
      valueGetter: p => longSnParser(parseInt(`0x${p.row.sn.substring(26, 36)}`).toString()),
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
      valueGetter: p => dateParser(parseInt(p.row.sn.substring(36, 48), 16)),
      width: 218,
      headerAlign:'center',
      align: 'center',
    },
    {
      field: 'circulateDate',
      headerName: 'CirculateDate',
      valueGetter: p => dateParser(p.row.head.circulateDate),
      width: 218,
      headerAlign:'center',
      align: 'center',
    },
    {
      field: 'closingDeadline',
      headerName: 'ClosingDeadline',
      valueGetter: p => dateParser(p.row.head.circulateDate + (p.row.head.closingDays * 86400)),
      width: 218,
      headerAlign:'center',
      align: 'center',
    },
    {
      field: 'addr',
      headerName: 'Address',
      valueGetter: p => p.row.addr,
      width: 218,
      headerAlign:'center',
      align: 'center',
      renderCell:({value})=>(
        <CopyLongStrSpan title='Addr' size='body1' src={value} />
      )
    },
    {
      field: 'state',
      headerName: 'State',
      valueGetter: p => p.row.head.state,
      width: 218,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='filled'
          label={ 
            labState[value - 1] == 'Closed' && title == 'SHA List' 
              ? 'In Force' 
              : labState[value - 1]
          } 
          sx={{width: 128}}
          color={
            value == 7
            ? 'success'
            : value == 6
              ? 'error'
              : value == 5
                ? 'info'
                : value == 4
                  ? 'secondary'
                  : value == 3
                    ? 'primary'
                    : value == 2
                      ? 'warning'
                      : 'default'
          }
        />
      )
    },
  ];
  

  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
      <Toolbar sx={{ textDecoration:'underline' }}>
        <h3>{ title }</h3>
      </Toolbar>

      {list && (
        <DataGrid
          initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
          pageSizeOptions={[5, 10, 15, 20]} 
          rows={ list } 
          columns={ columns }
          getRowId={(row:InfoOfFile | undefined) => (row?.sn.substring(6, 26) ?? '0') } 
          disableRowSelectionOnClick
        />
      )}


    </TableContainer>
  )
}



