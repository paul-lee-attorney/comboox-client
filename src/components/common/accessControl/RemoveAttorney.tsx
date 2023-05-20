
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

import { Approval, Close, EditNote, PersonRemove }  from '@mui/icons-material';

import { readContract } from '@wagmi/core';

import { 
  accessControlABI,
  usePrepareAccessControlRevokeRole,
  useAccessControlRevokeRole,
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

export function RemoveAttorney({ addr }: ContractProps) {

  const [acct, setAcct] = useState<string>();

  const { config } = usePrepareAccessControlRevokeRole({
    address: addr,
    args: acct ? [ATTORNEYS, BigNumber.from(acct)] : undefined,
  });

  const {
    data,
    isLoading,
    write,
  } = useAccessControlRevokeRole(config);

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
          <InputLabel htmlFor="setAcct-input">RemoveAttorney</InputLabel>
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
                  <PersonRemove />
                </IconButton>
              </InputAdornment>
            }
            label='RemoveAttorney'
            onChange={(e) => setAcct(e.target.value)}
          />
        </FormControl>

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

            severity={ flag ? "success" : "warning" }
            variant='outlined' 
            sx={{ height: 55,  m: 1, }} 
          >
            { flag ? 'Is Attorney' : 'Not Attorney' } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
