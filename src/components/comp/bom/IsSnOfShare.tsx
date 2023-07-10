import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useBookOfMembersIsSnOfShare
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type IsSnOfShare = ContractProps & {
  args: readonly [BigNumber]
}


export function IsSnOfShare({ addr, args }:IsSnOfShare ) {
  const [flag, setFlag] = useState('');

  const {isSuccess, refetch} = useBookOfMembersIsSnOfShare({
    address: addr,
    onSuccess(data) {
      setFlag(data ? 'True' : 'False');
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={flag} variant='outlined' label="IsSnOfShare" />
      )}
    </>
  )
}

