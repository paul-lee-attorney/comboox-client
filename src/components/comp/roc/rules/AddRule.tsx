
import { Stack } from '@mui/material';
import { EditNote }  from '@mui/icons-material';
import { useShareholdersAgreementAddRule } from '../../../../generated';
import { HexType } from '../../../../scripts/common';
import { Dispatch, SetStateAction, useState } from 'react';
import { FormResults, hasError, refreshAfterTx } from '../../../../scripts/common/toolsKit';
import { LoadingButton } from '@mui/lab';

interface AddRuleProps {
  sha: HexType;
  rule: HexType;
  isFinalized: boolean;
  valid: FormResults;
  refresh: ()=>void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddRule({ sha, rule, isFinalized, valid, refresh, setOpen }: AddRuleProps) {

  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading,
    write,
  } = useShareholdersAgreementAddRule({
    address: sha,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    write({
      args: [rule],
    });
  }

  return (
    <>
      <Stack direction='row' sx={{m:1, mr:5, p:1, alignItems:'center', justifyItems:'center'}}>
        
        <LoadingButton 
          disabled = { isLoading || isFinalized || hasError(valid) }
          loading = {loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<EditNote />}
          onClick={ handleClick }
          size='small'
        >
          Update
        </LoadingButton>

      </Stack>
    </>
  )
}
