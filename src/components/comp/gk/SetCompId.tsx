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
  IconButton,
  Tooltip,  
} from '@mui/material';


import { Update, ArrowForward, ArrowCircleUpOutlined, ArrowCircleUp, ArrowCircleDown, ArrowUpward, ArrowDownward }  from '@mui/icons-material';

import { 
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
    isLoading: setCompInfoLoading,
    write: setCompInfo, 
   } = useGeneralKeeperSetCompInfo({
    address: gk,
    args:  [ inputId.name, inputId.symbol ],
    onSuccess() {
      getSymbol();
      getName();
    }
  });

  return (

    <Paper elevation={3} sx={{m:1, p:1, alignItems:'start', justifyContent:'start', alignContent:'start'}} >
      <Stack direction='row' sx={{alignItems:'start', justifyContent:'start', alignContent:'start'}}>

        <Stack direction='column' sx={{ height:'100%' }} >

          <Tooltip title='Prev Step' placement='left' arrow >
            <span>
              <IconButton
                size='large'
                color='primary'
                disabled
              >
                <ArrowUpward />
              </IconButton>
            </span>
          </Tooltip>

          <Divider flexItem />

          <Tooltip title='Next Step' placement='left' arrow >

            <IconButton
              size='large'
              color='primary'
              onClick={()=>nextStep(1)}
            >
              <ArrowDownward />
            </IconButton>

          </Tooltip>

        </Stack>

        <Divider sx={{m:1}} orientation='vertical' flexItem />

        <Stack direction='column' sx={{m:1, alignItems:'start', justifyItems:'start'}} >    

          <Typography variant="h5" sx={{m:1, textDecoration:'underline' }} >
            <b>Company ID</b>
          </Typography>

          <Card variant='outlined' sx={{m:1, mr:3, width:'100%' }}>
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

          <Stack direction='row' sx={{alignItems:'start', justifyContent:'start'}} >
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

        </Stack>

      </Stack>
    </Paper>
  )
}