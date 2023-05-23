import { useState, useEffect } from 'react';

import { useComBooxContext } from '../../../scripts/ComBooxContext';

import { 
  Box, 
  TextField, 
  Button,
  Card, 
  CardContent, 
  Typography,
  Grid,
  CardActions,  
} from '@mui/material';


import { Update, ArrowForward, Send, Create, Handyman }  from '@mui/icons-material';

import Link from '../../../scripts/Link';

import { waitForTransaction } from '@wagmi/core';

import { 
  usePrepareGeneralKeeperSetCompInfo,
  useGeneralKeeperSetCompInfo,
  useGeneralKeeperRegNumOfCompany,
  useGeneralKeeperNameOfCompany,
  useGeneralKeeperSymbolOfCompany,
  useGeneralKeeperCreateCorpSeal,
  usePrepareGeneralKeeperCreateCorpSeal,
} from '../../../generated';

import { HexType, GKInfo, AddrZero } from '../../../interfaces';

interface CompIdType {
  regNumOfComp?: string | undefined,
  symbolOfComp?: string | undefined,
  nameOfComp?: string | undefined,
}

function SetCompIdPage() {
  const [inputCompId, setInputCompId] = useState<CompIdType>();
  
  const [compId, setCompId] = useState<CompIdType>();

  const { gk, setGK } = useComBooxContext();

  const {refetch: refetchRegNumOfComp} = useGeneralKeeperRegNumOfCompany({
    address: gk,
    onSuccess(regNumOfComp) {
      setCompId(v => ({
        ...v,
        regNumOfComp: regNumOfComp.toNumber().toString(),
      }));
    }
  })

  const {refetch: refetchSymbolOfComp} = useGeneralKeeperSymbolOfCompany({
    address: gk,
    onSuccess(symbolOfComp) {
      setCompId(v => ({
        ...v,
        symbolOfComp: symbolOfComp,
      }));
    }
  })
  
  const {refetch: refetchNameOfComp} = useGeneralKeeperNameOfCompany({
    address: gk,
    onSuccess(nameOfComp) {
      setCompId(v => ({
        ...v,
        nameOfComp: nameOfComp,
      }))
    }
  })

  const {
    config 
  } = usePrepareGeneralKeeperSetCompInfo({
    address: gk,
    args:  inputCompId?.nameOfComp &&
          inputCompId?.symbolOfComp  
          ? [ inputCompId.nameOfComp,
              inputCompId.symbolOfComp ] 
          : undefined,
  });

  const {
    isLoading,
    write, 
   } = useGeneralKeeperSetCompInfo({
    ...config,
    onSuccess() {
      refetchSymbolOfComp();
      refetchNameOfComp();
    }
  });

  const { 
    config: configCreateSeal, 
  } = usePrepareGeneralKeeperCreateCorpSeal({
    address: gk
  }); 

  const {
    isLoading: isLoadingCreateSeal,
    write: createSeal,
  } = useGeneralKeeperCreateCorpSeal({
    ...configCreateSeal,
    onSuccess() {
      refetchRegNumOfComp();
    }
  })

  return (
    <>
      <Grid
        container
        spacing={2}
        direction='column'
        sx={{
          height: 580,
          alignContent: 'center',
          justifyContent: 'center',          
        }}
      >

        <Grid item sx={{alignContent:'center', justifyContent:'center', }} >
          <Card sx={{ minWidth: 120, width: 500, }} variant='outlined'>
              <CardContent>

                <Typography variant="h4" component="div" sx={{ color:'blueviolet', mb:3 }} >
                  Company ID
                </Typography>
                <Typography variant="body1" component="div" sx={{ m:1 }} >
                  RegNum: { compId?.regNumOfComp }
                </Typography>
                <Typography variant="body1" component="div" sx={{ m:1 }} >
                  Name: { compId?.nameOfComp }
                </Typography>
                <Typography variant="body1" component="div" sx={{ m:1 }} >
                  Symbol: { compId?.symbolOfComp }
                </Typography>

              </CardContent>
              <CardActions>
                <Button
                  disabled={ !createSeal || isLoadingCreateSeal }
                  variant='outlined'
                  sx={{ m:1, p:1 }}
                  endIcon={ <Handyman /> }
                  onClick={ ()=>createSeal?.() }
                >
                  Create Seal
                </Button>
              </CardActions>        
          </Card>
        </Grid>

        <hr/>

        <Grid item sx={{alignContent:'center', justifyContent:'center', }} >

          <Box >

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfNameOfComp" 
              label="NameOfCompany" 
              variant="outlined"
              helperText="string (e.g. 'Comboox Inc.')"
              onChange={(e) => {
                setInputCompId((v) => ({
                  ...v,
                  nameOfComp: e.target.value,
                }))
              }}

              value = {inputCompId?.nameOfComp}
              size='small'
            />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfSymbolOfComp" 
              label="SymbolOfCompany" 
              variant="outlined"
              helperText="string (e.g. 'COMBOOX')"
              onChange={(e) => {
                setInputCompId((v) => ({
                  ...v,
                  symbolOfComp: e.target.value,
                }))
              }}

              value = {inputCompId?.symbolOfComp}
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

        <Grid item direction={'row'} sx={{alignContent:'center', justifyContent:'center', }} >

          <hr/>
          <Link
            href='/comp/initSys/setMaxQtyOfMembers'
            as = '/comp/initSys/setMaxQtyOfMembers'            
            variant='button'
            underline='hover'
          >
            <Button
              variant="contained"
              sx={{
                height: 40,
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

export default SetCompIdPage