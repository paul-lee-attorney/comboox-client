
import { Button, Stack } from "@mui/material";
import { 
  useGeneralKeeperVoteCountingOfGm, 
} from "../../../../../generated";

import { HexType, booxMap } from "../../../../../scripts/common";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { getHeadOfFile } from "../../../../../scripts/common/filesFolder";
import { useState } from "react";
import { refreshAfterTx } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

interface VoteCountingProps {
  seqOfMotion: bigint | undefined,
  sha: HexType,
  setNextStep: (next: number) => void,
}

export function VoteCounting({ seqOfMotion, sha, setNextStep }: VoteCountingProps) {

  const { gk, boox, setErrMsg } = useComBooxContext();
  const [ loading, setLoading ] = useState(false);

  const refresh = ()=> {
    setLoading(false);
    if (boox) {
      getHeadOfFile(boox[booxMap.ROC], sha).then(
        head => setNextStep( head.state )
      );
    }
  }

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: seqOfMotion ? [ seqOfMotion ] : undefined,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      refreshAfterTx(hash, refresh);
    },
  });

  return (
    <Stack sx={{ alignItems:'center' }} direction={ 'row' } >
      <LoadingButton
        disabled={ isLoading }
        loading = {loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6 }}
        onClick={()=>write?.()}
      >
        Count
      </LoadingButton>

    </Stack>
  )

}