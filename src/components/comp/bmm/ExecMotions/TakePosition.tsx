
import { 
  useGeneralKeeperTakePosition, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper } from "@mui/material";
import { Chair } from "@mui/icons-material";
import { ProposeMotionProps } from "../VoteMotions/ProposeMotionToBoardMeeting";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { HexType } from "../../../../scripts/common";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

export interface TakePositionProps extends ProposeMotionProps {
  seqOfPos: number;
}


export function TakePosition({seqOfMotion, seqOfPos, setOpen, refresh}:TakePositionProps) {

  const { gk } = useComBooxContext();
  const [ loading, setLoading ] = useState(false);
  
  const updateResults = ()=>{
    refresh();
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: takePositionLoading,
    write: takePosition,
  } = useGeneralKeeperTakePosition({
    address: gk,
    args: [seqOfMotion, BigInt(seqOfPos)],
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <LoadingButton
        disabled={ !takePosition || takePositionLoading}
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<Chair />}
        sx={{ m:1, mr:6 }}
        onClick={()=>takePosition?.()}
      >
        Take Position
      </LoadingButton>

    </Paper>
  );
}