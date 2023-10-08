
import { 
  useGeneralKeeperTakePosition, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper } from "@mui/material";
import { Chair } from "@mui/icons-material";
import { ProposeMotionProps } from "../VoteMotions/ProposeMotionToBoardMeeting";

export interface TakePositionProps extends ProposeMotionProps {
  seqOfPos: number;
}


export function TakePosition({seqOfMotion, seqOfPos, setOpen, setTime}:TakePositionProps) {

  const { gk } = useComBooxContext();
  
  const {
    isLoading: takePositionLoading,
    write: takePosition,
  } = useGeneralKeeperTakePosition({
    address: gk,
    args: [seqOfMotion, BigInt(seqOfPos)],
    onSuccess(){
        setTime(Date.now());
        setOpen(false);
    }
  })

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