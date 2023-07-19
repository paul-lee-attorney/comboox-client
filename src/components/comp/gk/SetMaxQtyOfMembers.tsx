import { useState } from 'react';

import { 
  TextField, 
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  Stack,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';

import { ArrowDownward, ArrowUpward, Update }  from '@mui/icons-material';

import {
  useBookOfMembersMaxQtyOfMembers,
  useBookOfMembersSetMaxQtyOfMembers,
} from '../../../generated';


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
  } = useBookOfMembersMaxQtyOfMembers({
    address: boox ? boox[4] : undefined,
    onSuccess(max) {
      setMax(max.toString());
    }
  });

  const {
    isLoading: setMaxQtyLoading,
    write: setMaxQty, 
  } = useBookOfMembersSetMaxQtyOfMembers({
    address: boox ? boox[4] : undefined,
    args: [BigInt(inputMax)],
    onSuccess() {
      getMaxQty();
    },
  });

  return (    
    <Paper elevation={3} sx={{m:1, p:1, width:'100%', alignItems:'center', justifyContent:'center' }} >

      <Stack direction='row' sx={{alignItems:'start', justifyContent:'start', alignContent:'start'}} >

        <Stack direction='column' sx={{ height:'100%' }} >
          <Tooltip title='Prev Step' placement='left' arrow >
            <IconButton
              size='large'
              color='primary'
              onClick={()=>nextStep(0)}
            >
              <ArrowUpward />
            </IconButton>
          </Tooltip>

          <Divider flexItem />

          <Tooltip title='Next Step' placement='left' arrow >

            <IconButton
              size='large'
              color='primary'
              onClick={()=>nextStep(2)}
            >
              <ArrowDownward />
            </IconButton>

          </Tooltip>

        </Stack>

        <Divider sx={{m:1}} orientation='vertical' flexItem />

        <Stack direction='column' sx={{m:1, alignItems:'start', justifyContent:'space-between'}} >

          <Typography variant="h5" component="div" sx={{ m:1, textDecoration:'underline' }} >
            <b>Max Qty of Members</b>
          </Typography>


          <Card sx={{ m:1, width:'100%', }} variant='outlined'>
              <CardContent>

                <Typography variant="body1" component="div" sx={{ m:1 }} >
                  MaxQty: {max}
                </Typography>

              </CardContent>        
          </Card>
        
          <Stack direction='row' >
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

        </Stack>

      </Stack>

    </Paper>
  )
}
