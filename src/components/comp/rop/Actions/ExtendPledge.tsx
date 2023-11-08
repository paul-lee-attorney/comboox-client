import { useState } from "react";
import { useGeneralKeeperExtendPledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Start } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { HexType, MaxSeqNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function ExtendPledge({pld, setOpen, refresh}:ActionsOfPledgeProps) {

  const { gk, setErrMsg } = useComBooxContext();
  
  const [ days, setDays ] = useState<string>('0');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: extendPledgeLoading,
    write: extendPledge,
  } = useGeneralKeeperExtendPledge({
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
  
  const handleClick = ()=>{
    extendPledge({
      args: [ 
          BigInt(pld.head.seqOfShare), 
          BigInt(pld.head.seqOfPld), 
          BigInt(days)
      ],
    });
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          variant='outlined'
          label='ExtensionDays'
          error={ valid['ExtensionDays']?.error }
          helperText={ valid['ExtensionDays']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('ExtensionDays', input, MaxSeqNo, setValid);
            setDays(input);
          }}
          value={ days }
          size='small'
        />

        <LoadingButton 
          disabled={ extendPledgeLoading || hasError(valid) }
          loading = {loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Start /> }
          onClick={ handleClick }
          size='small'
        >
          Extend
        </LoadingButton>        

      </Stack>
    </Paper>
  );

}


