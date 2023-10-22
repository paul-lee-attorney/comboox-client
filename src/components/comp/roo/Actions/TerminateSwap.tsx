import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperTerminateSwap } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";
import { useState } from "react";
import { HexType, MaxSeqNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function TerminateSwap({seqOfOpt, setOpen, refresh}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfSwap, setSeqOfSwap ] = useState<string>('0');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: terminateSwapLoading,
    write: terminateSwap,
  } = useGeneralKeeperTerminateSwap({
    address: gk,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  })

  const handleClick = ()=> {
    terminateSwap({
      args:[ 
        BigInt(seqOfOpt), 
        BigInt(seqOfSwap)
      ],
    });
  };
  
  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' >

        <TextField 
          variant='outlined'
          label='seqOfSwap'
          error={ valid['SeqOfSwap']?.error }
          helperText={ valid['SeqOfSwap']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('SeqOfSwap', input, MaxSeqNo, setValid);
            setSeqOfSwap(input);
          }}
          value={ seqOfSwap }
          size='small'
        />

        <LoadingButton 
          disabled={ terminateSwapLoading || hasError(valid) }
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={ <CancelOutlined /> }
          onClick={ handleClick }
          size='small'
        >
          Terminate Swap
        </LoadingButton>        

      </Stack>
    </Paper>
    
  );

}

