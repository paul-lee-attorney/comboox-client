
import { 
  Button,
} from '@mui/material';

import { Lock }  from '@mui/icons-material';


import { 
  useAccessControlLockContents,
} from '../../../generated';
import { HexType } from '../../../interfaces';

interface LockContentsProps {
  addr: HexType;
  setIsFinalized: (flag: boolean) => void;
  setNextStep: (step:number) => void;
}

export function LockContents({ addr, setIsFinalized, setNextStep }: LockContentsProps) {

  const {
    isLoading,
    write,
  } = useAccessControlLockContents({
    address: addr,
    onSuccess() {
      setIsFinalized(true);
      setNextStep(1);
    }
  });

  return (
    <Button
      disabled={ isLoading }
      sx={{m:1, minWidth:128}}
      variant='contained'
      endIcon={<Lock />}
      onClick={()=>write?.() }
    >
      Lock Contents
    </Button>
  )
}
