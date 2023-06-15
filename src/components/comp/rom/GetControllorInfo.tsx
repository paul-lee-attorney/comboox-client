import { useEffect, useState } from 'react';

import { TextField } from '@mui/material';

import {
  useRegisterOfMembersVotesOfController,
  useRegisterOfMembersControllor
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { longDataParser, longSnParser } from '../../../scripts/toolsKit';

export function Controllor({ addr }:ContractProps ) {
  const [controllor, setControllor] = useState<string>();

  const { data } = useRegisterOfMembersControllor({
    address: addr,
  })

  useEffect(() => {
    if ( data ) 
      setControllor(data.toString());
  }, [ data ]);

  return (
    <>
      {controllor && (
        <TextField 
          value={ longSnParser(controllor) } 
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
  const [votesOfController, setVotesOfController] = useState<string>();

  const {data} = useRegisterOfMembersVotesOfController({
    address: addr,
  })

  useEffect(() => {
    if (data)
      setVotesOfController(data.toString());
  }, [data]);

  return (
    <>
      {votesOfController && (
        <TextField 
          value={ longDataParser(votesOfController) } 
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

