
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

import { 
  useAccessControlSetGeneralCounsel,
} from '../../../generated';

import { waitForTransaction } from '@wagmi/core';
import { ContractProps, HexType } from '../../../interfaces';
import { getGeneralCounsel } from '../../../queries/accessControl';

export function SetGeneralCounsel({ addr }: ContractProps) {
  const [gc, setGC] = useState<string>();

  // const { config } = usePrepareAccessControlSetGeneralCounsel({
  //   address: addr,
  //   args: gc ? [BigInt(gc)] : undefined,
  // });

  const {
    data,
    isSuccess,
    isLoading,
    write,
  } = useAccessControlSetGeneralCounsel({
    address: addr,
    args: gc ? [BigInt(gc)] : undefined,    
  });

  const [ newGC, setNewGC ] = useState<number>();
  const [ open, setOpen ] = useState(false);

  const handleClick = () => {
    write?.();
  }

  useEffect(() => { 
    getGeneralCounsel(addr).then(gc => {
      setNewGC(gc);
      setOpen(true);
    });
  }, [data, addr]);

  return (
    <>
      <Stack direction={'row'} >

        <FormControl sx={{ m: 1, width: 250 }} variant="outlined">
          <InputLabel htmlFor="setGC-input">SetGeneralCounsel</InputLabel>
          <OutlinedInput
            id="setGC-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disabled={ isLoading }
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
            onChange={(e) => setGC(e.target.value)}
          />
        </FormControl>

        <Collapse in={open} sx={{ width:280 }} >        
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
            General Counsel: { newGC } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
