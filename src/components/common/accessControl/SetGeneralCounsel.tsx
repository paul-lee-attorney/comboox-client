
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
  useAccessControlSetRoleAdmin,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { getGeneralCounsel } from '../../../queries/accessControl';
import { ATTORNEYS } from './RemoveAttorney';

export function SetGeneralCounsel({ addr }: ContractProps) {
  const [gc, setGC] = useState<HexType>();

  const {
    isLoading: setRoleAdminLoading,
    write: setRoleAdmin,
  } = useAccessControlSetRoleAdmin({
    address: addr,
    args: gc ? [ ATTORNEYS, gc] : undefined,    
  });

  const [ newGC, setNewGC ] = useState<HexType>();
  const [ open, setOpen ] = useState(false);

  const handleClick = () => {
    setRoleAdmin?.();
  }

  useEffect(() => { 
    getGeneralCounsel(addr).then(gc => {
      setNewGC(gc);
      setOpen(true);
    });
  }, [setRoleAdmin, addr]);

  return (
    <>
      <Stack direction={'row'} >

        <FormControl sx={{ m: 1, width: 550 }} variant="outlined">
          <InputLabel htmlFor="setGC-input">SetGeneralCounsel</InputLabel>
          <OutlinedInput
            id="setGC-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disabled={ setRoleAdminLoading || !gc }
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
            onChange={(e) => setGC(`0x${e.target.value}`)}
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
