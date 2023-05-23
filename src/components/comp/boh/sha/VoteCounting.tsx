import { useState } from "react";

import { Button, Stack, TextField } from "@mui/material";
import { 
  useGeneralKeeperProposeDocOfGm, 
  useGeneralKeeperVoteCountingOfGm, 
  usePrepareGeneralKeeperProposeDocOfGm, 
  usePrepareGeneralKeeperVoteCountingOfGm 
} from "../../../../generated";

import { FileHistoryProps, HexType } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Calculate, Outbox } from "@mui/icons-material";
import { BigNumber } from "ethers";
import { waitForTransaction } from "@wagmi/core";

async function isPassed(hash: HexType): Promise<boolean> {

  let receipt = await waitForTransaction({
    hash: hash,
  })
  
  let flag = false;

  if (receipt)
    flag = parseInt(receipt.logs[0].topics[2], 16) == 5;

  return flag;
}


export function VoteCounting({ addr, setActiveStep }: FileHistoryProps) {

  const { gk, boox } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: [BigNumber.from(addr)],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    ...config,
    onSuccess(data) {
      isPassed(data.hash).then(
        flag => setActiveStep(flag ? 5: 6)
      )
    },
  });

  return (
    <Stack sx={{ alignItems:'center' }} direction={'row'} >
      <Button
        disabled={!write || isLoading}
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6 }}
        onClick={()=>write?.()}
      >
        Count
      </Button>

    </Stack>
  )

}