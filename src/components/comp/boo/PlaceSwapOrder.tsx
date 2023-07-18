import { ActionsOfOptionProps } from "./ActionsOfOption";
import { useGeneralKeeperPlaceSwapOrder } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Approval } from "@mui/icons-material";
import { useState } from "react";

export function PlaceSwapOrder({seqOfOpt, setOpen, getAllOpts}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfConsider, setSeqOfConsider ] = useState<string>();
  const [ paidOfConsider, setPaidOfConsider ] = useState<string>();
  const [ seqOfTarget, setSeqOfTarget ] = useState<string>();

  const {
    isLoading: placeSwapOrderLoading,
    write: placeSwapOrder,
  } = useGeneralKeeperPlaceSwapOrder({
    address: gk,
    args: seqOfConsider && paidOfConsider && seqOfTarget
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfConsider), 
          BigInt(paidOfConsider), 
          BigInt(seqOfTarget)]
      : undefined,
    onSuccess() {
      getAllOpts();
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h4>Exercise Right Of Option</h4>
      </Toolbar>

      <Stack direction='row' >

        <TextField 
          variant='filled'
          label='seqOfConsider'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfConsider(e.target.value ?? '0')}
          value={ seqOfConsider }
          size='small'
        />

        <TextField 
          variant='filled'
          label='paidOfConsider'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setPaidOfConsider(e.target.value ?? '0')}
          value={ paidOfConsider }
          size='small'
        />

        <TextField 
          variant='filled'
          label='seqOfTarget'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfTarget(e.target.value ?? '0')}
          value={ seqOfTarget }
          size='small'
        />

        <Button 
          disabled={ placeSwapOrderLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Approval /> }
          onClick={()=>placeSwapOrder?.() }
          size='small'
        >
          Place Order
        </Button>        

      </Stack>
    </Paper>
    
  );

}

