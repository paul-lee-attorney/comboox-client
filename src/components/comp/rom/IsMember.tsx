import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useRegisterOfMembersIsMember
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type IsMemberProps = ContractProps & {
  args: readonly [BigNumber]
}

export function IsMember({ addr, args }:IsMemberProps ) {
  const [flag, setFlag] = useState('');

  const {isSuccess, refetch} = useRegisterOfMembersIsMember({
    address: addr,
    args:args,
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

