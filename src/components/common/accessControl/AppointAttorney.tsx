
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

import { Approval, Close, EditNote, PersonAdd }  from '@mui/icons-material';

import { readContract } from '@wagmi/core';

import { 
  accessControlABI,
  usePrepareAccessControlGrantRole,
  useAccessControlGrantRole,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { BigNumber } from 'ethers';

const ATTORNEYS:HexType = `0x${'4174746f726e657973' + '0'.padEnd(46, '0')}`;

async function isAttorney(addr: HexType, acct: string): Promise<boolean> {
  let flag = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'hasRole',
    args: [ATTORNEYS, BigNumber.from(acct)],
  });

  return flag;
}

export function AppointAttorney({ addr }: ContractProps) {

  const [acct, setAcct] = useState<string>();

  const { config } = usePrepareAccessControlGrantRole({
    address: addr,
    args: acct ? [ATTORNEYS, BigNumber.from(acct)] : undefined,
  });

  const {
    data,
    isLoading,
    write,
  } = useAccessControlGrantRole(config);

  const [ flag, setFlag ] = useState<boolean>();
  const [ open, setOpen ] = useState(false);

  const handleClick = () => {
    write?.();
  }

  useEffect(() => {
    if (acct) 
      isAttorney(addr, acct).then(flag => {
        setFlag(flag);
        setOpen(true);
      });
  }, [data, addr, acct]);

  return (
    <>
      <Stack direction={'row'}  sx={{ width: '100%' }} >

        <FormControl sx={{ m: 1, width: 250 }} variant="outlined">
          <InputLabel htmlFor="setAcct-input">AppointAttorney</InputLabel>
          <OutlinedInput
            id="setAcct-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color='primary'
                  disabled={ !write || isLoading }
                  onClick={ handleClick }
                  edge="end"
                >
                  <PersonAdd />
                </IconButton>
              </InputAdornment>
            }
            label='AppointAttorney'
            onChange={(e) => setAcct(e.target.value)}
          />
        </FormControl>

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
            { flag ? 'Is Attorney' : 'Not' } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
