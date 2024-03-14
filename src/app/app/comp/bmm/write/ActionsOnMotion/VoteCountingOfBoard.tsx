
import { Paper } from "@mui/material";
import { useGeneralKeeperVoteCounting } from "../../../../../../generated";

import { Calculate } from "@mui/icons-material";
import { HexType } from "../../../../read";
import { ProposeMotionProps } from "./ProposeMotionToBoardMeeting";
import { useState } from "react";
import { refreshAfterTx } from "../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";

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
        disabled={!voteCounting || voteCountingLoading }
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6, width:218 }}
        onClick={()=>voteCounting?.()}
      >
        Count
      </LoadingButton>

    </Paper>
  )

}