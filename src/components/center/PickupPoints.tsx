
import { Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterPickupPoints,
} from '../../generated';

import { AddrOfRegCenter, HexType } from '../../scripts/common';
import { Redo } from '@mui/icons-material';
import { useState } from 'react';
import { refreshAfterTx } from '../../scripts/common/toolsKit';
import { LoadingButton } from '@mui/lab';

interface PickupPointsProps{
  hashLock: HexType;
  refreshList: ()=>void;
  getUser: ()=>void;
  setOpen: (flag: boolean)=>void;
}

export function PickupPoints({hashLock, refreshList, getUser, setOpen}:PickupPointsProps) {

  const [ hashKey, setHashKey ] = useState<string>();
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refreshList();
    getUser();
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: pickupPointsLoading,
    write: pickupPoints
  } = useRegCenterPickupPoints({
    address: AddrOfRegCenter,
    args: hashKey ? [hashLock, hashKey] : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >    
      <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='filled'
          label='HashKey'
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ hashKey }
          onChange={e => setHashKey(e.target.value)}
        />

        <LoadingButton 
          size='small'
          disabled={ pickupPointsLoading } 
          loading={loading}
          loadingPosition='end'
          onClick={() => {
            pickupPoints?.()
          }}
          variant='contained'
          sx={{ m:1, minWidth:128 }} 
          endIcon={<Redo />}       
        >
          Pickup Points
        </LoadingButton>

      </Stack>

    </Paper>
  )
}
