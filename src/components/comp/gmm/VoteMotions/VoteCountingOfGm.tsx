
import { Button, Paper } from "@mui/material";
import { 
  useGeneralKeeperVoteCountingOfGm, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { isPassed } from "../../../../scripts/common/meetingMinutes";
import { booxMap } from "../../../../scripts/common";


interface VoteCountingOfGmProps {
  seqOfMotion: bigint;
  setResult: (flag: boolean) => void;
  setNextStep: (step: number) => void;
  setOpen: (flag: boolean) => void;
  getMotionsList: () => void;
}

export function VoteCountingOfGm({ seqOfMotion, setResult, setNextStep, setOpen, getMotionsList }: VoteCountingOfGmProps) {

  const { gk, boox } = useComBooxContext();

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: [ seqOfMotion ],
    onSuccess() {
      if (boox) {
        isPassed(boox[booxMap.GMM], seqOfMotion).then(
          flag => {
            setResult(flag);
            setNextStep(flag ? 6 : 8);
            getMotionsList();
            setOpen(false);
          }
        )
      }
    }
  });

  return (

    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ !write || isLoading}
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6, width:218 }}
        onClick={()=>write?.()}
      >
        Count
      </Button>

    </Paper>
  )

}