import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperExecSwapOrder, useGeneralKeeperPlaceSwapOrder } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Approval, DoneOutline } from "@mui/icons-material";
import { useState } from "react";

export function ExecSwapOrder({seqOfOpt, setOpen, getAllOpts}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfBrf, setSeqOfBrf ] = useState<string>();

  const {
    isLoading: execSwapOrderLoading,
    write: execSwapOrder,
  } = useGeneralKeeperExecSwapOrder({
    address: gk,
    args: seqOfBrf
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfBrf)]
      : undefined,
    onSuccess() {
      getAllOpts();
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Exercise Swap Order</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='seqOfBrief'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfBrf(e.target.value ?? '0')}
          value={ seqOfBrf }
          size='small'
        />

        <Button 
          disabled={ execSwapOrderLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <DoneOutline /> }
          onClick={()=>execSwapOrder?.() }
          size='small'
        >
          Exercise
        </Button>        

      </Stack>
    </Paper>
    
  );

}

