import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperCreateSwap } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { SwapHorizOutlined } from "@mui/icons-material";
import { useState } from "react";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { HexType, MaxData, MaxPrice } from "../../../../scripts/common";
import { LoadingButton } from "@mui/lab";

export function CreateSwap({seqOfOpt, setOpen, refresh}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfTarget, setSeqOfTarget ] = useState<string>();
  const [ paidOfTarget, setPaidOfTarget ] = useState<string>();
  const [ seqOfPledge, setSeqOfPledge ] = useState<string>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: createSwapLoading,
    write: createSwap,
  } = useGeneralKeeperCreateSwap({
    address: gk,
    args: seqOfTarget && paidOfTarget && seqOfPledge && !hasError(valid)
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfTarget), 
          BigInt(paidOfTarget), 
          BigInt(seqOfPledge)]
      : undefined,
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
          label='seqOfTarget'
          error={ valid['SeqOfTarget']?.error }
          helperText={ valid['SeqOfTarget']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('SeqOfTarget', input, MaxPrice, setValid);
            setSeqOfTarget( input );
          }}
          value={ seqOfTarget }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='paidOfTarget'
          error={ valid['PaidOfTarget']?.error }
          helperText={ valid['PaidOfTarget']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('PaidOfTarget', input, MaxData, setValid);
            setPaidOfTarget(input);
          }}
          value={ paidOfTarget }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='seqOfPledge'
          error={ valid['SeqOfPledge']?.error }
          helperText={ valid['SeqOfPledge']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('SeqOfPledge', input, MaxPrice, setValid);
            setSeqOfPledge(input);
          }}
          value={ seqOfPledge }
          size='small'
        />

        <LoadingButton 
          disabled={ createSwapLoading || hasError(valid) }
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <SwapHorizOutlined /> }
          onClick={()=>createSwap?.() }
          size='small'
        >
          Create Swap
        </LoadingButton>        

      </Stack>
    </Paper>
    
  );

}

