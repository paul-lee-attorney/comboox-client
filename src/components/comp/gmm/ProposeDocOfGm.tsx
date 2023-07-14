
import { Button, Stack, TextField } from "@mui/material";
import { useGeneralKeeperProposeDocOfGm, usePrepareGeneralKeeperProposeDocOfGm } from "../../../generated";
import { HexType, } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { EmojiPeople } from "@mui/icons-material";
import { useState } from "react";

interface ProposeDocOfGmProps {
  addr: HexType,
  seqOfVR: number,
  setNextStep: (next: number ) => void,
}

export function ProposeDocOfGm({ addr, seqOfVR, setNextStep }: ProposeDocOfGmProps) {

  const { gk } = useComBooxContext();
  const [ executor, setExecutor ] = useState<string>('0');

  // const { 
  //   config
  // } =  usePrepareGeneralKeeperProposeDocOfGm({
  //   address: gk,
  //   args: [addr, BigInt(seqOfVR), BigInt(executor) ],
  // });

  const {
    isLoading,
    write
  } = useGeneralKeeperProposeDocOfGm({
    address: gk,
    args: [addr, BigInt(seqOfVR), BigInt(executor) ],    
    onSuccess() {
      setNextStep(4);
    }
  });

  return (
    <Stack direction='row' sx={{m:1, p:1, justifyContent:'start', alignItems:'center'}}>
      <TextField 
        variant='filled'
        label='Executor'
        sx={{
          m:1,
          minWidth: 218,
        }}
        onChange={(e)=>setExecutor(e.target.value)}
        value={executor}
      />      
      <Button
        disabled={!write || isLoading}
        variant="contained"
        endIcon={<EmojiPeople />}
        sx={{ m:1, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Propose
      </Button>
    </Stack>
  )

}