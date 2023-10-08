
import { Button, Paper, Stack } from "@mui/material";
import { 
  useGeneralKeeperVoteCounting,
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { isPassed } from "../../../../scripts/common/meetingMinutes";
import { booxMap } from "../../../../scripts/common";
import { ProposeMotionProps } from "./ProposeMotionToBoardMeeting";
import { Dispatch, SetStateAction } from "react";

interface VoteCountingOfBoard extends ProposeMotionProps {
  setResult: Dispatch<SetStateAction<boolean>>;
  setNextStep: Dispatch<SetStateAction<number>>;
}

export function VoteCountingOfBoard({ seqOfMotion, setResult, setNextStep, setOpen, setTime }: VoteCountingOfBoard) {

  const { gk, boox } = useComBooxContext();

  // const { 
  //   config
  // } =  usePrepareGeneralKeeperVoteCounting({
  //   address: gk,
  //   args: [ seqOfMotion ],
  // });

  const {
    isLoading: voteCountingLoading,
    write: voteCounting,
  } = useGeneralKeeperVoteCounting({
    address: gk,
    args: [ seqOfMotion ],
    onSuccess() {
      if (boox) {
        isPassed(boox[booxMap.BMM], seqOfMotion).then(
          flag => {
            setResult(flag);
            setNextStep(1);
            setTime(Date.now());
            setOpen(false);
          }
        )
      }

    },
  });

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ voteCountingLoading }
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6 }}
        onClick={()=>voteCounting?.()}
      >
        Count
      </Button>

    </Paper>
  )

}