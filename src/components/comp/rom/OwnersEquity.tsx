import { useState } from 'react';



import { 
  TextField,
  Stack
} from '@mui/material';

import {
  useRegisterOfMembersOwnersEquity
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function OwnersEquity({ addr }:ContractProps ) {
  const [par, setPar] = useState('');
  const [paid, setPaid] = useState('');

  const {isSuccess} = useRegisterOfMembersOwnersEquity({
    address: addr,
    onSuccess(data) {
      setPar(data.par.toString());
      setPaid(data.paid.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <div>
          <h4>Owners Equity</h4>
          <Stack direction="row" spacing={1} >
            <TextField value={par} variant='outlined' label="RegisteredCapital" />
            <TextField value={paid} variant='outlined' label="PaidInCapital" />
          </Stack>
        </div>
      )}
    </>
  )
}

