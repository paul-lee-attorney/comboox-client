
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

import { HexType } from '../../../scripts/common';
import { getOwner } from '../../../scripts/common/accessControl';
import { HexParser } from '../../../scripts/common/toolsKit';

export interface AccessControlProps{
  addr: HexType;
}

export function SetOwner({ addr }: AccessControlProps) {
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
    <Stack direction={'row'}  sx={{ width: '100%' }} >

      <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
        <InputLabel htmlFor="setOwner-input">SetOwner</InputLabel>
        <OutlinedInput
          id="setOwner-input"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                color="primary"
                disabled={ owner == undefined || owner == '0x' || isLoading }
                onClick={ handleClick }
                edge="end"
              >
                <Approval />
              </IconButton>
            </InputAdornment>
          }
          label='SetOwner'
          sx={{ height:55 }}
          onChange={(e) => setOwner( HexParser(e.target.value) )}
          value={ owner }
        />
      </FormControl>

      <Collapse in={open} sx={{ width:'50%' }}>        
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
          Owner: { newOwner?.substring(0, 6) + '...' + newOwner?.substring(38, 42) } 
        </Alert>
      </Collapse>

    </Stack>
  )
}
