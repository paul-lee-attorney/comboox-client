import { useState } from 'react';

import { 
  TextField,
  Stack
} from '@mui/material';

import {
  useRegisterOfMembersGroupRep
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type GroupRepProps = ContractProps & {
  args: readonly [BigNumber]
}

export function GroupRep({ addr, args }:GroupRepProps ) {
  const [userNo, setUserNo] = useState('');

  const {isSuccess} = useRegisterOfMembersGroupRep({
    address: addr,
    args: args,
    onSuccess(data) {
      setUserNo(data.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={ userNo } variant='outlined' label="GroupRep" />
      )}
    </>
  )
}

