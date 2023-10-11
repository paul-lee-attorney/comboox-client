
import { 
  useGeneralKeeperTakePosition, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper } from "@mui/material";
import { Chair } from "@mui/icons-material";
import { ProposeMotionProps } from "../VoteMotions/ProposeMotionToBoardMeeting";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { HexType } from "../../../../scripts/common";

export interface TakePositionProps extends ProposeMotionProps {
  seqOfPos: number;
}


export function TakePosition({seqOfMotion, seqOfPos, setOpen, refresh}:TakePositionProps) {

  const { gk } = useComBooxContext();
  
  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: takePositionLoading,
    write: takePosition,
  } = useGeneralKeeperTakePosition({
    address: gk,
    args: [seqOfMotion, BigInt(seqOfPos)],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ !takePosition || takePositionLoading}
        variant="contained"
        endIcon={<Chair />}
        sx={{ m:1, mr:6 }}
        onClick={()=>takePosition?.()}
      >
        Take Position
      </Button>

    </Paper>
  );
}