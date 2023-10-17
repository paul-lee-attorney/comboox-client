
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
import { FormResults, hasError, refreshAfterTx } from '../../../../scripts/common/toolsKit';

interface AddRuleProps {
  sha: HexType;
  rule: HexType;
  isFinalized: boolean;
  valid: FormResults;
  refresh: ()=>void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddRule({ sha, rule, isFinalized, valid, refresh, setOpen }: AddRuleProps) {

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading,
    write,
  } = useShareholdersAgreementAddRule({
    address: sha,
    args: !hasError(valid) ? [rule] : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return (
    <>
      {!isFinalized && (
        <Stack direction='row' sx={{m:1, mr:5, p:1, alignItems:'center', justifyItems:'center'}}>
          
          <Button 
            disabled = { isLoading || isFinalized || hasError(valid) }
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
