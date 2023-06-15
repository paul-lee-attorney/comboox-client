import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, Toolbar } from '@mui/material';

import { readContract } from '@wagmi/core';

import { DataList } from '../../';

import {
  registerOfMembersABI,
  useRegisterOfMembersMembersList,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { useComBooxContext } from '../../../scripts/ComBooxContext';

import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import { Send } from '@mui/icons-material';
import { dateParser, longSnParser, userNoParser } from '../../../scripts/toolsKit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import internal from 'stream';

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

type ShareClip = {
  timestamp: number,
  paid: BigNumber,
  par: BigNumber,
  cleanPaid: BigNumber,
}

type MemberShareClip = {
  acct: BigNumber,
  clip: ShareClip,
}

async function getEquityList(rom: HexType, members: readonly BigNumber[]): Promise<MemberShareClip[]> {

  let list: MemberShareClip[] = [];
  let len: number = members.length;
  let i=0;

  while(i < len) {

    let item: ShareClip = await readContract({
      address: rom,
      abi: registerOfMembersABI,
      functionName: 'sharesClipOfMember',
      args: [members[i]],
    });

    list[i] = {
      acct: members[i],
      clip: item,
    };

    i++;

  }

  return list;
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


export function MembersEquityList({ addr }:ContractProps ) {
  const [equityList, setEquityList] = useState<MemberShareClip[]>();

  const [ loading, setLoading ] = useState<boolean>();

  useRegisterOfMembersMembersList({
    address: addr,
    onSuccess(data) {
      setLoading(true);
      getEquityList(addr, data).then(
        ls => {
          setEquityList(ls);
          setLoading(false);
        }
      )
    }
  })

  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }}>
      <Toolbar>
        <h3>Members List</h3>

        {loading && (
          <LoadingButton 
            loading={ loading } 
            loadingPosition='end' 
            endIcon={<Send/>} 
            sx={{p:1, m:1, ml:5}} 
          >
            <span>Loading</span>
          </LoadingButton>
        )}

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



      {/* <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell >User No. </TableCell>
            <TableCell align="right">Update Date</TableCell>
            <TableCell align="right">Par</TableCell>
            <TableCell align="right">Paid</TableCell>
            <TableCell align="right">Clean Paid</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equityList && (
            equityList.map((v) => (
            <TableRow
              key={v.acct}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {v.acct}
              </TableCell>
              <TableCell align="right">{v.date}</TableCell>
              <TableCell align="right">{v.par}</TableCell>
              <TableCell align="right">{v.paid}</TableCell>
              <TableCell align="right">{v.clean}</TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table> */}
    </TableContainer>
  )
}



