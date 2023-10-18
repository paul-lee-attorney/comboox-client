
import { Stack, TextField } from "@mui/material";
import { useGeneralKeeperProposeDocOfGm } from "../../../../generated";
import { HexType, MaxUserNo, } from "../../../../scripts/common";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { EmojiPeople } from "@mui/icons-material";
import { useState } from "react";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

interface ProposeDocOfGmProps {
  addr: HexType,
  seqOfVR: number,
  setNextStep: (next: number ) => void,
}

export function ProposeDocOfGm({ addr, seqOfVR, setNextStep }: ProposeDocOfGmProps) {

  const { gk } = useComBooxContext();
  const [ executor, setExecutor ] = useState<string>('0');
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    setLoading(false);
    setNextStep(4);
  }

  const {
    isLoading,
    write
  } = useGeneralKeeperProposeDocOfGm({
    address: gk,
    args: seqOfVR && executor && !hasError(valid)
      ? [ BigInt(`0x${addr.substring(2).padStart(64, '0')}`), 
          BigInt(seqOfVR), 
          BigInt(executor) ]
      : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });
  
  return (
    <Stack direction='row' sx={{m:1, p:1, justifyContent:'start', alignItems:'start'}}>
      <TextField 
        variant='outlined'
        label='Executor'
        size="small"
        error={ valid['Executor']?.error }
        helperText={ valid['Executor']?.helpTx ?? ' ' }
        sx={{
          m:1,
          minWidth: 218,
        }}
        onChange={(e)=>{
          let input = e.target.value;
          onlyNum('Executor', input, MaxUserNo, setValid);
          setExecutor(input);
        }}
        value={ executor }
      />

      <LoadingButton
        disabled={!write || isLoading || hasError(valid)}
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<EmojiPeople />}
        sx={{ m:1, minWidth:218, }}
        onClick={()=>write?.()}
      >
        Propose
      </LoadingButton>
    </Stack>
  )

}