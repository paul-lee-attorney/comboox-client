
import { useState, useEffect } from 'react';

import { 
  Stack,
  Alert,
  Collapse,
  IconButton,
  InputLabel,
  InputAdornment,
  FormControl,
  OutlinedInput,
} from '@mui/material';

import { Close, PersonAdd }  from '@mui/icons-material';

import { readContract } from '@wagmi/core';

import { 
  accessControlABI,
  useAccessControlGrantRole,
} from '../../../generated';

import { HexType } from '../../../scripts/common';
import { ATTORNEYS, hasRole } from '../../../scripts/common/accessControl';
import { HexParser } from '../../../scripts/common/toolsKit';
import { AccessControlProps } from './SetOwner';

export function AppointAttorney({ addr }: AccessControlProps) {

  const [acct, setAcct] = useState<HexType>();

  const [ flag, setFlag ] = useState<boolean>();
  const [ open, setOpen ] = useState(false);

  const {
    data,
    isLoading,
    write,
  } = useAccessControlGrantRole({
    address: addr,
    args: acct && acct != '0x' 
      ? [ATTORNEYS, acct] : undefined,
    onSuccess() {
      if (acct)
        hasRole(addr, ATTORNEYS, acct).then(flag => {
          setFlag(flag);
          setOpen(true);
        }); 
    }
  });

  const handleClick = () => {
    write?.();
  }

  return (
      <Stack direction={'row'}  sx={{ width: '100%' }} >

        <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
          <InputLabel htmlFor="setAcct-input">AppointAttorney</InputLabel>
          <OutlinedInput
            id="setAcct-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color='primary'
                  disabled={ isLoading || acct == undefined || acct == '0x' }
                  onClick={ handleClick }
                  edge="end"
                >
                  <PersonAdd />
                </IconButton>
              </InputAdornment>
            }
            label='AppointAttorney'
            sx={{ height:55 }}
            onChange={(e) => setAcct( HexParser(e.target.value) )}
            value={ acct }
          />
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

            variant='outlined' 
            severity={ flag ? "success" : "warning"}
            sx={{ height: 55,  m: 1, }} 
          >
            { flag ? 'Is Attorney' : 'Not Attorney' } 
          </Alert>
        </Collapse>

      </Stack>
  )
}
