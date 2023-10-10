import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperCreateSwap } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { SwapHorizOutlined } from "@mui/icons-material";
import { useState } from "react";

export function CreateSwap({seqOfOpt, setOpen, setTime}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfTarget, setSeqOfTarget ] = useState<string>();
  const [ paidOfTarget, setPaidOfTarget ] = useState<string>();
  const [ seqOfPledge, setSeqOfPledge ] = useState<string>();

  const {
    isLoading: createSwapLoading,
    write: createSwap,
  } = useGeneralKeeperCreateSwap({
    address: gk,
    args: seqOfTarget && paidOfTarget && seqOfPledge
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfTarget), 
          BigInt(paidOfTarget), 
          BigInt(seqOfPledge)]
      : undefined,
    onSuccess() {
      setTime(Date.now());
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='seqOfTarget'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfTarget(e.target.value ?? '0')}
          value={ seqOfTarget }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='paidOfTarget'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setPaidOfTarget(e.target.value ?? '0')}
          value={ paidOfTarget }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='seqOfPledge'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfPledge(e.target.value ?? '0')}
          value={ seqOfPledge }
          size='small'
        />

        <Button 
          disabled={ createSwapLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <SwapHorizOutlined /> }
          onClick={()=>createSwap?.() }
          size='small'
        >
          Create Swap
        </Button>        

      </Stack>
    </Paper>
    
  );

}

