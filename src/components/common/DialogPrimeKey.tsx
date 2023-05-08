import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

import { useAccount } from 'wagmi';

type CloseDialogFuncType = () => void; 

type DialogAcctType = {
  flag: boolean,
  closeDialog: CloseDialogFuncType,
}

export function DialogPrimeKey({flag, closeDialog}: DialogAcctType) {
  const { address } = useAccount();

  return (
    <Dialog
      open={ flag }
      onClose={ closeDialog }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Primary Key of Account"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          { address?.toString() }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={ closeDialog } autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )


}