
import { Dispatch, SetStateAction } from 'react';

import { TableContainer, Paper, Chip, Typography} from '@mui/material';

import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

import { CopyLongStrSpan } from '../../common/CopyLongStr';

import { DocItem, typesOfDoc } from '../../rc';
import { dateParser, longSnParser } from '../../common/toolsKit';
import { HexType } from '../../common';

interface DocsListProps {
  title: string;
  list: DocItem[];
  setTypeOfDoc: Dispatch<SetStateAction<number>>;
  setVersion: Dispatch<SetStateAction<number>>;
  setAddr: Dispatch<SetStateAction<HexType>>;
}

export function DocsList({ title, list, setTypeOfDoc, setVersion, setAddr }:DocsListProps ) {
  
  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      valueGetter: p =>  p.row.doc.head.typeOfDoc.toString().padStart(2, '0'),
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
      valueGetter: p =>  typesOfDoc[p.row.doc.head.typeOfDoc - 1],
      width: 168,
      headerAlign:'center',
      align: 'center',
    },    
    {
      field: 'version',
      headerName: 'Version',
      valueGetter: p =>  longSnParser( p.row.doc.head.version.toString() ),
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
      valueGetter: p =>  longSnParser(p.row.doc.head.seqOfDoc.toString()),
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
      valueGetter: p =>  longSnParser(p.row.doc.head.author.toString()),
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
          ? longSnParser(p.row.doc.head.creator.toString())
          : p.row.doc.head.creator.toString(16),
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
      valueGetter: p => dateParser(p.row.doc.head.createDate.toString()),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    {
      field: 'body',
      headerName: 'Body',
      valueGetter: p => p.row.doc.body,
      width: 218,
      headerAlign:'center',
      align: 'center',
      renderCell: ({value}) => (
        <CopyLongStrSpan title='Addr' src={value} />
      )
    },
  ];
  
  const handleRowClick = (p:GridRowParams)=>{
    setTypeOfDoc(p.row.doc.head.typeOfDoc);
    setVersion(p.row.doc.head.version);
    setAddr(p.row.doc.body);
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
        getRowId={ (row:DocItem) => (row.seqOfList) } 
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      />

    </TableContainer>
  )
}



