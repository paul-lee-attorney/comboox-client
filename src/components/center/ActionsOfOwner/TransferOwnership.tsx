
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterTransferOwnership
} from '../../../generated';

import { AddrOfRegCenter, AddrZero, HexType } from '../../../scripts/common';
import { BorderColor } from '@mui/icons-material';
import { useState } from 'react';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { ActionsOfOwnerProps } from '../ActionsOfOwner';


export function TransferOwnership({ refresh }:ActionsOfOwnerProps) {

  const [ newOwner, setNewOwner ] = useState<HexType>(AddrZero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: transferOwnershipLoading,
    write: transferOwnership
  } = useRegCenterTransferOwnership({
    address: AddrOfRegCenter,
    args: newOwner ? [newOwner] : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'stretch', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='outlined'
          label='NewOwner'
          error = { valid['NewOwner']?.error }
          helperText = { valid['NewOwner'].helpTx }
          
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ newOwner }
          onChange={e => {
            let input = HexParser( e.target.value );
            onlyHex('NewOwner', input, 40, setValid);
            setNewOwner(input);
          }}
        />

        <Button 
          disabled={ transferOwnershipLoading || hasError(valid) } 
          onClick={() => {
            transferOwnership?.()
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
