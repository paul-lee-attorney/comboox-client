import { useState, useEffect } from 'react';

import { 
  TextField, 
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  Stack,
  Divider,
} from '@mui/material';

import { ArrowBack, ArrowForward, Update }  from '@mui/icons-material';

import {
  useRegisterOfMembersMaxQtyOfMembers,
  usePrepareRegisterOfMembersSetMaxQtyOfMembers,
  useRegisterOfMembersSetMaxQtyOfMembers,
} from '../../../generated';

import { BigNumber } from 'ethers';

import { useComBooxContext } from '../../../scripts/ComBooxContext';

interface SetMaxQtyOfMembersProps {
  nextStep: (next: number) => void;
}

export function SetMaxQtyOfMembers({nextStep}: SetMaxQtyOfMembersProps) {

  const { boox } = useComBooxContext();

  const [max, setMax] = useState<string>('');
  const [inputMax, setInputMax] = useState<string>('50');

  const {
    refetch: getMaxQty
  } = useRegisterOfMembersMaxQtyOfMembers({
    address: boox[8],
    onSuccess(max) {
      setMax(max.toString());
    }
  });

  const {
    config: setMaxQtyConfig,
  } = usePrepareRegisterOfMembersSetMaxQtyOfMembers({
    address: boox[8],
    args: [BigNumber.from(inputMax)],
  });

  const {
    isLoading: setMaxQtyLoading,
    write: setMaxQty, 
  } = useRegisterOfMembersSetMaxQtyOfMembers({
    ...setMaxQtyConfig,
    onSuccess() {
      getMaxQty();
    },
  });

  return (    
    <Paper elevation={3} sx={{m:1, p:1, width:'100%', alignItems:'center', justifyContent:'center' }} >
      <Stack direction='column' sx={{m:1, p:1, alignItems:'start', justifyContent:'space-between'}} >

        <Typography variant="h5" component="div" sx={{ m:2, textDecoration:'underline' }} >
          <b>Max Qty of Members</b>
        </Typography>


        <Card sx={{ width:'100%', }} variant='outlined'>
            <CardContent>

              <Typography variant="body1" component="div" sx={{ m:1 }} >
                MaxQty: {max}
              </Typography>

            </CardContent>        
        </Card>
      
        <Stack direction='row' sx={{m:1, p:1}}>
          <TextField 
            sx={{ m: 1, minWidth: 120 }} 
            id="tfMaxQty" 
            label="MaxQtyOfMembers" 
            variant="outlined"
            helperText="Number (e.g. '50')"
            onChange={(e) => {
              setInputMax(e.target.value ?? '0');
            }}

            value = {inputMax}
            size='small'
          />

          <Button 
            disabled = {!setMaxQty || setMaxQtyLoading}

            sx={{ m: 1, minWidth: 120, height: 40 }} 
            variant="contained" 
            endIcon={<Update />}
            onClick={()=> setMaxQty?.()}
            size='small'
          >
            Update
          </Button>

        </Stack>

        <Divider sx={{width:'100%'}} />

        <Stack direction='row' sx={{m:1, p:1, justifyContent:'space-between'}}>

          <Button
            variant="contained"
            sx={{
              height: 40,
              mr: 10,
            }}
            startIcon={ <ArrowBack /> }

            onClick={()=>nextStep(0)}
          >
            Prev
          </Button>


          <Button
            variant="contained"
            sx={{
              height: 40,
              ml: 10,
            }}
            endIcon={ <ArrowForward /> }

            onClick={()=>nextStep(2)}
          >
            Next
          </Button>

        </Stack>

      </Stack>
    </Paper>
  )
}
