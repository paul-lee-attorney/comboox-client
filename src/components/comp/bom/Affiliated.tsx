import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useBookOfMembersAffiliated
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type AffiliatedProps = ContractProps & {
  args: readonly [BigNumber, BigNumber]
}

export function Affiliated({ addr, args }:AffiliatedProps ) {
  const [flag, setFlag] = useState('');

  const {isSuccess, refetch} = useBookOfMembersAffiliated({
    address: addr,
    args:args,
    onSuccess(data) {
      setFlag(data ? 'True' : 'False');
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={flag} variant='outlined' label="Affiliated" />
      )}
    </>
  )
}

