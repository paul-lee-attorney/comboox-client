
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

import { Approval, Close }  from '@mui/icons-material';

import { 
  useAccessControlSetOwner,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { getOwner } from '../../../queries/accessControl';

export function SetOwner({ addr }: ContractProps) {
  const [owner, setOwner] = useState<HexType>();

  const {
    data,
    isLoading,
    write,
  } = useAccessControlSetOwner({
    address: addr,
    args: owner ? [ owner ] : undefined,    
  });

  const [ newOwner, setNewOwner ] = useState<HexType>();
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

        <FormControl sx={{ m: 1, width: 550 }} variant="outlined">
          <InputLabel htmlFor="setOwner-input">SetOwner</InputLabel>
          <OutlinedInput
            id="setOwner-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  disabled={ isLoading}
                  onClick={ handleClick }
                  edge="end"
                >
                  <Approval />
                </IconButton>
              </InputAdornment>
            }
            label='SetOwner'
            sx={{ height:55 }}
            onChange={(e) => setOwner(`0x${e.target.value}`)}
          />
        </FormControl>

        <Collapse in={open} sx={{ width:218 }}>        
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
