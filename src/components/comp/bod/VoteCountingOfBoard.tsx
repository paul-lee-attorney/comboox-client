
import { Button, Paper, Stack } from "@mui/material";
import { 
  filesFolderABI,
  useGeneralKeeperVoteCounting,
  usePrepareGeneralKeeperVoteCounting, 
} from "../../../generated";

import { HexType } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { BigNumber } from "ethers";
import { readContract } from "@wagmi/core";
import { isPassed } from "../../../queries/meetingMinutes";

interface VoteCountingOfBoard {
  seqOfMotion: BigNumber;
  setResult: (flag: boolean) => void;
  setNextStep: (next:number) => void;
  setOpen: (flag: boolean) => void;
  getMotionsList: () => any;
}

export function VoteCountingOfBoard({ seqOfMotion, setResult, setNextStep, setOpen, getMotionsList }: VoteCountingOfBoard) {

  const { gk, boox } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperVoteCounting({
    address: gk,
    args: [ seqOfMotion ],
  });

  const {
    isLoading,
    write,
    data,
  } = useGeneralKeeperVoteCounting({
    ...config,
    onSuccess() {
      if (boox) {
        isPassed(boox[2], seqOfMotion).then(
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
        disabled={ !write || isLoading}
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