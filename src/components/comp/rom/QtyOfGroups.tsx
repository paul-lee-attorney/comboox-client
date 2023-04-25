import { useState } from 'react';

import { 
  TextField
} from '@mui/material';

import {
  useRegisterOfMembersQtyOfGroups
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function QtyOfGroups({ addr }:ContractProps ) {
  const [qtyOfGroups, setQtyOfGroups] = useState('');

  const {isSuccess} = useRegisterOfMembersQtyOfGroups({
    address: addr,
    onSuccess(data) {
      setQtyOfGroups(data.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField value={qtyOfGroups} variant='outlined' label="QtyOfGroups" />
      )}
    </>
  )
}

