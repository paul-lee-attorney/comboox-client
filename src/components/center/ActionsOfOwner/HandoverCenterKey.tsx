
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterHandoverCenterKey,
} from '../../../generated';

import { AddrOfRegCenter, HexType } from '../../../scripts/common';
import { BorderColor, Create } from '@mui/icons-material';
import { useState } from 'react';
import { HexParser } from '../../../scripts/common/toolsKit';
import { ActionsOfOwnerProps } from '../ActionsOfOwner';


export function HandoverCenterKey({refreshPage}:ActionsOfOwnerProps) {

  const [ newKeeper, setNewKeeper ] = useState<HexType>();

  const {
    isLoading: handoverCenterKeyLoading,
    write: handoverCenterKey
  } = useRegCenterHandoverCenterKey({
    address: AddrOfRegCenter,
    args: newKeeper ? [newKeeper] : undefined,
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
          label='NewKeeper'
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ newKeeper }
          onChange={e => setNewKeeper( HexParser( e.target.value ))}
        />

        <Button 
          disabled={ handoverCenterKeyLoading } 
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
