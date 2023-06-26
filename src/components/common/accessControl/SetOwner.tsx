
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

import { Approval, Close, EditNote }  from '@mui/icons-material';

import { readContract } from '@wagmi/core';

import { 
  accessControlABI,
  usePrepareAccessControlSetOwner,
  useAccessControlSetOwner,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { BigNumber } from 'ethers';
import { getOwner } from '../../../queries/accessControl';

export function SetOwner({ addr }: ContractProps) {
  const [owner, setOwner] = useState<string>();

  const { config } = usePrepareAccessControlSetOwner({
    address: addr,
    args: owner ? [BigNumber.from(owner)] : undefined,
  });

  const {
    data,
    isLoading,
    write,
  } = useAccessControlSetOwner(config);

  const [ newOwner, setNewOwner ] = useState<number>();
  const [ open, setOpen ] = useState(false);

  const handleClick = () => {
    write?.();
  }

  useEffect(() => { 
    getOwner(addr).then(owner => {
      setNewOwner(owner);
      setOpen(true);
    });
  }, [data, addr]);

  return (
    <>
      <Stack direction={'row'}  sx={{ width: '100%' }} >

        <FormControl sx={{ m: 1, width: 250 }} variant="outlined">
          <InputLabel htmlFor="setOwner-input">SetOwner</InputLabel>
          <OutlinedInput
            id="setOwner-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  disabled={ !write || isLoading}
                  onClick={ handleClick }
                  edge="end"
                >
                  <Approval />
                </IconButton>
              </InputAdornment>
            }
            label='SetOwner'
            sx={{ height:55 }}
            onChange={(e) => setOwner(e.target.value)}
          />
        </FormControl>

        <Collapse in={open} sx={{ width:280 }}>        
          <Alert 
            action={
              <IconButton
                aria-label="close"
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
            sx={{ m:1, height:55 }} 
          >
            Owner : { newOwner } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
