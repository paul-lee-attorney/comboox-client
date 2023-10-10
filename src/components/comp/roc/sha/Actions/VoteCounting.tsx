
import { Button, Stack } from "@mui/material";
import { 
  useGeneralKeeperVoteCountingOfGm, 
} from "../../../../../generated";

import { HexType, booxMap } from "../../../../../scripts/common";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { getHeadOfFile } from "../../../../../scripts/common/filesFolder";

interface VoteCountingProps {
  seqOfMotion: bigint | undefined,
  sha: HexType,
  setNextStep: (next: number) => void,
}

export function VoteCounting({ seqOfMotion, sha, setNextStep }: VoteCountingProps) {

  const { gk, boox } = useComBooxContext();

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: seqOfMotion ? [ seqOfMotion ] : undefined,
    onSuccess() {
      if (boox) {
        getHeadOfFile(boox[booxMap.ROC], sha).then(
          head => setNextStep( head.state )
        );
      }
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