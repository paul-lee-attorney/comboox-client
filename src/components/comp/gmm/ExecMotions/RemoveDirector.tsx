import { useGeneralKeeperRemoveDirector } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";
import { TakePositionProps } from "../../bmm/ExecMotions/TakePosition";

export function RemoveDirector({seqOfMotion, seqOfPos, setOpen, setTime}:TakePositionProps) {

  const { gk } = useComBooxContext();
  
  const {
    isLoading: removeDirectorLoading,
    write: removeDirector,
  } = useGeneralKeeperRemoveDirector({
    address: gk,
    args: [BigInt(seqOfMotion), BigInt(seqOfPos)],
    onSuccess(){
      setTime(Date.now());
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ !removeDirector || removeDirectorLoading}
        variant="contained"
        endIcon={<FollowTheSigns />}
        sx={{ m:1, mr:6 }}
        onClick={()=>removeDirector?.()}
      >
        Remove Director
      </Button>

    </Paper>
  );
}