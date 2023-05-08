import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

import { useContract, useSigner } from 'wagmi';

import { regCenterABI } from '../../generated';

import { AddrOfRegCenter } from '../../interfaces';

import { RegUser } from './RegUser';

type CloseDialogFuncType = () => void; 

type DialogType = {
  flag: boolean,
  closeDialog: CloseDialogFuncType,
}

export function DialogMyUserNo({flag, closeDialog}: DialogType) {
  const [userNo, setUserNo] = useState('');
  
  const { data: signer } = useSigner();
  const rc = useContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
  });

  // const { config } = usePrepareRegCenterRegUser({
  //   address: AddrOfRegCenter,
  // });
  // const { write: regUser } = useRegCenterRegUser(config); 

  useEffect(() => {
    if (signer && rc) {
      let temp = rc.connect(signer);
      temp.getMyUserNo().then(num => setUserNo(num.toString(16).padStart(10, '0')))
    }
  });

  return (
    <div>

      <Dialog
        open={ flag }
        onClose={ closeDialog }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"User Number Of Account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { userNo }
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          {userNo === '0000000000' && (
            <RegUser closeDialog={closeDialog} />
          )}

          <Button onClick={ closeDialog } autoFocus>
            Close
          </Button>

        </DialogActions>
      </Dialog>

    </div>
  )


}