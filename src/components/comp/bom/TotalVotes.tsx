import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useBookOfMembersTotalVotes
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function TotalVotes({ addr }:ContractProps ) {
  const [totalVotes, setTotalVotes] = useState('');

  const {isSuccess, refetch} = useBookOfMembersTotalVotes({
    address: addr,
    onSuccess(data) {
      setTotalVotes(data.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={totalVotes} variant='outlined' label="TotalVotes" />
      )}
    </>
  )
}

