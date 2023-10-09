import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForGeneralMeeting, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Stack, TextField, } from "@mui/material";
import { HandshakeOutlined, } from "@mui/icons-material";
import { ProposeMotionProps } from "../../bmm/VoteMotions/ProposeMotionToBoardMeeting";

export function EntrustDelegaterForGeneralMeeting({ seqOfMotion, setOpen, setTime }: ProposeMotionProps) {

  const { gk } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  const {
    isLoading: entrustDelegaterOfMemberLoading,
    write: entrustDelegaterOfMember,
  } = useGeneralKeeperEntrustDelegaterForGeneralMeeting({
    address: gk,
    args: delegater
        ? [seqOfMotion, BigInt(delegater) ]
        : undefined,
    onSuccess() {
      setTime(Date.now());
      setOpen(false);  
    },
  });

  return (
    <Stack direction="row" sx={{ alignItems:'stretch' }} >

      <TextField 
        variant='outlined'
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
        disabled={ !entrustDelegaterOfMember || entrustDelegaterOfMemberLoading }
        variant="contained"
        endIcon={<HandshakeOutlined />}
        sx={{ m:1, minWidth:128 }}
        onClick={()=>entrustDelegaterOfMember?.()}
      >
        Entrust
      </Button>

    </Stack> 
  );
}



