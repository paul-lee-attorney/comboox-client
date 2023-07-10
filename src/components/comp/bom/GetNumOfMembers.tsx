import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useBookOfMembersGetNumOfMembers
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function GetNumOfMembers({ addr }:ContractProps ) {
  const [numOfMembers, setNumOfMembers] = useState('');

  const {isSuccess} = useBookOfMembersGetNumOfMembers({
    address: addr,
    onSuccess(data) {
      setNumOfMembers(data.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={numOfMembers} variant='outlined' label="QtyOfMembers" />
      )}
    </>
  )
}

