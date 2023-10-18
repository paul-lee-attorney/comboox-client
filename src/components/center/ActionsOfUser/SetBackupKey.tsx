
import { Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterSetBackupKey
} from '../../../generated';

import { AddrOfRegCenter, AddrZero, HexType } from '../../../scripts/common';
import { BorderColor } from '@mui/icons-material';
import { useState } from 'react';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { ActionsOfUserProps } from '../ActionsOfUser';
import { LoadingButton } from '@mui/lab';


export function SetBackupKey({ refreshList, getUser }:ActionsOfUserProps) {

  const [ key, setKey ] = useState<HexType>(AddrZero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    getUser();
    refreshList();
    setLoading(false);
  }

  const {
    isLoading: setBackupKeyLoading,
    write: setBackupKey
  } = useRegCenterSetBackupKey({
    address: AddrOfRegCenter,
    args: !hasError(valid) ? [key] : undefined,
    onSuccess(data) {
      setLoading(true);
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
          label='BackupKey'
          error={ valid['BackupKey']?.error }
          helperText={ valid['BackupKey']?.helpTx }                    
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ key }
          onChange={e => {
            let input = HexParser( e.target.value );
            onlyHex('BackupKey', input, 40, setValid);
            setKey(input);
          }}
        />

        <LoadingButton 
          disabled={ setBackupKeyLoading || hasError(valid) } 
          loading={loading}
          loadingPosition='end'
          onClick={() => {
            setBackupKey?.()
          }}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128 }} 
          endIcon={<BorderColor />}       
        >
          Set
        </LoadingButton>

      </Stack>
    </Paper>
  )
}
