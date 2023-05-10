import { useState } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

import { Search, Create } from '@mui/icons-material';


import { AddrZero, ContractProps, HexType } from '../../../interfaces';
import { RulesList } from '../../';

export function DialogSha({ addr }: ContractProps) {

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <Button 
        disabled={ addr === AddrZero }
        sx={{ m: 1, minWidth: 120, height: 40 }} 
        variant="contained" 
        endIcon={ <Create /> }
        onClick={ handleOpen }
        size='small'
      >
        Open_SHA
      </Button>

      <Dialog
        open={ open }
        onClose={ handleClose }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Shareholders Agreement
        </DialogTitle>
        
        <DialogContent >

          {/* <Button
            disabled={ addrOfSha != AddrZero }
            sx={{ m: 1, minWidth: 120, height: 40 }} 
            variant="contained" 
            endIcon={ <Search /> }
            // onClick={  }
            size='small'
          >
            CreateSHA
          </Button> */}


          {/* <DialogContentText id="alert-dialog-description">
            { 'Text inside Dialog' }  
          </DialogContentText> */}

          {/* {open && (<RulesList addr={ addr } />)} */}

        </DialogContent>

        <DialogActions>

          <Button onClick={ handleClose } autoFocus>
            Close
          </Button>

        </DialogActions>
      </Dialog>

    </>
  )
}