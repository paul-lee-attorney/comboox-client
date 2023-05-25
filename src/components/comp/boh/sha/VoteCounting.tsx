import { useState } from "react";

import { Button, Stack, TextField } from "@mui/material";
import { 
  filesFolderABI,
  useGeneralKeeperProposeDocOfGm, 
  useGeneralKeeperVoteCountingOfGm, 
  usePrepareGeneralKeeperProposeDocOfGm, 
  usePrepareGeneralKeeperVoteCountingOfGm 
} from "../../../../generated";

import { FileHistoryProps, HexType } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Calculate, Outbox } from "@mui/icons-material";
import { BigNumber } from "ethers";
import { readContract } from "@wagmi/core";

async function isPassed(boh: HexType, sha: HexType): Promise<number> {

  let res = await readContract({
    address: boh,
    abi: filesFolderABI,
    functionName: 'getHeadOfFile',
    args: [sha],
  })

  return res.state;
}

interface VoteCountingProps {
  seqOfMotion: BigNumber | undefined,
  sha: HexType,
  setNextStep: (next: number) => void,
}


export function VoteCounting({ seqOfMotion, sha, setNextStep }: VoteCountingProps) {

  const { gk, boox } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: seqOfMotion ? [ seqOfMotion ] : undefined,
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    ...config,
    onSuccess(data) {
      isPassed(boox[4], sha).then(
        fileState => setNextStep( fileState )
      )
    },
  });

  return (
    <Stack sx={{ alignItems:'center' }} direction={ 'row' } >
      <Button
        disabled={ !write || isLoading}
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