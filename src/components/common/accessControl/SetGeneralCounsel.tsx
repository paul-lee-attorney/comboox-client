
import { useEffect, useState } from 'react';

import { 
  Stack,
  Alert,
  Collapse,
  IconButton,
  InputLabel,
  InputAdornment,
  FormControl,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';

import { Approval, Close }  from '@mui/icons-material';

import {
  useAccessControlSetRoleAdmin,
} from '../../../generated';

import { AddrZero, HexType } from '../../../scripts/common';
import { ATTORNEYS, getGeneralCounsel } from '../../../scripts/common/accessControl';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { AccessControlProps } from './SetOwner';

export function SetGeneralCounsel({ addr }: AccessControlProps) {

  const [ newGC, setNewGC ] = useState<HexType>();
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ open, setOpen ] = useState(false);
  const [ time, setTime ] = useState(0);

  const [gc, setGC] = useState<HexType>(AddrZero);

  const refresh = () => {
    setTime(Date.now());
  }
  
  useEffect(()=>{
    if (addr) {
      getGeneralCounsel(addr).then(
        res => {
          setNewGC(res);
          setOpen(true);
        }
      )
    }
  }, [addr, time])

  const {
    isLoading: setGeneralCounselLoading,
    write: setGeneralCounsel,
  } = useAccessControlSetRoleAdmin({
    address: addr,
    args: !hasError(valid) ? [ ATTORNEYS, gc] : undefined,
    onSuccess(data) {
      let hash:HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const handleClick = () => {
    setGeneralCounsel?.();
  }

  return (
    <>
      <Stack direction={'row'} >

        <FormControl sx={{ m: 1, width: "50%" }} variant="outlined">
          <InputLabel htmlFor="setGC-input">SetGeneralCounsel</InputLabel>
          <OutlinedInput
            id="setGC-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disabled={ setGeneralCounselLoading || gc == undefined || gc == '0x' || hasError(valid)}
                  color='primary'
                  onClick={ handleClick }
                  edge="end"
                >
                  <Approval />
                </IconButton>
              </InputAdornment>
            }
            label='SetGeneralCounsel'
            sx={{height: 55}}
            aria-describedby='setAcct-Help-Tx'
            error={ valid['AcctAddr']?.error }
            onChange={(e) => {
              let input = HexParser(e.target.value);
              onlyHex('AcctAddr', input, 40, setValid);
              setGC(input);
            }}
            value={ gc }
          />
        <FormHelperText id='setAcct-Help-Tx'>
          { valid['AcctAddr']?.helpTx }
        </FormHelperText>                  
        </FormControl>

        <Collapse in={open} sx={{ width:"50%" }} >        
          <Alert 
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }

            variant='outlined' 
            severity='info' 
            sx={{ height: 55,  m: 1 }} 
          >
            General Counsel: { newGC?.substring(0, 6) + '...' + newGC?.substring(38, 42) } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
