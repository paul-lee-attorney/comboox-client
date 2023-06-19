
import { Button, Stack } from "@mui/material";
import { 
  useGeneralKeeperVoteCountingOfGm, 
  usePrepareGeneralKeeperVoteCountingOfGm 
} from "../../../generated";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { BigNumber } from "ethers";
import { isPassed } from "../../../queries/meetingMinutes";


interface VoteCountingOfGmProps {
  seqOfMotion: BigNumber;
  setResult: (flag: boolean) => void;
}

export function VoteCountingOfGm({ seqOfMotion, setResult }: VoteCountingOfGmProps) {

  const { gk, boox } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: [ seqOfMotion ],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    ...config,
    onSuccess() {
      isPassed(boox[3], seqOfMotion).then(
        flag => setResult(flag)
      )
    }
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