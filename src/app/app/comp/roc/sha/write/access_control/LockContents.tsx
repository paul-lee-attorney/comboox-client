
import { 
  Button,
} from '@mui/material';

import { Lock }  from '@mui/icons-material';


import { 
  useAccessControlLockContents,
} from '../../../../../../../generated';
import { HexType } from '../../../../../read';
import { refreshAfterTx } from '../../../../../read/toolsKit';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useComBooxContext } from '../../../../../_providers/ComBooxContextProvider';

interface LockContentsProps {
  addr: HexType;
  setIsFinalized: (flag: boolean) => void;
  setNextStep: (step:number) => void;
}

export function LockContents({ addr, setIsFinalized, setNextStep }: LockContentsProps) {

  const { setErrMsg } = useComBooxContext();

  const [loading, setLoading] = useState(false);

  const refresh = ()=>{
    setIsFinalized(true);
    setNextStep(1);
    setLoading(false);
  }

  const {
    isLoading: lockContentsLoading,
    write: lockContents,
  } = useAccessControlLockContents({
    address: addr,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (
    <LoadingButton
      disabled={ lockContentsLoading }
      loading={loading}
      loadingPosition='end'
      sx={{m:1, minWidth:128}}
      variant='contained'
      endIcon={<Lock />}
      onClick={()=>lockContents?.() }
    >
      Lock Contents
    </LoadingButton>
  )
}
