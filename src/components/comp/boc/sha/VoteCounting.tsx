
import { Button, Stack } from "@mui/material";
import { 
  filesFolderABI,
  useGeneralKeeperVoteCountingOfGm, 

} from "../../../../generated";

import { HexType } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Calculate, Outbox } from "@mui/icons-material";
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
  seqOfMotion: bigint | undefined,
  sha: HexType,
  setNextStep: (next: number) => void,
}


export function VoteCounting({ seqOfMotion, sha, setNextStep }: VoteCountingProps) {

  const { gk, boox } = useComBooxContext();

  // const { 
  //   config
  // } =  usePrepareGeneralKeeperVoteCountingOfGm({
  //   address: gk,
  //   args: seqOfMotion ? [ seqOfMotion ] : undefined,
  // });

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: seqOfMotion ? [ seqOfMotion ] : undefined,
    onSuccess() {
      if (boox)
        isPassed(boox[5], sha).then(
          fileState => setNextStep( fileState )
        )
    },
  });

  return (
    <Stack sx={{ alignItems:'center' }} direction={ 'row' } >
      <Button
        disabled={ isLoading }
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