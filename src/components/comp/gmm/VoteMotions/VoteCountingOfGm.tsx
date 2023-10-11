
import { Button, Paper } from "@mui/material";
import { 
  useGeneralKeeperVoteCountingOfGm, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { isPassed } from "../../../../scripts/common/meetingMinutes";
import { HexType, booxMap } from "../../../../scripts/common";
import { VoteCountingOfBoard } from "../../bmm/VoteMotions/VoteCountingOfBoard";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function VoteCountingOfGm({ seqOfMotion, setResult, setNextStep, setOpen, refresh }: VoteCountingOfBoard ) {

  const { gk, boox } = useComBooxContext();

  const updateResults = ()=>{
    refresh();
    if (boox) {
      isPassed(boox[booxMap.GMM], seqOfMotion).then(
        flag => {
          setResult(flag);
          setNextStep(flag ? 6 : 8);
          setOpen(false);
        }
      )
    }
  }

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: [ seqOfMotion ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
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