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

import { dateParser } from '../../../scripts/toolsKit';
import dayjs from 'dayjs';

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

type ShareClipType = {
  timestamp: number,
  paid: BigNumber,
  par: BigNumber,
  cleanPaid: BigNumber,
}

type MemberShareClipType = {
  acct: string,
  date: string,
  paid: string,
  par: string,
  clean: string,
}

async function getEquityList(rom: HexType, members: readonly BigNumber[]): Promise<MemberShareClipType[]> {

  let list: MemberShareClipType[] = [];
  let len: number = members.length;
  let i=0;

  while(i < len) {

    let item: ShareClipType = await readContract({
      address: rom,
      abi: registerOfMembersABI,
      functionName: 'sharesClipOfMember',
      args: [members[i]],
    });

    list[i] = {
      acct: members[i].toHexString().substring(2).padStart(10,'0'),
      date: dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      paid: item.paid.toString(),
      par: item.par.toString(),
      clean: item.cleanPaid.toString()
    };

    i++;

  }

  return list;
}

export function MembersEquityList({ addr }:ContractProps ) {
  const {boox} = useComBooxContext();
  const [equityList, setEquityList] = useState<MemberShareClipType[]>();

  const {data, refetch} = useRegisterOfMembersMembersList({
    address: addr
  })

  useEffect(() => {
    if (data) {
      getEquityList(boox[8], data).then(list => setEquityList(list));
    }
  }, [data, boox]);

  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider' }}>
      <Toolbar>
        <h3>Members List</h3>
      </Toolbar>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell >User No. </TableCell>
            <TableCell align="right">Update Date</TableCell>
            <TableCell align="right">Subscribed Contribution</TableCell>
            <TableCell align="right">Paid-In Contribution</TableCell>
            <TableCell align="right">Clean Paid Contribution</TableCell>
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
      </Table>
    </TableContainer>
  )
}



