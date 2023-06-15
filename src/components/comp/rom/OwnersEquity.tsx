import { useEffect, useState } from 'react';

import {
  useRegisterOfMembersOwnersEquity
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { TextField } from '@mui/material';
import { longDataParser } from '../../../scripts/toolsKit';

export function RegisteredCapital({ addr }:ContractProps ) {
  const [ par, setPar ] = useState<string>();

  useRegisterOfMembersOwnersEquity({
    address: addr,
    onSuccess(data) {
      setPar(data.par.toString())
    }
  })

  return (
    <>
      {par && (
        <TextField 
          value={ longDataParser(par)} 
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
  const [paid, setPaid] = useState<string>();

  useRegisterOfMembersOwnersEquity({
    address: addr,
    onSuccess(data) {
      setPaid(data.paid.toString());
    }
  })

  return (
    <>
      {paid && (
        <TextField 
          value={ longDataParser(paid) } 
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