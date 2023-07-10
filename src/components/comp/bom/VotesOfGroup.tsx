import { useState } from 'react';

import { 
  TextField,
  Stack
} from '@mui/material';

import {
  useBookOfMembersVotesOfGroup
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type VotesOfGroupProps = ContractProps & {
  args: readonly [BigNumber]
}

export function VotesOfGroup({ addr, args }:VotesOfGroupProps ) {
  const [votes, setVotes] = useState('');

  const {isSuccess} = useBookOfMembersVotesOfGroup({
    address: addr,
    args: args,
    onSuccess(data) {
      setVotes(data.toNumber().toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={ votes } variant='outlined' label="VotesOfGroup" />
      )}
    </>
  )
}

