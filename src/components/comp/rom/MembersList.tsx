import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, Toolbar, Box } from '@mui/material';

import { readContract } from '@wagmi/core';

import {
  registerOfMembersABI,
  useRegisterOfMembersMembersList,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { useComBooxContext } from '../../../scripts/ComBooxContext';

import { dateParser, longSnParser } from '../../../scripts/toolsKit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MemberShareClip, ShareClip, getEquityList, getMembersList } from '../../../queries/rom';
import { DataList } from '../../common/DataList';

export function MembersList({ addr }:ContractProps ) {
  const [membersList, setMembersList] = useState<string[]>();

  const {data, refetch} = useRegisterOfMembersMembersList({
    address: addr,
  })

  useEffect(()=>{
    if (data) {
      let list: string[] = [];
      data.map(v => list.push(v.toString()));
      setMembersList(list);
    }
  }, [data]);

  return (
    <>
      {membersList && (<DataList isOrdered={true} data={membersList} />)}
    </>
  )
}


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
    width: 330,
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

  useEffect(()=>{
    if (boox) {
      getMembersList(boox[8]).then(
        list => {
          getEquityList(boox[8], list).then(
            ls => {
              setEquityList(ls);
            }
          )
        }
      )
    }
  });

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
            getRowId={row => row.acct}
            rows={ equityList }
            columns={ columns }
          />
        )}
      </Box>
    </Paper>
  )
}



