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
} from '@mui/material';


import { Update, ArrowForward, Send }  from '@mui/icons-material';

import Link from '../../../scripts/Link';

import { 
  usePrepareGeneralKeeperSetCompInfo,
  useGeneralKeeperSetCompInfo,
  useGeneralKeeperRegNumHash,
  useGeneralKeeperNameOfCompany,
  useGeneralKeeperSymbolOfCompany,
} from '../../../generated';

import { HexType, GKInfo, AddrZero } from '../../../interfaces';

type CompIdType = {
  regNumHash?: HexType | undefined,
  nameOfComp?: string | undefined,
  symbolOfComp?: string | undefined,
}

function SetCompIdPage() {
  const [inputCompId, setInputCompId] = useState<CompIdType>();
  const [compId, setCompId] = useState<CompIdType>();

  const { gk, setGK } = useComBooxContext();
  
  const {refetch: refetchRegNumHash} = useGeneralKeeperRegNumHash({
    address: gk,
    onSuccess(regNumHash) {
      setCompId(v => ({
        ...v,
        regNumHash: regNumHash,
      }))
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

  const {refetch: refetchSymbolOfComp} = useGeneralKeeperSymbolOfCompany({
    address: gk,
    onSuccess(symbolOfComp) {
      setCompId(v => ({
        ...v,
        symbolOfComp: symbolOfComp,
      }));
    }
  })

  const {
    config, 
    isLoading
  } = usePrepareGeneralKeeperSetCompInfo({
    address: gk,
    args: inputCompId?.regNumHash && 
          inputCompId?.nameOfComp &&
          inputCompId?.symbolOfComp  
          ? [ inputCompId.regNumHash, 
              inputCompId.nameOfComp,
              inputCompId.symbolOfComp ] : 
          undefined,
  });

  const {
    data,
    write, 
   } = useGeneralKeeperSetCompInfo(config);

  useEffect(() => {
    if (data) {
      refetchRegNumHash();
      refetchNameOfComp();
      refetchSymbolOfComp();
    }
  }, [data, refetchNameOfComp, refetchRegNumHash, refetchSymbolOfComp]);

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
          <Card sx={{ minWidth: 120, width: 300, }} variant='outlined'>
              <CardContent>

                <Typography variant="h6" component="div" >
                  Company ID
                </Typography>
                <Typography variant="body1" component="div" >
                  Name: {compId?.nameOfComp}
                </Typography>
                <Typography variant="body1" component="div" >
                  Symbol: {compId?.symbolOfComp}
                </Typography>
                <Typography variant="body2" component="div" >
                  RegNumHash: {compId?.regNumHash?.substring(0,6) + 
                    '...' + compId?.regNumHash?.substring(62)}
                </Typography>

              </CardContent>        
          </Card>
        </Grid>

        <hr/>

        <Grid item sx={{alignContent:'center', justifyContent:'center', }} >

          <Box >

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfRegNumHash" 
              label="RegNumHash" 
              variant="outlined"
              helperText="Bytes32 (e.g. '0xa38...0f3b')"
              onChange={(e) => {
                setInputCompId(v=>({
                  ...v,
                  regNumHash: `0x${e.target.value.substring(2)}`,
                }));
              }}

              value = {inputCompId?.regNumHash}
              size='small'
            />

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