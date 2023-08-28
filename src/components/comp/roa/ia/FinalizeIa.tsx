
import { 
  Alert,
  Button, Collapse, IconButton, Stack,
} from '@mui/material';

import { Close, StopCircleOutlined }  from '@mui/icons-material';

import { 
  useInvestmentAgreementFinalizeIa,
} from '../../../../generated';

import { HexType } from '../../../../scripts/common';
import { Dispatch, SetStateAction, useState } from 'react';

interface FinalizeIaProps {
  addr: HexType;
  setIsFinalized: Dispatch<SetStateAction<boolean>>;
  setNextStep: Dispatch<SetStateAction<number | undefined>>;
}

export function FinalizeIa({ addr, setIsFinalized, setNextStep }: FinalizeIaProps) {

  const [ flag, setFlag ] = useState<boolean>(false);
  const [ open, setOpen ] = useState(false);

  const {
    isLoading: finalizeIaLoading,
    write: finalizeIa,
  } = useInvestmentAgreementFinalizeIa({
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
        disabled={ finalizeIaLoading }
        sx={{m:1, width:'50%', height:55}}
        variant='outlined'
        endIcon={<StopCircleOutlined />}
        onClick={ () => finalizeIa?.() }
      >
        Finalize Ia
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
