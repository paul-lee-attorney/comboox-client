import { useEffect, useState } from 'react';
import { Paper, Toolbar, Box } from '@mui/material';

import { useComBooxContext } from '../../../scripts/ComBooxContext';

import { dateParser, longSnParser } from '../../../scripts/toolsKit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MemberShareClip, getEquityList, getMembersList } from '../../../queries/rom';
import { useRegisterOfMembersMembersList } from '../../../generated';

const columns: GridColDef[] = [
  {
    field: 'usrNo',
    headerName: 'UserNo',
    valueGetter: (p) => longSnParser(p.row.acct.toString()),
    width: 218,    
  },
  {
    field: 'lastUpdate',
    headerName: 'LastUpdate',
    valueGetter: (p) => dateParser(p.row.clip.timestamp),
    width: 218,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'par',
    headerName: 'Par',
    valueGetter: (p) => (new Intl.NumberFormat().format(p.row.clip.par.toString())),
    width: 330,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'paid',
    headerName: 'Paid',
    valueGetter: (p) => (new Intl.NumberFormat().format(p.row.clip.paid.toString())),
    width: 330,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'clean',
    headerName: 'CleanPaid',
    valueGetter: (p) => (new Intl.NumberFormat().format(p.row.clip.cleanPaid.toString())),
    width: 330,
    headerAlign: 'right',
    align: 'right',
  },
]

export function MembersEquityList() {
  const { boox } = useComBooxContext();
  const [equityList, setEquityList] = useState<MemberShareClip[]>();

  const {
    refetch: getMembersList
  } = useRegisterOfMembersMembersList({
    address: boox ? boox[4] : undefined,
    onSuccess(ls){
      if (boox)
        getEquityList(boox[4], ls).then(
          list => setEquityList(list)
        )
    }
  })


  // useEffect(()=>{
  //   if (boox) {
  //     getMembersList(boox[4]).then(
  //       list => {
  //         getEquityList(boox[4], list).then(
  //           ls => {
  //             setEquityList(ls);
  //           }
  //         )
  //       }
  //     )
  //   }
  // });

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
          />
        )}
      </Box>
    </Paper>
  )
}



