import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperPayOffSwap } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useState } from "react";

export function PayOffSwap({seqOfOpt, setOpen, getAllOpts}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfSwap, setSeqOfSwap ] = useState<string>('0');
  const [ value, setValue ] = useState<string>('0');

  const {
    isLoading: payOffSwapLoading,
    write: payOffSwap,
  } = useGeneralKeeperPayOffSwap({
    address: gk,
    args: seqOfSwap
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfSwap)]
      : undefined,
    value: BigInt(value) * BigInt(10 ** 9),
    onSuccess() {
      getAllOpts();
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='SeqOfSwap'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfSwap(e.target.value ?? '0')}
          value={ seqOfSwap }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='AmtOfETH (Gwei)'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setValue(e.target.value ?? '0')}
          value={ value }
          size='small'
        />

        <Button 
          disabled={ payOffSwapLoading }
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={ <Payment /> }
          onClick={()=>payOffSwap?.() }
          size='small'
        >
          Pay Off Swap
        </Button>        

      </Stack>
    </Paper>
    
  );

}

