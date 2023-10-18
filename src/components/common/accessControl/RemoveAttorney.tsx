
import { useState } from 'react';

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

import { Close, PersonRemove }  from '@mui/icons-material';

import { 
  useAccessControlRevokeRole,
} from '../../../generated';

import { AddrZero, HexType } from '../../../scripts/common';
import { ATTORNEYS, hasRole } from '../../../scripts/common/accessControl';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { AccessControlProps } from './SetOwner';


export function RemoveAttorney({ addr }: AccessControlProps) {

  const [acct, setAcct] = useState<HexType>(AddrZero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ flag, setFlag ] = useState<boolean>();
  const [ open, setOpen ] = useState(false);

  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(false);
    if (acct) 
    hasRole(addr, ATTORNEYS, acct).then(flag => {
      setFlag(flag);
      setOpen(true);
    });      
  }

  const {
    isLoading: removeAttorneyLoading,
    write: removeAttorney,
  } = useAccessControlRevokeRole({
    address: addr,
    args: !hasError(valid) 
      ? [ATTORNEYS, acct] : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const handleClick = () => {
    removeAttorney?.();
  }

  return (
    
    <Stack direction={'row'}  sx={{ width: '100%' }} >

      <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
        <InputLabel htmlFor="setAcct-input">RemoveAttorney</InputLabel>
        <OutlinedInput
          id="setAcct-input"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                color='primary'
                disabled={ removeAttorneyLoading || acct == undefined || acct == '0x' || hasError(valid) || loading}
                onClick={ handleClick }
                edge="end"
              >
                <PersonRemove />
              </IconButton>
            </InputAdornment>
          }
          label='RemoveAttorney'
          sx={{height:55}}
          aria-describedby='setAcct-Help-Tx'
          error={ valid['AcctAddr']?.error }
          onChange={(e) => {
            let input = HexParser( e.target.value );
            onlyHex('AcctAddr', input, 40, setValid);
            setAcct( input );
          }}
          value={ acct }
        />
        <FormHelperText id='setAcct-Help-Tx'>
          { valid['AcctAddr']?.helpTx ?? ' ' }
        </FormHelperText>        
      </FormControl>

      <Collapse in={open} sx={{width:"50%"}}>        
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

          severity={ flag ? "success" : "warning" }
          variant='outlined' 
          sx={{ height: 55,  m: 1, }} 
        >
          { flag ? 'Is Attorney' : 'Not Attorney' } 
        </Alert>
      </Collapse>

    </Stack>
    
  )
}
