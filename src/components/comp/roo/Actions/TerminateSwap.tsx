import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperTerminateSwap } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";
import { useState } from "react";

export function TerminateSwap({seqOfOpt, setOpen, setTime}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfSwap, setSeqOfSwap ] = useState<string>();

  const {
    isLoading: terminateSwapLoading,
    write: terminateSwap,
  } = useGeneralKeeperTerminateSwap({
    address: gk,
    args: seqOfSwap
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfSwap)]
      : undefined,
    onSuccess() {
      setTime(Date.now());
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' >

        <TextField 
          variant='outlined'
          label='seqOfSwap'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfSwap(e.target.value ?? '0')}
          value={ seqOfSwap }
          size='small'
        />

        <Button 
          disabled={ terminateSwapLoading }
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={ <CancelOutlined /> }
          onClick={()=>terminateSwap?.() }
          size='small'
        >
          Terminate Swap
        </Button>        

      </Stack>
    </Paper>
    
  );

}

