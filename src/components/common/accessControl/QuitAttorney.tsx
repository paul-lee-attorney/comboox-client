
import { useState } from 'react';

import { 
  Stack,
  Alert,
  Collapse,
  IconButton,
  Button,
} from '@mui/material';

import { Skateboarding, Close, }  from '@mui/icons-material';

import { 
  useAccessControlRenounceRole,
} from '../../../generated';

import { HexType } from '../../../scripts/common';
import { AccessControlProps } from './SetOwner';

const ATTORNEYS:HexType = `0x${'4174746f726e657973' + '0'.padEnd(46, '0')}`;

export function QuitAttorney({ addr }: AccessControlProps) {

  const [ flag, setFlag ] = useState(false);
  const [ open, setOpen ] = useState(false);

  const {
    isLoading,
    write,
  } = useAccessControlRenounceRole({
    address: addr,
    args: [ATTORNEYS],
    onSuccess() {
      setFlag(true);
      setOpen(true);
    }
  });


  const handleClick = () => {
    write?.();
  }

  return (
    <>
      <Stack direction={'row'}  sx={{ width: '100%' }} >

        <Button
          disabled={ isLoading }
          sx={{m:1, width: '50%', height:55}}
          variant='outlined'
          endIcon={<Skateboarding />}
          onClick={ handleClick }
        >
          Quit Attorney
        </Button>

        <Collapse in={open} sx={{width:'50%'}}>        
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
            severity={ flag ? "warning" : "success" } 
            sx={{ height: 55,  m: 1, }} 
          >
            { flag ? 'Not Attorney' : 'Is Attorney' } 
          </Alert>
        </Collapse>

      </Stack>
    </> 
  )
}
