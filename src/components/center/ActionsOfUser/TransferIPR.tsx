
import { Alert, Button, Collapse, IconButton, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterSetRoyaltyRule, useRegCenterTransferIpr
} from '../../../generated';

import { AddrOfRegCenter } from '../../../scripts/common';
import { BorderColor, Close } from '@mui/icons-material';
import { useState } from 'react';
import { Key, codifyRoyaltyRule, defaultKey } from '../../../scripts/center/rc';
import { ActionsOfUserProps } from '../ActionsOfUser';
import { getReceipt } from '../../../scripts/common/common';
import { longSnParser } from '../../../scripts/common/toolsKit';

export function TransferIPR() {

  const [ typeOfDoc, setTypeOfDoc ] = useState<string>('0');
  const [ version, setVersion ] = useState<string>('0');
  const [ transferee, setTransferee ] = useState<string>('0');

  const [ receipt, setReceipt ] = useState<string>('');
  const [ open, setOpen ] = useState<boolean>(false);

  const {
    isLoading: transferIPRLoading,
    write: transferIPR
  } = useRegCenterTransferIpr({
    address: AddrOfRegCenter,
    args: [ BigInt(typeOfDoc), 
            BigInt(version),
            BigInt(transferee)],
    onSuccess(data:any) {
      getReceipt(data.hash).then(
        r => {
          if (r) {
            let rType = BigInt(r.logs[0].topics[1]).toString();
            let rVersion = BigInt(r.logs[0].topics[2]).toString();
            let rTransferee = BigInt(r.logs[0].topics[3]).toString();

            let str = 'IPR of Doc (type:' + rType + ', version:' + rVersion 
              + ') is transferred to User:' +  longSnParser(rTransferee);

            setReceipt(str);
            setOpen(true);
          }
        }
      )
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          size="small"
          variant='outlined'
          label='TypeOfDoc'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ typeOfDoc }
          onChange={e => setTypeOfDoc(e.target.value ?? '0')}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='Version'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ version }
          onChange={e => setVersion(e.target.value ?? '0')}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='Transferee'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ transferee }
          onChange={e => setTransferee(e.target.value ?? '0')}
        />

        <Button 
          disabled={ transferIPRLoading } 
          onClick={() => transferIPR?.()}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128, height:40 }} 
          endIcon={<BorderColor />}
        >
          Transfer
        </Button>

        <Collapse in={ open } sx={{ m:1 }} >
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

            variant="outlined" 
            severity='info' 
            sx={{ height: 45, p:0.5 }} 
          >
            {receipt}
          </Alert>          
        </Collapse>

      </Stack>
    </Paper>
  )
}