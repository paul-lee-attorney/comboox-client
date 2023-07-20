
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
  useAccessControlGetRoleAdmin,
  useAccessControlSetRoleAdmin,
} from '../../../generated';

import { ContractProps, HexType } from '../../../interfaces';
import { ATTORNEYS } from '../../../queries/accessControl';

export function SetGeneralCounsel({ addr }: ContractProps) {

  const [ newGC, setNewGC ] = useState<HexType>();
  const [ open, setOpen ] = useState(false);

  const {
    refetch: getGC
  } = useAccessControlGetRoleAdmin({
    address: addr,
    args: [ ATTORNEYS ],
    onSuccess(gc) {
      setNewGC(gc);
      setOpen(true);
    }
  })

  const [gc, setGC] = useState<HexType>();

  const {
    isLoading: setRoleAdminLoading,
    write: setRoleAdmin,
  } = useAccessControlSetRoleAdmin({
    address: addr,
    args: gc ? [ ATTORNEYS, gc] : undefined,
    onSuccess() {
      getGC()
    }
  });


  const handleClick = () => {
    setRoleAdmin?.();
  }

  // useEffect(() => { 
  //   getGeneralCounsel(addr).then(gc => {
  //     setNewGC(gc);
  //     setOpen(true);
  //   });
  // }, [setRoleAdmin, addr]);

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
                  disabled={ setRoleAdminLoading || gc == undefined || gc == '0x' }
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
            value={ gc?.substring(2) }
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
