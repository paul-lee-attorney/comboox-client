import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForGeneralMeeting, 
  usePrepareGeneralKeeperEntrustDelegaterForGeneralMeeting 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Stack, TextField, } from "@mui/material";
import { HandshakeOutlined, } from "@mui/icons-material";
import { HexType } from "../../../../interfaces";

interface EntrustDelegaterOfMemberProps {
  seqOfMotion: bigint,
  setOpen: (flag: boolean) => void,
  getMotionsList: (minutes:HexType) => any,
}

export function EntrustDelegaterForGeneralMeeting({ seqOfMotion, setOpen, getMotionsList }: EntrustDelegaterOfMemberProps) {

  const { gk, boox } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  // const {
  //   config: entrustDelegaterOfMemberConfig
  // } = usePrepareGeneralKeeperEntrustDelegaterForGeneralMeeting({
  //   address: gk,
  //   args: delegater
  //       ? [seqOfMotion, BigInt(delegater) ]
  //       : undefined ,
  // });

  const {
    isLoading: entrustDelegaterOfMemberLoading,
    write: entrustDelegaterOfMember,
  } = useGeneralKeeperEntrustDelegaterForGeneralMeeting({
    address: gk,
    args: delegater
        ? [seqOfMotion, BigInt(delegater) ]
        : undefined,
    onSuccess() {
      if (boox ) {
        getMotionsList(boox[5]);
        setOpen(false);  
      }
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



