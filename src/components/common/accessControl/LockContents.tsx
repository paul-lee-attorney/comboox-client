
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

import { Close, DoneOutline, EditNote }  from '@mui/icons-material';

import { readContract } from '@wagmi/core';

import { 
  accessControlABI,
  usePrepareAccessControlLockContents,
  useAccessControlLockContents,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { BigNumber } from 'ethers';

async function finalized(addr: HexType): Promise<boolean> {
  let flag = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'finalized',
  });

  return flag;
}

export function LockContents({ addr }: ContractProps) {

  const { config } = usePrepareAccessControlLockContents({
    address: addr,
  });

  const {
    data,
    write,
  } = useAccessControlLockContents(config);

  const [ flag, setFlag ] = useState(false);
  const [ open, setOpen ] = useState(false);

  const handleClick = () => {
    write?.();
  }

  useEffect(() => { 
    finalized(addr).then((flag) => {
      setFlag(flag);
      setOpen(true);
    });
  }, [data, addr]);

  return (
    <>
      <Stack direction={'row'}  sx={{ width: '100%' }} >

        <Button
          sx={{m:1, width: 250, height:55}}
          variant='outlined'
          endIcon={<DoneOutline />}
          onClick={ handleClick }
        >
          Lock Contents
        </Button>

        <Collapse in={open} sx={{width:'35%'}}>        
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
            { flag ? 'Finalized' : 'Pending' } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
