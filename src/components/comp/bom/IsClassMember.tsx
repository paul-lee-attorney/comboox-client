import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useBookOfMembersIsClassMember
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type IsClassMemberProps = ContractProps & {
  args: readonly [BigNumber, BigNumber]
}

export function IsClassMember({ addr, args }:IsClassMemberProps ) {
  const [flag, setFlag] = useState('');

  const {isSuccess, refetch} = useBookOfMembersIsClassMember({
    address: addr,
    args:args,
    onSuccess(data) {
      setFlag(data ? 'True' : 'False');
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={flag} variant='outlined' label="IsClassMember" />
      )}
    </>
  )
}

