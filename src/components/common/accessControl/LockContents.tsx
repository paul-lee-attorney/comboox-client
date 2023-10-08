
import { 
  Button,
} from '@mui/material';

import { Lock }  from '@mui/icons-material';


import { 
  useAccessControlLockContents,
} from '../../../generated';
import { HexType } from '../../../scripts/common';

interface LockContentsProps {
  addr: HexType;
  setIsFinalized: (flag: boolean) => void;
  setNextStep: (step:number) => void;
}

export function LockContents({ addr, setIsFinalized, setNextStep }: LockContentsProps) {

  const {
    isLoading: lockContentsLoading,
    write: lockContents,
  } = useAccessControlLockContents({
    address: addr,
    onSuccess() {
      setIsFinalized(true);
      setNextStep(1);
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
