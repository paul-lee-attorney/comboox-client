
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterTransferOwnership
} from '../../../generated';

import { AddrOfRegCenter, HexType } from '../../../interfaces';
import { BorderColor, Create } from '@mui/icons-material';
import { useState } from 'react';
import { HexParser } from '../../../scripts/toolsKit';
import { ActionsOfOwnerProps } from '../ActionsOfOwner';


export function TransferOwnership({refreshPage}:ActionsOfOwnerProps) {

  const [ newOwner, setNewOwner ] = useState<HexType>();

  const {
    isLoading: transferOwnershipLoading,
    write: transferOwnership
  } = useRegCenterTransferOwnership({
    address: AddrOfRegCenter,
    args: newOwner ? [newOwner] : undefined,
    onSuccess() {
      refreshPage();
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'stretch', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='outlined'
          label='NewOwner'
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ newOwner }
          onChange={e => setNewOwner( HexParser( e.target.value ))}
        />

        <Button 
          disabled={ transferOwnershipLoading } 
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
