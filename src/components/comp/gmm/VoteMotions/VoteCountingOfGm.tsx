
import { Button, Paper, Stack } from "@mui/material";
import { 
  useGeneralKeeperVoteCountingOfGm, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { isPassed } from "../../../../queries/meetingMinutes";


interface VoteCountingOfGmProps {
  seqOfMotion: bigint;
  setResult: (flag: boolean) => void;
  setNextStep: (step: number) => void;
  setOpen: (flag: boolean) => void;
  getMotionsList: () => void;
}

export function VoteCountingOfGm({ seqOfMotion, setResult, setNextStep, setOpen, getMotionsList }: VoteCountingOfGmProps) {

  const { gk, boox } = useComBooxContext();

  // const { 
  //   config
  // } =  usePrepareGeneralKeeperVoteCountingOfGm({
  //   address: gk,
  //   args: [ seqOfMotion ],
  // });

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: [ seqOfMotion ],
    onSuccess() {
      if (boox) {
        isPassed(boox[5], seqOfMotion).then(
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