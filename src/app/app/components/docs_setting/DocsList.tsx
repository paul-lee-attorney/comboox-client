
import { Dispatch, SetStateAction } from 'react';

import { TableContainer, Paper, Chip, Typography} from '@mui/material';

import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

import { CopyLongStrSpan } from '../../common/CopyLongStr';

import { Doc, typesOfDoc } from '../../rc';
import { dateParser, longSnParser } from '../../common/toolsKit';
import { HexType } from '../../common';

interface DocsListProps {
  title: string;
  list: readonly Doc[];
  setTypeOfDoc: Dispatch<SetStateAction<number>>;
  setVersion: Dispatch<SetStateAction<number>>;
  setAddr: Dispatch<SetStateAction<HexType>>;
}

export function DocsList({ title, list, setTypeOfDoc, setVersion, setAddr }:DocsListProps ) {
  
  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      valueGetter: p =>  p.row.head.typeOfDoc.toString().padStart(2, '0'),
      width: 88,
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
      field: 'title',
      headerName: 'Title',
      valueGetter: p =>  typesOfDoc[p.row.head.typeOfDoc - 1],
      width: 168,
      headerAlign:'center',
      align: 'center',
    },    
    {
      field: 'version',
      headerName: 'Version',
      valueGetter: p =>  longSnParser( p.row.head.version.toString() ),
      width: 128,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='filled'
          label={ value }
        />
      ),
    },
    {
      field: 'seqOfDoc',
      headerName: 'Sn',
      valueGetter: p =>  longSnParser(p.row.head.seqOfDoc.toString()),
      width: 188,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='filled'
          label={ value }
        />
      ),
    },
    {
      field: 'author',
      headerName: 'Author',
      valueGetter: p =>  longSnParser(p.row.head.author.toString()),
      width: 188,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='filled'
          label={ value }
        />
      ),
    },
    {
      field: 'creator',
      headerName: 'Creator',
      valueGetter: p => title == 'Templates' 
          ? longSnParser(p.row.head.creator.toString())
          : p.row.head.creator.toString(16),
      width: 188,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='filled'
          label={ value }
        />
      ),
    },
    { 
      field: 'createDate', 
      headerName: 'CreateDate',
      valueGetter: p => dateParser(p.row.head.createDate.toString()),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    {
      field: 'body',
      headerName: 'Body',
      valueGetter: p => p.row.body,
      width: 218,
      headerAlign:'center',
      align: 'center',
      renderCell: ({value}) => (
        <CopyLongStrSpan title='Addr' src={value} />
      )
    },
  ];
  
  const handleRowClick = (p:GridRowParams)=>{
    setTypeOfDoc(p.row.head.typeOfDoc);
    setVersion(p.row.head.version);
    setAddr(p.row.body);
  }

  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider'}} >

      <Typography variant='h5' sx={{ mx:1, my:2, textDecoration:'underline' }} >
        <b>List Of {title}</b>
      </Typography>

      <DataGrid
        initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        rows={ list } 
        columns={ columns }
        getRowId={ (row:Doc) => (
          row.head.typeOfDoc.toString(16).padStart(8, '0') + 
          row.head.version.toString(16).padStart(8, '0') +
          row.head.seqOfDoc.toString(16).padStart(16, '0')
        ) } 
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      />

    </TableContainer>
  )
}



