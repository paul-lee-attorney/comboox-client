
import { Button, Paper, Stack } from "@mui/material";
import { 
  useGeneralKeeperVoteCounting,
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { isPassed } from "../../../../scripts/common/meetingMinutes";
import { booxMap } from "../../../../scripts/common";

interface VoteCountingOfBoard {
  seqOfMotion: bigint;
  setResult: (flag: boolean) => void;
  setNextStep: (next:number) => void;
  setOpen: (flag: boolean) => void;
  getMotionsList: () => any;
}

export function VoteCountingOfBoard({ seqOfMotion, setResult, setNextStep, setOpen, getMotionsList }: VoteCountingOfBoard) {

  const { gk, boox } = useComBooxContext();

  // const { 
  //   config
  // } =  usePrepareGeneralKeeperVoteCounting({
  //   address: gk,
  //   args: [ seqOfMotion ],
  // });

  const {
    isLoading,
    write,
    data,
  } = useGeneralKeeperVoteCounting({
    address: gk,
    args: [ seqOfMotion ],
    onSuccess() {
      if (boox) {
        isPassed(boox[booxMap.BMM], seqOfMotion).then(
          flag => {
            setResult(flag);
            setNextStep(1);
            getMotionsList();
            setOpen(false);
          }
        )
      }

    },
  });

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ isLoading }
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6 }}
        onClick={()=>write?.()}
      >
        Count
      </Button>

    </Paper>
  )

}