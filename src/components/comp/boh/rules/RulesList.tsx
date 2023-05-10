import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { 
  Table, 
  TableBody, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell, 
  Paper, 
  Toolbar 
} from '@mui/material';

import { readContract } from '@wagmi/core';

import {
  useShareholdersAgreementRules,
  shareholdersAgreementABI,
} from '../../../../generated';

import { ContractProps, HexType } from '../../../../interfaces';

type RuleType = {
  seqOfRule: number,
  qtyOfSubRule: number,
  seqOfSubRule: number,
  sn: HexType,
}

async function getRulesList(sha: HexType, rules: readonly BigNumber[]): Promise<RuleType[]> {

  let list: RuleType[] = [];
  let len: number = rules.length;
  let i=0;

  while(i < len) {
    let r:HexType = await readContract({
      address: sha,
      abi: shareholdersAgreementABI,
      functionName: 'getRule',
      args: [rules[i]],
    });

    list[i] = {
      seqOfRule: parseInt(r.substring(2, 6), 16),
      qtyOfSubRule: parseInt(r.substring(6, 8), 16),
      seqOfSubRule: parseInt(r.substring(8, 10), 16),
      sn: r,
    }

    i++;
  }

  return list;
}

export function RulesList({ addr }:ContractProps ) {

  const [rulesList, setRulesList] = useState<RuleType[]>();

  const {data, refetch} = useShareholdersAgreementRules({
    address: addr
  })

  useEffect(() => {
    if (data) {
      getRulesList(addr, data).then(v => setRulesList(v));
    }
  });

  return (
    <TableContainer component={Paper} >
      <Toolbar>
        Rules List
      </Toolbar>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell >SeqOfRule</TableCell>
            <TableCell align="right">QtyOfSubRule</TableCell>
            <TableCell align="right">SeqOfSubRule</TableCell>
            <TableCell align="right">SnOfRule</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rulesList && (
            rulesList.map((v) => (
            <TableRow
              key={v.seqOfRule}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {v.seqOfRule}
              </TableCell>
              <TableCell align="right">{v.qtyOfSubRule}</TableCell>
              <TableCell align="right">{v.seqOfSubRule}</TableCell>
              <TableCell align="right">{v.sn}</TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}



