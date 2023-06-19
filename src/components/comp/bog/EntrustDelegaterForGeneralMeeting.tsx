import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForGeneralMeeting, 
  usePrepareGeneralKeeperEntrustDelegaterForGeneralMeeting 
} from "../../../generated";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Button, Stack, TextField, } from "@mui/material";
import { Handshake, } from "@mui/icons-material";
import { HexType } from "../../../interfaces";

interface EntrustDelegaterOfMemberProps {
  seqOfMotion: BigNumber,
  setOpen: (flag: boolean) => void,
  getMotionsList: (minutes:HexType) => any,
}

export function EntrustDelegaterForGeneralMeeting({ seqOfMotion, setOpen, getMotionsList }: EntrustDelegaterOfMemberProps) {

  const { gk, boox } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  const {
    config: entrustDelegaterOfMemberConfig
  } = usePrepareGeneralKeeperEntrustDelegaterForGeneralMeeting({
    address: gk,
    args: delegater
        ? [seqOfMotion, BigNumber.from(delegater) ]
        : undefined ,
  });

  const {
    isLoading: entrustDelegaterOfMemberLoading,
    write: entrustDelegaterOfMember,
  } = useGeneralKeeperEntrustDelegaterForGeneralMeeting({
    ...entrustDelegaterOfMemberConfig,
    onSuccess() {
      getMotionsList(boox[3]);
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
        disabled={ !entrustDelegaterOfMember || entrustDelegaterOfMemberLoading }
        variant="contained"
        endIcon={<Handshake />}
        sx={{ m:1, minWidth:118 }}
        onClick={()=>entrustDelegaterOfMember?.()}
      >
        Entrust
      </Button>

    </Stack> 
  );
}



