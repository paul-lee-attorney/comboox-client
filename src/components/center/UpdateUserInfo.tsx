
import { Button, Paper, Stack, TextField, Toolbar } from '@mui/material';

import { 
  useRegCenterSetBackupKey
} from '../../generated';

import { AddrOfRegCenter, HexType } from '../../interfaces';
import { BorderColor, Create } from '@mui/icons-material';
import { useState } from 'react';

interface SetBackupKeyProps {
  getUser: () => void,
}

export function SetBackupKey({ getUser }:SetBackupKeyProps) {

  const [ key, setKey ] = useState<HexType>();

  // const { config: setBackupKeyConfig } = usePrepareRegCenterSetBackupKey({
  //   address: AddrOfRegCenter,
  //   args: key ? [key] : undefined,
  // })  

  const {
    isLoading: setBackupKeyLoading,
    write: setBackupKey
  } = useRegCenterSetBackupKey({
    address: AddrOfRegCenter,
    args: key ? [key] : undefined,
    onSuccess() {
      getUser();
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Toolbar sx={{ color:'black' }} >
        <h4>Set Backup Key</h4>
      </Toolbar>

      <Stack direction='row' sx={{m:1, p:1, alignItems:'center', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='filled'
          label='BackupKey'
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ key?.substring(2) }
          onChange={e => setKey(`0x${e.target.value ?? ''}`)}
        />

        <Button 
          size='small'
          disabled={ setBackupKeyLoading } 
          onClick={() => {
            setBackupKey?.()
          }}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128 }} 
          endIcon={<BorderColor />}       
        >
          {setBackupKeyLoading ? 'Loading...' : 'Set'}
        </Button>

      </Stack>
    </Paper>
  )
}
