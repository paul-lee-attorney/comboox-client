import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useRegisterOfMembersBasedOnPar
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function BasedOnPar({ addr }:ContractProps ) {
  const [basedOnPar, setBasedOnPar] = useState('');

  const {isSuccess, refetch} = useRegisterOfMembersBasedOnPar({
    address: addr,
    onSuccess(data) {
      setBasedOnPar(data ? 'On-Par' : 'On-Paid');
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={basedOnPar} variant='outlined' label="VoteBase" />
      )}
    </>
  )
}

