import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForBoardMeeting,
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Stack, TextField, } from "@mui/material";
import { HandshakeOutlined, } from "@mui/icons-material";
import { ProposeMotionProps } from "./ProposeMotionToBoardMeeting";

export function EntrustDelegaterForBoardMeeting({ seqOfMotion, setOpen, setTime }: ProposeMotionProps) {

  const { gk, boox } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  const {
    isLoading: entrustDelegaterForBmLoading,
    write: entrustDelegaterForBm,
  } = useGeneralKeeperEntrustDelegaterForBoardMeeting({
    address: gk,
    args: delegater
        ? [seqOfMotion, BigInt(delegater) ]
        : undefined ,
    onSuccess() {
      setTime(Date.now());
      setOpen(false);
    },
  });

  return (
    <Stack direction="row" sx={{ alignItems:'center' }} >

      <TextField 
        variant='filled'
        label='Delegater'
        sx={{
          m:1,
          minWidth: 218,
        }}
        onChange={(e) => setDelegater(e.target.value)}
        value={ delegater }
        size='small'
      />

      <Button
        disabled={ !entrustDelegaterForBm || entrustDelegaterForBmLoading }
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



