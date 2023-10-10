
import { 
  Stack,
  Button,
} from '@mui/material';
import { EditNote }  from '@mui/icons-material';
import { 
  useShareholdersAgreementAddRule,
} from '../../../../generated';
import { HexType } from '../../../../scripts/common';
import { Dispatch, SetStateAction } from 'react';

interface AddRuleProps {
  sha: HexType;
  rule: HexType;
  isFinalized: boolean;
  setTime: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddRule({ sha, rule, isFinalized, setTime, setOpen }: AddRuleProps) {

  const {
    isLoading,
    write,
  } = useShareholdersAgreementAddRule({
    address: sha,
    args: [rule],
    onSuccess() {
      setTime(Date.now());
      setOpen(false);
    }
  });

  return (
    <>
      {!isFinalized && (
        <Stack direction='row' sx={{m:1, mr:5, p:1, alignItems:'center', justifyItems:'center'}}>
          
          <Button 
            disabled = { isLoading || isFinalized }
            sx={{ m: 1, minWidth: 120, height: 40 }} 
            variant="contained" 
            endIcon={<EditNote />}
            onClick={()=> write?.()}
            size='small'
          >
            Update
          </Button>

        </Stack>
      )}
    </>
  )
}
