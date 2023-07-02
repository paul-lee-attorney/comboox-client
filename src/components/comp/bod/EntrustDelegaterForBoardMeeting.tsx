import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForBoardMeeting,
  usePrepareGeneralKeeperEntrustDelegaterForBoardMeeting, 
} from "../../../generated";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Button, Stack, TextField, } from "@mui/material";
import { Handshake, } from "@mui/icons-material";
import { HexType } from "../../../interfaces";

interface EntrustDelegaterForBmProps {
  seqOfMotion: BigNumber,
  setOpen: (flag: boolean) => void,
  getMotionsList: (minutes:HexType) => any,
}

export function EntrustDelegaterForBoardMeeting({ seqOfMotion, setOpen, getMotionsList }: EntrustDelegaterForBmProps) {

  const { gk, boox } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  const {
    config: entrustDelegaterForBmConfig
  } = usePrepareGeneralKeeperEntrustDelegaterForBoardMeeting({
    address: gk,
    args: delegater
        ? [seqOfMotion, BigNumber.from(delegater) ]
        : undefined ,
  });

  const {
    isLoading: entrustDelegaterForBmLoading,
    write: entrustDelegaterForBm,
  } = useGeneralKeeperEntrustDelegaterForBoardMeeting({
    ...entrustDelegaterForBmConfig,
    onSuccess() {
      if (boox) {
        getMotionsList(boox[2]);
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
        endIcon={<Handshake />}
        sx={{ m:1, minWidth:118 }}
        onClick={()=>entrustDelegaterForBm?.()}
      >
        Entrust
      </Button>

    </Stack> 
  );
}



