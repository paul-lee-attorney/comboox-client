
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterUpdateUserInfo
} from '../../../generated';

import { AddrOfRegCenter } from '../../../interfaces';
import { Update } from '@mui/icons-material';
import { useState } from 'react';
import { codifyUserInfo } from '../../../queries/rc';
import { ActionsOfUserProps } from '../ActionsOfUser';

export function UpdateUserInfo({ refreshList, getUser }:ActionsOfUserProps) {

  const [ info, setInfo ] = useState<string>('');

  const {
    isLoading: updateUserInfoLoading,
    write: updateUserInfo
  } = useRegCenterUpdateUserInfo({
    address: AddrOfRegCenter,
    args: info ? [ codifyUserInfo(info)] : undefined,
    onSuccess() {
      refreshList();
      getUser();
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          size="small"
          variant='outlined'
          label='UserInfo(12 Char)'
          sx={{
            m:1,
            minWidth: 218,
          }}
          value={ info  }
          onChange={e => setInfo(e.target.value)}
        />

        <Button 
          disabled={ updateUserInfoLoading } 
          onClick={() => updateUserInfo?.()}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128, height:40 }} 
          endIcon={<Update />}       
        >
          {updateUserInfoLoading ? 'Loading...' : 'Update'}
        </Button>

      </Stack>
    </Paper>
  )
}
