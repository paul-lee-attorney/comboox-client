import { useEffect, useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useRegisterOfMembersBasedOnPar
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function BasedOnPar({ addr }:ContractProps ) {
  const [basedOnPar, setBasedOnPar] = useState<string>();

  const {data, refetch} = useRegisterOfMembersBasedOnPar({
    address: addr,
  })

  useEffect(() => {
    if (data)
      setBasedOnPar(data ? 'On-Par' : 'On-Paid');
  }, [data]);

  return (
    <>
      {basedOnPar && (
        <TextField value={basedOnPar} variant='outlined' label="VoteBase" />
      )}
    </>
  )
}

