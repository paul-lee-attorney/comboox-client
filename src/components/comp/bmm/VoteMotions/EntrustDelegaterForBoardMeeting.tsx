import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForBoardMeeting,
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Stack, TextField, } from "@mui/material";
import { HandshakeOutlined, } from "@mui/icons-material";
import { ProposeMotionProps } from "./ProposeMotionToBoardMeeting";
import { HexType, MaxUserNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function EntrustDelegaterForBoardMeeting({ seqOfMotion, setOpen, refresh }: ProposeMotionProps) {

  const { gk, boox } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: entrustDelegaterForBmLoading,
    write: entrustDelegaterForBm,
  } = useGeneralKeeperEntrustDelegaterForBoardMeeting({
    address: gk,
    args: delegater && !hasError(valid)
        ? [seqOfMotion, BigInt(delegater) ]
        : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });
    
  return (
    <Stack direction="row" sx={{ alignItems:'center' }} >

      <TextField 
        variant='filled'
        label='Delegater'
        error={ valid['Delegater']?.error }
        helperText={ valid['Delegater']?.helpTx }
        sx={{
          m:1,
          minWidth: 218,
        }}
        onChange={(e) => {
          let input = e.target.value;
          onlyNum('Delegater', input, MaxUserNo, setValid);
          setDelegater(input);
        }}
        value={ delegater }
        size='small'
      />

      <Button
        disabled={ !entrustDelegaterForBm || entrustDelegaterForBmLoading || hasError(valid)}
        variant="contained"
        endIcon={<HandshakeOutlined />}
        sx={{ m:1, minWidth:118 }}
        onClick={()=>entrustDelegaterForBm?.()}
      >
        Entrust
      </Button>

    </Stack> 
  );
}



