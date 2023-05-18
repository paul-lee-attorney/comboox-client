import { useEffect, useState } from 'react';

import {
  useRegisterOfMembersOwnersEquity
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { TextField } from '@mui/material';

export function RegisteredCapital({ addr }:ContractProps ) {
  const [ par, setPar ] = useState<string>();

  const { data } = useRegisterOfMembersOwnersEquity({
    address: addr,
  })

  useEffect(()=>{
    if (data)
      setPar(data.par.toString());
  }, [data])

  return (
    <>
      {par && (
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
  const [paid, setPaid] = useState<string>();

  const {data} = useRegisterOfMembersOwnersEquity({
    address: addr,
  })

  useEffect(()=>{
    if (data)
      setPaid(data.paid.toString());
  }, [data]);

  return (
    <>
      {paid && (
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