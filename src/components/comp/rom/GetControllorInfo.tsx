import { useState } from 'react';

import { 
  Card, 
  CardActions, 
  CardContent, 
  Button, 
  Typography 
} from '@mui/material';



import {
  useRegisterOfMembersVotesOfController,
  useRegisterOfMembersControllor
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function GetControllorInfo({ addr }:ContractProps ) {
  const [controllor, setControllor] = useState('');
  const [votesOfController, setVotesOfController] = useState('');

  const {isSuccess: isControllorSuccess} = useRegisterOfMembersControllor({
    address: addr,
    onSuccess(data) {
      setControllor(data.toString(16));
    }
  })

  const {isSuccess: isVoteSuccess} = useRegisterOfMembersVotesOfController({
    address: addr,
    onSuccess(data) {
      setControllor(data.toNumber().toString());
    }
  })

  return (
    <>
        <Card sx={{ minWidth: 120, width: 300 }} variant='outlined'>
          <CardContent>

            <Typography variant="h6" component="div" >
              Actual Controllor
            </Typography>
            <Typography variant="body1" component="div" >
              UserNo: {controllor}
            </Typography>
            <Typography variant="body1" component="div" >
              VotesInHand: {votesOfController}
            </Typography>

          </CardContent>
          
          <CardActions>
            <Button size="small" >Refresh</Button>
          </CardActions>
        
        </Card>
    </>
  )
}

