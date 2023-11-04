
import { Paper, Stack, TextField } from '@mui/material';

import { useFuleTankSetOwner, useFuleTankSetRegCenter } from '../../../../generated';

import { AddrOfTank, AddrZero, HexType } from '../../../../scripts/common';
import { ManageAccountsOutlined, SettingsOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from '../../../../scripts/common/toolsKit';
import { LoadingButton } from '@mui/lab';
import { useComBooxContext } from '../../../../scripts/common/ComBooxContext';
import { ActionOfUserProps } from '../ActionsOfUser';

export function SetRegCenter({ refresh }: ActionOfUserProps) {

  const { setErrMsg } = useComBooxContext();

  const [ addr, setAddr ] = useState(AddrZero);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [loading, setLoading] = useState(false);

  const updateResults = ()=> {
    refresh();
    setLoading(false);
  }

  const {
    isLoading: setRegCenterLoading,
    write: setRegCenter
  } = useFuleTankSetRegCenter({
    address: AddrOfTank,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  })

  const setRegCenterClick = ()=>{
    setRegCenter({
      args:[ addr ]
    });
  }

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'start', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='outlined'
          label='RegCenter (Addr)'
          error={ valid['RegCenter(Addr)']?.error }
          helperText={ valid['RegCenter(Addr)']?.helpTx ?? ' ' }                                  
          sx={{
            m:1,
            minWidth: 550,
          }}
          value={ addr }
          onChange={e => {
            let input = HexParser(e.target.value ?? '0');
            onlyHex('RegCenter(Addr)', input, 40, setValid);
            setAddr(input);
          }}
        />

        <LoadingButton
          disabled={ setRegCenterLoading || hasError(valid) } 
          loading={loading}
          loadingPosition='end'
          onClick={ setRegCenterClick }
          variant='contained'
          sx={{ m:1, mx:2, minWidth:128 }} 
          endIcon={<SettingsOutlined />}
        >
          Set
        </LoadingButton>

      </Stack>
    </Paper>
  )
}
