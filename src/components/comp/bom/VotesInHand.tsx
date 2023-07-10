import { useState } from 'react';

import { 
  TextField,
  Stack
} from '@mui/material';

import {
  useBookOfMembersVotesInHand
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type VotesInHandProps = ContractProps & {
  args: readonly [BigNumber]
}

export function VotesInHand({ addr, args }:VotesInHandProps ) {
  const [votes, setVotes] = useState('');

  const {isSuccess} = useBookOfMembersVotesInHand({
    address: addr,
    args: args,
    onSuccess(data) {
      setVotes(data.toNumber().toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={ votes } variant='outlined' label="VotesInHand" />
      )}
    </>
  )
}

