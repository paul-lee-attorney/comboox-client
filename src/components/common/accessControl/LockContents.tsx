
import { 
  Button,
} from '@mui/material';

import { Lock }  from '@mui/icons-material';


import { 
  usePrepareAccessControlLockContents,
  useAccessControlLockContents,
} from '../../../generated';

import { FileHistoryProps } from '../../../interfaces';


export function LockContents({ addr, setNextStep }: FileHistoryProps) {

  const { config } = usePrepareAccessControlLockContents({
    address: addr,
  });

  const {
    isLoading,
    write,
  } = useAccessControlLockContents({
    ...config,
    onSuccess() {
      setNextStep(1);
    }
  });

  return (
    <Button
      disabled={ !write || isLoading }
      sx={{m:1, minWidth:218}}
      variant='contained'
      endIcon={<Lock />}
      onClick={()=>write?.() }
    >
      Lock Contents
    </Button>
  )
}
