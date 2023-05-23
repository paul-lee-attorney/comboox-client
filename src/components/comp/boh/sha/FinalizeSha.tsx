
import { 
  Button,
} from '@mui/material';

import { Lock }  from '@mui/icons-material';


import { 
  usePrepareAccessControlLockContents,
  useAccessControlLockContents,
} from '../../../../generated';

import { FileHistoryProps } from '../../../../interfaces';


export function FinalizeSha({ addr, setActiveStep }: FileHistoryProps) {

  const { config } = usePrepareAccessControlLockContents({
    address: addr,
  });

  const {
    isLoading,
    write,
  } = useAccessControlLockContents({
    ...config,
    onSuccess() {
      setActiveStep(1);
    }
  });

  return (
    <Button
      disabled={ !write || isLoading }
      sx={{m:1, minWidth:218}}
      variant='outlined'
      endIcon={<Lock />}
      onClick={()=>write?.() }
    >
      Finalize
    </Button>
  )
}
