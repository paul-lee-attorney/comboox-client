import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperPayOffSwap } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useState } from "react";
import { HexType, MaxSeqNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function PayOffSwap({seqOfOpt, setOpen, refresh}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfSwap, setSeqOfSwap ] = useState<string>('0');
  const [ value, setValue ] = useState<string>('0');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: payOffSwapLoading,
    write: payOffSwap,
  } = useGeneralKeeperPayOffSwap({
    address: gk,
    args: seqOfSwap && !hasError(valid)
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfSwap)]
      : undefined,
    value: !hasError(valid) ? BigInt(value) * (10n ** 9n) : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='SeqOfSwap'
          error={ valid['SeqOfSwap']?.error }
          helperText={ valid['SeqOfSwap']?.helpTx }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('SeqOfSwap', input, MaxSeqNo, setValid);
            setSeqOfSwap(input);
          }}
          value={ seqOfSwap }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='AmtOfETH (Gwei)'
          error={ valid['AmtOfGwei']?.error }
          helperText={ valid['AmtOfGwei']?.helpTx }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('AmtOfGwei', input, 0n, setValid);
            setValue(input);
          }}
          value={ value }
          size='small'
        />

        <LoadingButton 
          disabled={ payOffSwapLoading || hasError(valid) }
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={ <Payment /> }
          onClick={()=>payOffSwap?.() }
          size='small'
        >
          Pay Off Swap
        </LoadingButton>        

      </Stack>
    </Paper>
    
  );

}

