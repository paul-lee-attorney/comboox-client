import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useBookOfMembersVotesAtDate
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type VotesAtDateProps = ContractProps & {
  args: readonly [BigNumber, BigNumber]
}

export function VotesAtDate({ addr, args }:VotesAtDateProps ) {
  const [votes, setVotes] = useState('');

  const {isSuccess, refetch} = useBookOfMembersVotesAtDate({
    address: addr,
    args: args,
    onSuccess(data) {
      setVotes(data.toNumber().toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={votes} variant='outlined' label="VotesAtDate" />
      )}
    </>
  )
}

