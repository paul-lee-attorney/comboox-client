
import { 
  Alert,
  Button, Collapse, IconButton, Stack,
} from '@mui/material';

import { Close, Lock, StopCircleOutlined }  from '@mui/icons-material';


import { 
  useShareholdersAgreementFinalizeSha,
} from '../../../../../generated';
import { HexType } from '../../../../../scripts/common';
import { Dispatch, SetStateAction, useState } from 'react';

interface FinalizeShaProps {
  isSha: boolean;
  addr: HexType;
  setIsFinalized: Dispatch<SetStateAction<boolean>>;
  setNextStep: Dispatch<SetStateAction<number>>;
}

export function FinalizeSha({ isSha, addr, setIsFinalized, setNextStep }: FinalizeShaProps) {

  const [ flag, setFlag ] = useState<boolean>(false);
  const [ open, setOpen ] = useState(false);

  const {
    isLoading: finalizeShaLoading,
    write: finalizeSha,
  } = useShareholdersAgreementFinalizeSha({
    address: addr,
    onSuccess() {
      setFlag(true);
      setIsFinalized(true);
      setNextStep(1);
    }
  });

  return (
    <Stack direction={'row'}  sx={{ width: '100%' }} >

      <Button
        disabled={ finalizeShaLoading }
        sx={{m:1, width:'50%', height:55}}
        variant='outlined'
        endIcon={<StopCircleOutlined />}
        onClick={ () => finalizeSha?.() }
      >
        Finalize
      </Button>

      <Collapse in={open} sx={{width:"50%"}}>        
        <Alert 
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }

          variant='outlined' 
          severity={ flag ? "success" : "warning"}
          sx={{ height: 55,  m: 1, }} 
        >
          { flag ? 'Is Finalized' : 'Still Pending' } 
        </Alert>
      </Collapse>


    </Stack>
  );
}
