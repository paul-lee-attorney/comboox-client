import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useComBooxContext } from '../../../scripts/common/ComBooxContext';

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,  
} from '@mui/material';


import { Update, ArrowUpward, ArrowDownward }  from '@mui/icons-material';

import { 
  useGeneralKeeperSetCompInfo,
} from '../../../generated';
import { CompInfo, getCompInfo } from '../../../scripts/comp/gk';
import { dateParser, longDataParser, refreshAfterTx, toAscii, } from '../../../scripts/common/toolsKit';
import { currencies } from './GeneralInfo';
import { HexType } from '../../../scripts/common';


export const defaultInfo: CompInfo = {
  regNum: 0,
  regDate: 0,
  currency: 0,
  symbol: '',
  name: '',
};


export interface InitCompProps {
  nextStep: Dispatch<SetStateAction<number>>;
}

export function SetCompInfo({nextStep}: InitCompProps) {

  const [compInfo, setCompInfo] = useState<CompInfo>(defaultInfo);  
  const [ newInfo, setNewInfo] = useState<CompInfo>(defaultInfo);

  const { gk } = useComBooxContext();
  const [ time, setTime ] = useState(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

  const {
    isLoading: setInfoLoading,
    write: setInfo, 
   } = useGeneralKeeperSetCompInfo({
    address: gk,
    args: [ 
            compInfo.currency, 
            `0x${toAscii(compInfo.symbol).padEnd(40,'0')}`, 
            compInfo.name 
          ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  useEffect(()=>{
    if (gk) {
      getCompInfo(gk).then(
        info => setNewInfo(info)
      )
    }
  }, [gk, time]);

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
                RegNum: { longDataParser(newInfo.regNum.toString()) }
              </Typography>
              <Typography variant="body1" sx={{ m:1 }} >
                RegDate: {  dateParser(newInfo.regDate.toString()) }
              </Typography>
              <Typography variant="body1" sx={{ m:1 }} >
                Name: { newInfo.name }
              </Typography>
              <Typography variant="body1" sx={{ m:1 }} >
                Symbol: {  newInfo.symbol }
              </Typography>
              <Typography variant="body1" sx={{ m:1 }} >
                BookingCurrency: { currencies[ newInfo.currency ] }
              </Typography>

            </CardContent>
          </Card>

          <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >
            <TextField 
              sx={{ m: 1, minWidth: 218 }} 
              id="tfNameOfComp" 
              label="CompanyName" 
              variant="outlined"
              onChange={(e) => {
                setCompInfo((v) => ({
                  ...v,
                  name: (e.target.value ?? ''),
                }))
              }}
              value = { compInfo.name }
              size='small'
            />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfSymbolOfComp" 
              label="SymbolOfCompany" 
              variant="outlined"
              onChange={(e) => {
                setCompInfo((v) => ({
                  ...v,
                  symbol: (e.target.value ?? ''),
                }))
              }}

              value = { compInfo.symbol }
              size='small'
            />

            <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
              <InputLabel id="bookingCurrency-label">BookingCurrency</InputLabel>
              <Select
                labelId="bookingCurrency-label"
                id="bookingCurrency-select"
                label="BookingCurrency"
                value={ compInfo.currency.toString() }
                onChange={(e) => setCompInfo((v) => ({
                  ...v,
                  currency: Number(e.target.value) ,
                }))}
              >
                {currencies.map((v, i) => (
                  <MenuItem key={i} value={i.toString()}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button 
              disabled = { setInfoLoading }

              sx={{ m: 1, minWidth: 120, height: 40 }} 
              variant="contained" 
              endIcon={<Update />}
              onClick={()=> setInfo?.()}
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