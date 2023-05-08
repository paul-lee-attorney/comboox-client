import { useState } from 'react';

import { TextField } from '@mui/material';

import {
  useRegisterOfMembersVotesOfController,
  useRegisterOfMembersControllor
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function Controllor({ addr }:ContractProps ) {
  const [controllor, setControllor] = useState('');

  const {isSuccess} = useRegisterOfMembersControllor({
    address: addr,
    onSuccess(data) {
      setControllor(data.toString(16));
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField 
          value={controllor} 
          variant='filled' 
          label="ActualControllor" 
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


export function VotesOfController({ addr }:ContractProps ) {
  const [votesOfController, setVotesOfController] = useState('');

  const {isSuccess} = useRegisterOfMembersVotesOfController({
    address: addr,
    onSuccess(data) {
      setVotesOfController(data.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <TextField 
          value={votesOfController} 
          variant='filled' 
          label="VotesOfController" 
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

