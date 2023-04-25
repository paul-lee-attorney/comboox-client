import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useRegisterOfMembersMaxQtyOfMembers
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function MaxQtyOfMembers({ addr }:ContractProps ) {
  const [maxQty, setMaxQty] = useState('');

  const {isSuccess} = useRegisterOfMembersMaxQtyOfMembers({
    address: addr,
    onSuccess(data) {
      setMaxQty(data);
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={maxQty} variant='outlined' label="MaxQtyOfMembers" />
      )}
    </>
  )
}

