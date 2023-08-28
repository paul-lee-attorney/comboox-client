import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForBoardMeeting,
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Stack, TextField, } from "@mui/material";
import { HandshakeOutlined, } from "@mui/icons-material";
import { HexType, booxMap } from "../../../../scripts/common";

interface EntrustDelegaterForBmProps {
  seqOfMotion: bigint,
  setOpen: (flag: boolean) => void,
  getMotionsList: (minutes:HexType) => any,
}

export function EntrustDelegaterForBoardMeeting({ seqOfMotion, setOpen, getMotionsList }: EntrustDelegaterForBmProps) {

  const { gk, boox } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  // const {
  //   config: entrustDelegaterForBmConfig
  // } = usePrepareGeneralKeeperEntrustDelegaterForBoardMeeting({
  //   address: gk,
  //   args: delegater
  //       ? [seqOfMotion, BigInt(delegater) ]
  //       : undefined ,
  // });

  const {
    isLoading: entrustDelegaterForBmLoading,
    write: entrustDelegaterForBm,
  } = useGeneralKeeperEntrustDelegaterForBoardMeeting({
    address: gk,
    args: delegater
        ? [seqOfMotion, BigInt(delegater) ]
        : undefined ,
    onSuccess() {
      if (boox) {
        getMotionsList(boox[booxMap.ROD]);
        setOpen(false);
      }
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



