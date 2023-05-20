
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
  Button,
} from '@mui/material';

import { Skateboarding, Close, }  from '@mui/icons-material';

import { 
  accessControlABI,
  usePrepareAccessControlRenounceRole,
  useAccessControlRenounceRole,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { BigNumber } from 'ethers';

const ATTORNEYS:HexType = `0x${'4174746f726e657973' + '0'.padEnd(46, '0')}`;

export function QuitAttorney({ addr }: ContractProps) {

  const [ flag, setFlag ] = useState(false);
  const [ open, setOpen ] = useState(false);

  const { config } = usePrepareAccessControlRenounceRole({
    address: addr,
    args: [ATTORNEYS],
  });

  const {
    isLoading,
    write,
  } = useAccessControlRenounceRole({
    ...config,
    onSuccess() {
      setFlag(true);
      setOpen(true);
    }
  });


  const handleClick = () => {
    write?.();
  }

  return (
    <>
      <Stack direction={'row'}  sx={{ width: '100%' }} >

        <Button
          disabled={ !write || isLoading }
          sx={{m:1, width: 250, height:55}}
          variant='outlined'
          endIcon={<Skateboarding />}
          onClick={ handleClick }
        >
          Quit Attorney
        </Button>

        <Collapse in={open} sx={{width:280}}>        
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
            severity={ flag ? "warning" : "success" } 
            sx={{ height: 55,  m: 1, }} 
          >
            { flag ? 'Not Attorney' : 'Is Attorney' } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
