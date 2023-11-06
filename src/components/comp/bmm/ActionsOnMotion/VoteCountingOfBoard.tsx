
import { Paper } from "@mui/material";
import { useGeneralKeeperVoteCounting } from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { HexType } from "../../../../scripts/common";
import { ProposeMotionProps } from "./ProposeMotionToBoardMeeting";
import { useState } from "react";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function VoteCountingOfBoard({ seqOfMotion, setOpen, refresh }: ProposeMotionProps) {

  const { gk, setErrMsg } = useComBooxContext();
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: voteCountingLoading,
    write: voteCounting,
  } = useGeneralKeeperVoteCounting({
    address: gk,
    args: [ seqOfMotion ],
    onError(err) {
      setErrMsg(err.message);
    },
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