
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterSetBackupKey
} from '../../../generated';

import { AddrOfRegCenter, HexType } from '../../../scripts/common';
import { BorderColor } from '@mui/icons-material';
import { useState } from 'react';
import { HexParser } from '../../../scripts/common/toolsKit';
import { ActionsOfUserProps } from '../ActionsOfUser';


export function SetBackupKey({ refreshList, getUser }:ActionsOfUserProps) {

  const [ key, setKey ] = useState<HexType>();

  const {
    isLoading: setBackupKeyLoading,
    write: setBackupKey
  } = useRegCenterSetBackupKey({
    address: AddrOfRegCenter,
    args: key ? [key] : undefined,
    onSuccess() {
      getUser();
      refreshList();
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'stretch', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='outlined'
          label='BackupKey'
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ key }
          onChange={e => setKey( HexParser( e.target.value ))}
        />

        <Button 
          disabled={ setBackupKeyLoading } 
          onClick={() => {
            setBackupKey?.()
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
