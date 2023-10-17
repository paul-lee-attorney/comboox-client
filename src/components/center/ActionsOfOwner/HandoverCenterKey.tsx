
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterHandoverCenterKey,
} from '../../../generated';

import { AddrOfRegCenter, AddrZero, HexType } from '../../../scripts/common';
import { BorderColor, } from '@mui/icons-material';
import { useState } from 'react';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { ActionsOfOwnerProps } from '../ActionsOfOwner';


export function HandoverCenterKey({refresh}:ActionsOfOwnerProps) {

  const [ newKeeper, setNewKeeper ] = useState<HexType>(AddrZero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: handoverCenterKeyLoading,
    write: handoverCenterKey
  } = useRegCenterHandoverCenterKey({
    address: AddrOfRegCenter,
    args: hasError(valid) ? undefined : [newKeeper],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'start', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='outlined'
          label='NewKeeper'
          error={ valid['NewKeeper']?.error }
          helperText={ valid['NewKeeper']?.helpTx }
          sx={{
            m:1,
            mb:3,
            minWidth: 456,
          }}
          value={ newKeeper }
          onChange={e => {
            let input = HexParser( e.target.value );
            onlyHex('NewKeeper', input, 40, setValid);
            setNewKeeper( input );
          }}
        />

        <Button 
          disabled={ handoverCenterKeyLoading || hasError(valid) } 
          onClick={() => {
            handoverCenterKey?.()
          }}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128 }} 
          endIcon={<BorderColor />}       
        >
          Set
        </Button>

      </Stack>
    </Paper>
  )
}
