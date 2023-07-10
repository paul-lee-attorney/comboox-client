import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useBookOfMembersIsGroupRep
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type IsGroupRepProps = ContractProps & {
  args: readonly [BigNumber]
}

export function IsGroupRep({ addr, args }:IsGroupRepProps ) {
  const [flag, setFlag] = useState('');

  const {isSuccess, refetch} = useBookOfMembersIsGroupRep({
    address: addr,
    args:args,
    onSuccess(data) {
      setFlag(data ? 'True' : 'False');
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={flag} variant='outlined' label="IsGroupRep" />
      )}
    </>
  )
}

