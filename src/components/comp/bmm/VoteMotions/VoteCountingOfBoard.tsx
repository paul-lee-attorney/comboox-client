
import { Button, Paper } from "@mui/material";
import { 
  useGeneralKeeperVoteCounting,
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { isPassed } from "../../../../scripts/common/meetingMinutes";
import { HexType, booxMap } from "../../../../scripts/common";
import { ProposeMotionProps } from "./ProposeMotionToBoardMeeting";
import { Dispatch, SetStateAction, useState } from "react";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { waitForTransaction } from "@wagmi/core";
import { LoadingButton } from "@mui/lab";

export interface VoteCountingOfBoard extends ProposeMotionProps {
  setResult: Dispatch<SetStateAction<boolean>>;
  setNextStep: Dispatch<SetStateAction<number>>;
}

export function VoteCountingOfBoard({ seqOfMotion, setResult, setNextStep, setOpen, refresh }: VoteCountingOfBoard) {

  const { gk, boox } = useComBooxContext();
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    if (boox) {
      isPassed(boox[booxMap.BMM], seqOfMotion).then(
        flag => {
          setResult(flag);
          setNextStep(1);
        }
      );
    }
    setOpen(false);
  }

  const {
    isLoading: voteCountingLoading,
    write: voteCounting,
  } = useGeneralKeeperVoteCounting({
    address: gk,
    args: [ seqOfMotion ],
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <LoadingButton
        disabled={ voteCountingLoading }
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6 }}
        onClick={()=>voteCounting?.()}
      >
        Count
      </LoadingButton>

    </Paper>
  )

}