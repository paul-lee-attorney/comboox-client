import { useState } from "react";

import { Button, Stack, TextField } from "@mui/material";
import { useGeneralKeeperProposeDocOfGm, usePrepareGeneralKeeperProposeDocOfGm } from "../../../../generated";
import { FileHistoryProps, } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { BackHand, EmojiPeople, Outbox } from "@mui/icons-material";
import { BigNumber } from "ethers";

export function ProposeSha({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperProposeDocOfGm({
    address: gk,
    args: [addr, BigNumber.from('8'), BigNumber.from('0') ],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperProposeDocOfGm({
    ...config,
    onSuccess() {
      setNextStep(4);
    }
  });

  return (
      <Button
        disabled={!write || isLoading}
        variant="contained"
        endIcon={<EmojiPeople />}
        sx={{ m:1, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Propose
      </Button>
  )

}