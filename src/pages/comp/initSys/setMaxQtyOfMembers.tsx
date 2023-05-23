import { useState, useEffect } from 'react';

import { 
  Box, 
  TextField, 
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';

import { ArrowBack, ArrowForward, Update }  from '@mui/icons-material';

import Link from '../../../scripts/Link';

import {
  useGeneralKeeperGetBook,
  useRegisterOfMembersMaxQtyOfMembers,
  usePrepareRegisterOfMembersSetMaxQtyOfMembers,
  useRegisterOfMembersSetMaxQtyOfMembers,
} from '../../../generated';

import { BigNumber } from 'ethers';

import { useComBooxContext } from '../../../scripts/ComBooxContext';

function SetMaxQtyOfMembersPage() {

  const { gk } = useComBooxContext();

  const [max, setMax] = useState<string>();
  const [inputMax, setInputMax] = useState<string>('50');

  const {
    data: rom
  } = useGeneralKeeperGetBook({
    address: gk,
    args: [BigNumber.from(8)],
  })

  const {
    refetch: refetchMax
  } = useRegisterOfMembersMaxQtyOfMembers({
    address: rom,
    onSuccess(max) {
      setMax(max.toString());
    }
  });

  const {
    config,
  } = usePrepareRegisterOfMembersSetMaxQtyOfMembers({
    address: rom,
    args: inputMax ? 
      [BigNumber.from(inputMax)] :
      undefined,
  });

  const {
    isLoading,
    write, 
  } = useRegisterOfMembersSetMaxQtyOfMembers({
    ...config,
    onSuccess() {
      refetchMax();
    },
  });

  return (
    <>
      <br />
      <br />
      <br />
      <br />

      <Grid
        container
        spacing={2}
        direction='column'
        sx={{
          height: 380,
          alignContent: 'center',
          justifyContent: 'center',          
        }}
      >

        <Grid item sx={{alignContent:'center', justifyContent:'center', }} >

          <Card sx={{ minWidth: 120, width: 300 }} variant='outlined'>
              <CardContent>

                <Typography variant="h6" component="div" >
                  Max Qty Of Members
                </Typography>
                <Typography variant="body1" component="div" >
                  MaxQty: {max}
                </Typography>

              </CardContent>        
          </Card>
        
        </Grid>

      <hr/>

        <Grid item sx={{alignContent:'center', justifyContent:'center', }} >

          <Box >

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfMaxQty" 
              label="MaxQtyOfMembers" 
              variant="outlined"
              helperText="Number (e.g. '50')"
              onChange={(e) => {
                setInputMax(e.target.value);
              }}

              value = {inputMax}
              size='small'
            />

            <Button 
              disabled = {!write || isLoading}

              sx={{ m: 1, minWidth: 120, height: 40 }} 
              variant="contained" 
              endIcon={<Update />}
              onClick={()=> write?.()}
              size='small'
            >
              Update
            </Button>

          </Box>

        </Grid>


        <Grid item sx={{alignContent:'center'}} >

          <hr />
          <Link
            href={{
              pathname: './setCompId',
            }}

            as = './setCompId'
            
            variant='button'

            underline='hover'
          >
            <Button
              variant="contained"
              sx={{
                height: 40,
                mr: 10,
              }}
              startIcon={ <ArrowBack /> }
            >
              Prev
            </Button>

          </Link>          

          {`        `}

          <Link
            href={{
              pathname: './initBos',
            }}
            as = './initBos'
            variant='button'
            underline='hover'
          >

            <Button
              variant="contained"
              sx={{
                height: 40,
                ml: 10,
              }}
              endIcon={ <ArrowForward /> }
            >
              Next
            </Button>

          </Link>
        </Grid>

      </Grid>
    </>    
  )
}

export default SetMaxQtyOfMembersPage