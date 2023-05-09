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


export function MembersList({ addr }:ContractProps ) {
  const [membersList, setMembersList] = useState<string[]>();

  const {isSuccess, refetch} = useRegisterOfMembersMembersList({
    address: addr,
    onSuccess(data) {
      let temp:string[] = [];
      data.map(v => temp.push(v.toNumber().toString()));

      setMembersList(temp);
    }
  })

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

    let strDate = item.timestamp * 1000;

    let date1 = new Date(strDate);
    let date2 = date1.toLocaleDateString().replace(/\//g, "-") + ' ' + date1.toTimeString().substring(0,8);

    list[i] = {
      acct: members[i].toNumber().toString(),
      date: date2,
      paid: item.paid.toNumber().toString(),
      par: item.par.toNumber().toString(),
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
  });

  return (
    <TableContainer component={Paper}>
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
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}



