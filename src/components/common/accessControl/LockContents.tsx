
import { 
  Button,
} from '@mui/material';

import { Lock }  from '@mui/icons-material';


import { 
  useAccessControlLockContents,
} from '../../../generated';
import { HexType } from '../../../scripts/common';
import { refreshAfterTx } from '../../../scripts/common/toolsKit';

interface LockContentsProps {
  addr: HexType;
  setIsFinalized: (flag: boolean) => void;
  setNextStep: (step:number) => void;
}

export function LockContents({ addr, setIsFinalized, setNextStep }: LockContentsProps) {

  const refresh = ()=>{
    setIsFinalized(true);
    setNextStep(1);
  }

  const {
    isLoading: lockContentsLoading,
    write: lockContents,
  } = useAccessControlLockContents({
    address: addr,
    onSuccess(data) {
      let hash:HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (
    <Button
      disabled={ lockContentsLoading }
      sx={{m:1, minWidth:128}}
      variant='contained'
      endIcon={<Lock />}
      onClick={()=>lockContents?.() }
    >
      Lock Contents
    </Button>
  )
}
