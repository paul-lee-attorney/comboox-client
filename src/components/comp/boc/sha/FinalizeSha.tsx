
import { 
  Button,
} from '@mui/material';

import { Lock, StopCircleOutlined }  from '@mui/icons-material';


import { 
  useAccessControlLockContents, useShareholdersAgreementFinalizeSha,
} from '../../../../generated';
import { HexType } from '../../../../interfaces';
import { Dispatch, SetStateAction } from 'react';

interface FinalizeShaProps {
  addr: HexType;
  setIsFinalized: Dispatch<SetStateAction<boolean>>;
  setNextStep: Dispatch<SetStateAction<number>>;
}

export function FinalizeSha({ addr, setIsFinalized, setNextStep }: FinalizeShaProps) {

  const {
    isLoading,
    write,
  } = useShareholdersAgreementFinalizeSha({
    address: addr,
    onSuccess() {
      setIsFinalized(true);
      setNextStep(1);
    }
  });

  return (
    <Button
      disabled={ isLoading }
      sx={{m:1, minWidth:218}}
      variant='contained'
      endIcon={<StopCircleOutlined />}
      onClick={()=>write?.() }
    >
      Finalize
    </Button>
  )
}
