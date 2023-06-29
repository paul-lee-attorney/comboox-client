import { useState } from 'react';

import { useComBooxContext } from '../../../scripts/ComBooxContext';

import { 
  TextField, 
  Button,
  Card, 
  CardContent, 
  Typography,
  Stack,
  Divider,
  Paper,  
} from '@mui/material';


import { Update, ArrowForward }  from '@mui/icons-material';

import { 
  usePrepareGeneralKeeperSetCompInfo,
  useGeneralKeeperSetCompInfo,
  useGeneralKeeperRegNumOfCompany,
  useGeneralKeeperNameOfCompany,
  useGeneralKeeperSymbolOfCompany,
} from '../../../generated';


interface CompId {
  regNum: string;
  symbol: string;
  name: string;
}

interface SetCompIdProps {
  nextStep: (next: number) => void;
}

export function SetCompId({nextStep}: SetCompIdProps) {

  const defaultId: CompId = {
    regNum: '0',
    symbol: '',
    name: '',
  };

  const [inputId, setInputId] = useState<CompId>(defaultId);
  
  const [newId, setNewId] = useState<CompId>(defaultId);

  const { gk } = useComBooxContext();

  const {
    refetch: getRegNum
  } = useGeneralKeeperRegNumOfCompany({
    address: gk,
    onSuccess(data) {
      setNewId(v => ({
        ...v,
        regNum: data.toString(),
      }));
    },
  });

  const {
    refetch: getSymbol
  } = useGeneralKeeperSymbolOfCompany({
    address: gk,
    onSuccess(data) {
      setNewId(v => ({
        ...v,
        symbol: data,
      }));
    }
  })
  
  const {
    refetch: getName
  } = useGeneralKeeperNameOfCompany({
    address: gk,
    onSuccess(data) {
      setNewId(v => ({
        ...v,
        name: data,
      }))
    }
  });

  const {
    config: setCompInfoConfig 
  } = usePrepareGeneralKeeperSetCompInfo({
    address: gk,
    args:  [ inputId.name, inputId.symbol ],
  });

  const {
    isLoading: setCompInfoLoading,
    write: setCompInfo, 
   } = useGeneralKeeperSetCompInfo({
    ...setCompInfoConfig,
    onSuccess() {
      getSymbol();
      getName();
    }
  });

  return (

    <Paper elevation={3} sx={{m:1, p:1, width:'100%', alignItems:'center', justifyContent:'center'}} >
      <Stack direction='column' sx={{m:1, p:1, alignItems:'start', justifyItems:'space-between'}} >    

        <Typography variant="h5" sx={{ m:2, textDecoration:'underline' }} >
          <b>Company ID</b>
        </Typography>

        <Card sx={{ width: '100%', }} variant='outlined'>
          <CardContent>
            <Typography variant="body1" sx={{ m:1 }} >
              RegNum: { newId.regNum }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Name: { newId.name }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Symbol: { newId.symbol }
            </Typography>
          </CardContent>
        </Card>

        <Stack direction='row' sx={{m:1, p:1, alignItems:'start', justifyContent:'center'}} >
          <TextField 
            sx={{ m: 1, minWidth: 120 }} 
            id="tfNameOfComp" 
            label="NameOfCompany" 
            variant="outlined"
            helperText="string (e.g. 'Comboox Inc.')"
            onChange={(e) => {
              setInputId((v) => ({
                ...v,
                name: (e.target.value ?? ''),
              }))
            }}
            value = {inputId.name}
            size='small'
          />

          <TextField 
            sx={{ m: 1, minWidth: 120 }} 
            id="tfSymbolOfComp" 
            label="SymbolOfCompany" 
            variant="outlined"
            helperText="string (e.g. 'COMBOOX')"
            onChange={(e) => {
              setInputId((v) => ({
                ...v,
                symbol: (e.target.value ?? ''),
              }))
            }}

            value = {inputId.symbol}
            size='small'
          />

          <Button 
            disabled = {!setCompInfo || setCompInfoLoading}

            sx={{ m: 1, minWidth: 120, height: 40 }} 
            variant="contained" 
            endIcon={<Update />}
            onClick={()=> setCompInfo?.()}
            size='small'
          >
            Update
          </Button>

        </Stack>

        <Divider sx={{width:'100%'}} />

        <Button
          sx={{ m: 3, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<ArrowForward />}
          onClick={()=> nextStep(1)}
          size='small'
        >
          Next
        </Button>

      </Stack>
    </Paper>
  )
}