
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

import { Close, EditNote }  from '@mui/icons-material';

import { readContract } from '@wagmi/core';

import { 
  accessControlABI,
  usePrepareAccessControlSetGeneralCounsel,
  useAccessControlSetGeneralCounsel,
} from '../../../generated';

import { waitForTransaction } from '@wagmi/core';
import { ContractProps, HexType } from '../../../interfaces';
import { BigNumber } from 'ethers';

async function getGC(addr: HexType): Promise<number> {
  let gc = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'getGeneralCounsel',
  });

  return gc;
}

async function getReceipt(hash: HexType): Promise<string> {
  const receipt = await waitForTransaction({
    hash: hash
  });

  let gc = '';

  if (receipt) {
    gc = parseInt(receipt.logs[0].topics[1], 16).toString();
  }

  return gc;
}

export function SetGeneralCounsel({ addr }: ContractProps) {
  const [gc, setGC] = useState<string>();

  const { config } = usePrepareAccessControlSetGeneralCounsel({
    address: addr,
    args: gc ? [BigNumber.from(gc)] : undefined,
  });

  const {
    data,
    isSuccess,
    isLoading,
    write,
  } = useAccessControlSetGeneralCounsel(config);

  const [ newGC, setNewGC ] = useState<number>();
  const [ open, setOpen ] = useState(false);

  const handleClick = () => {
    write?.();
  }

  useEffect(() => {
    if (data) 
      getGC(addr).then(gc => {
        setNewGC(gc);
        setOpen(true);
      });
  }, [data, addr]);

  return (
    <>
      <Stack direction={'row'}  >

        <FormControl sx={{ m: 1, width: 250 }} variant="outlined">
          <InputLabel htmlFor="setGC-input">SetGeneralCounsel</InputLabel>
          <OutlinedInput
            id="setGC-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={ handleClick }
                  edge="end"
                >
                  <EditNote />
                </IconButton>
              </InputAdornment>
            }
            label='SetGeneralCounsel'
            onChange={(e) => setGC(e.target.value)}
          />
        </FormControl>

        <Collapse in={open}>        
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
