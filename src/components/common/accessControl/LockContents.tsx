
import { useState } from 'react';

import { 
  Stack,
  Alert,
  Collapse,
  IconButton,
  Button,
} from '@mui/material';

import { Close, DoneOutline }  from '@mui/icons-material';

import { readContract } from '@wagmi/core';

import { 
  accessControlABI,
  usePrepareAccessControlLockContents,
  useAccessControlLockContents,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';


export function LockContents({ addr }: ContractProps) {

  const { config } = usePrepareAccessControlLockContents({
    address: addr,
  });

  const [ open, setOpen ] = useState(true);

  const {
    isLoading,
    write,
  } = useAccessControlLockContents({
    ...config,
    onSuccess() {
      setOpen(false);      
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
          endIcon={<DoneOutline />}
          onClick={ handleClick }
        >
          Lock Contents
        </Button>

        <Collapse in={open} sx={{width:280 }}>        
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
            sx={{ height: 55,  m: 1, }} 
          >
            Drafting
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
