import { useState } from 'react';

import { 
  TextField,
  Stack
} from '@mui/material';

import {
  useRegisterOfMembersDeepOfGroup
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type DeepOfGroupProps = ContractProps & {
  args: readonly [BigNumber]
}

export function DeepOfGroup({ addr, args }:DeepOfGroupProps ) {
  const [deep, setDeep] = useState('');

  const {isSuccess} = useRegisterOfMembersDeepOfGroup({
    address: addr,
    args: args,
    onSuccess(data) {
      setDeep(data.toNumber().toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={ deep } variant='outlined' label="DeepOfGroup" />
      )}
    </>
  )
}

