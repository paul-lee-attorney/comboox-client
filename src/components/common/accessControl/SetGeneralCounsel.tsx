
import { useEffect, useState } from 'react';

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

import { HexType } from '../../../scripts/common';
import { ATTORNEYS, getGeneralCounsel } from '../../../scripts/common/accessControl';
import { HexParser } from '../../../scripts/common/toolsKit';
import { AccessControlProps } from './SetOwner';

export function SetGeneralCounsel({ addr }: AccessControlProps) {

  const [ newGC, setNewGC ] = useState<HexType>();
  const [ open, setOpen ] = useState(false);

  const [gc, setGC] = useState<HexType>();

  const {
    isLoading: setGeneralCounselLoading,
    write: setGeneralCounsel,
  } = useAccessControlSetRoleAdmin({
    address: addr,
    args: gc ? [ ATTORNEYS, gc] : undefined,
  });

  useEffect(()=>{
    if (addr) {
      getGeneralCounsel(addr).then(
        res => {
          setNewGC(res);
          setOpen(true);
        }
      )
    }
  }, [addr, setGeneralCounsel])

  // const {
  //   refetch: getGC
  // } = useAccessControlGetRoleAdmin({
  //   address: addr,
  //   args: [ ATTORNEYS ],
  //   onSuccess(gc) {
  //     setNewGC(gc);
  //     setOpen(true);
  //   }
  // })

  const handleClick = () => {
    setGeneralCounsel?.();
  }

  return (
    <>
      <Stack direction={'row'} >

        <FormControl sx={{ m: 1, width: "50%" }} variant="outlined">
          <InputLabel htmlFor="setGC-input">SetGeneralCounsel</InputLabel>
          <OutlinedInput
            id="setGC-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disabled={ setGeneralCounselLoading || gc == undefined || gc == '0x' }
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
            onChange={(e) => setGC( HexParser(e.target.value) )}
            value={ gc }
          />
        </FormControl>

        <Collapse in={open} sx={{ width:"50%" }} >        
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
            General Counsel: { newGC?.substring(0, 6) + '...' + newGC?.substring(38, 42) } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
