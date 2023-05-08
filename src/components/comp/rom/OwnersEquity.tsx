import { useState } from 'react';

import {
  useRegisterOfMembersOwnersEquity
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { TextField } from '@mui/material';

export function RegisteredCapital({ addr }:ContractProps ) {
  const [par, setPar] = useState('');

  const {isSuccess} = useRegisterOfMembersOwnersEquity({
    address: addr,
    onSuccess(data) {
      setPar(data.par.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField 
          value={par} 
          variant='filled' 
          label="RegisteredCapital" 
          inputProps={{readOnly: true}}
          sx={{
            m: 1,
          }}
          fullWidth
        />
      )}
    </>
  )
}

export function PaidInCapital({ addr }:ContractProps ) {
  const [paid, setPaid] = useState('');

  const {isSuccess} = useRegisterOfMembersOwnersEquity({
    address: addr,
    onSuccess(data) {
      setPaid(data.paid.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField 
          value={paid} 
          variant='filled' 
          label="PaidInCapital" 
          inputProps={{readOnly: true}}
          sx={{
            m: 1,
          }}
          fullWidth
        />
      )}
    </>
  )
}