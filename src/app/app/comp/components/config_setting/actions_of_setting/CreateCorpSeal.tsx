
import { Dispatch, SetStateAction, useState } from "react";

import { Paper, Stack, } from "@mui/material";
import { Approval } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";

import { HexType } from "../../../../common";
import { refreshAfterTx } from "../../../../common/toolsKit";

import { useGeneralKeeperCreateCorpSeal } from "../../../../../../../generated";

export interface ConfigSettingProps{
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTime: Dispatch<SetStateAction<number>>;
}

export function CreateCorpSeal({setOpen, setTime}:ConfigSettingProps) {
  const { gk, setErrMsg } = useComBooxContext();

  const [ loading, setLoading ] = useState(false);
  
  const updateResults = ()=>{
    setTime(Date.now());
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: createSealLoading,
    write: createSeal, 
   } = useGeneralKeeperCreateCorpSeal({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >

      <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

        <LoadingButton 
          disabled = { createSealLoading }
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<Approval />}
          onClick={ ()=>createSeal() }
          size='small'
        >
          Create Seal
        </LoadingButton>

      </Stack>

    </Paper>

  );  


}