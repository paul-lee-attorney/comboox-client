import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Paper, Toolbar, Box, TextField, Button } from '@mui/material';

import { useComBooxContext } from '../../../scripts/common/ComBooxContext';

import { centToDollar, dateParser, longDataParser, longSnParser, splitStrArr } from '../../../scripts/common/toolsKit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MemberShareClip, getEquityList, sortedMembersList } from '../../../scripts/comp/rom';
import { useRegisterOfMembersSortedMembersList } from '../../../generated';
import { booxMap } from '../../../scripts/common';
import { History } from '@mui/icons-material';


interface MembersEquityListProps{
  setAcct: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function MembersEquityList( {setAcct, setOpen}:MembersEquityListProps ) {
  const { boox } = useComBooxContext();
  const [equityList, setEquityList] = useState<MemberShareClip[]>();

  useEffect(()=>{
    if (boox) {
      sortedMembersList(boox[booxMap.ROM]).then(
        ls => {
          let numLs = ls.map(v => Number(v));
          getEquityList(boox[booxMap.ROM], numLs).then(
            list => setEquityList(list)
          )
        }
      )
    }
  }, [boox]);

  const columns: GridColDef[] = [
    {
      field: 'usrNo',
      headerName: 'UserNo',
      valueGetter: (p) => longSnParser(p.row.acct.toString()),
      width: 168,    
    },
    {
      field: 'sharesInHand',
      headerName: 'SharesInHand',
      valueGetter: (p) => (p.row.sharesInHand.map((v:string) => longSnParser(v))),
      width: 168,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({value}) => (
        <TextField 
          variant='outlined'
          fullWidth
          inputProps={{readOnly: true}}
          size="small"
          multiline
          rows={ 1 }
          sx={{
            m:1,
          }}
          value={ splitStrArr(value) }
        />
      )
    },
    {
      field: 'lastUpdate',
      headerName: 'LastUpdate',
      valueGetter: (p) => dateParser(p.row.clip.timestamp),
      width: 168,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'votingWeight',
      headerName: 'VotingWeight (%)',
      valueGetter: (p) => longDataParser(p.row.clip.votingWeight.toString()),
      width: 218,
      headerAlign: 'center',
      align: 'center',
    },    
    {
      field: 'par',
      headerName: 'Par (Dollar)',
      valueGetter: (p) => centToDollar(p.row.clip.par.toString()),
      width: 218,
      headerAlign: 'center',
      align: 'right',
    },
    {
      field: 'paid',
      headerName: 'Paid (Dollar)',
      valueGetter: (p) => centToDollar(p.row.clip.paid.toString()),
      width: 218,
      headerAlign: 'center',
      align: 'right',
    },
    {
      field: 'clean',
      headerName: 'CleanPaid (Dollar)',
      valueGetter: (p) => centToDollar(p.row.clip.cleanPaid.toString()),
      width: 218,
      headerAlign: 'center',
      align: 'right',
    },
    {
      field: 'invHistory',
      headerName: 'InvHistory',
      valueGetter: (p) => (parseInt(p.row.acct.toString())),
      width: 218,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({value}) => (
        <Button 
          variant='outlined'
          fullWidth
          size="small"
          sx={{
            m:1, height:40
          }}
          startIcon={
            <History />
          }
          onClick={ ()=>{
            setAcct(value);
            setOpen(true);
          }}
        >
          Inv History
        </Button>
      )
    },
  ]
  
  // const handleClick = (p) => {
  //   setAcct(p.row.acct);
  //   setOpen(true);
  // }

  return (
    <Paper elevation={3} sx={{ m:1, p:1, color:'divider', border:1 }} >
      <Box sx={{width: '100%', color: 'black' }} >
        <Toolbar sx={{ textDecoration:'underline' }}>
          <h3>Members List</h3>
        </Toolbar>

        {equityList && (
          <DataGrid
            initialState={{pagination:{paginationModel:{pageSize: 5}}}}
            pageSizeOptions={[5, 10, 15, 20]}
            getRowId={row => row.acct.toString()}
            rows={ equityList }
            columns={ columns }
            // onRowClick={ handleRowClick }
            disableRowSelectionOnClick
          />
        )}
      </Box>
    </Paper>
  )
}



