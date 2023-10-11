import { useGeneralKeeperRemoveDirector } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";
import { TakePositionProps } from "../../bmm/ExecMotions/TakePosition";
import { HexType } from "../../../../scripts/common";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function RemoveDirector({seqOfMotion, seqOfPos, setOpen, refresh}:TakePositionProps) {

  const { gk } = useComBooxContext();

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: removeDirectorLoading,
    write: removeDirector,
  } = useGeneralKeeperRemoveDirector({
    address: gk,
    args: [BigInt(seqOfMotion), BigInt(seqOfPos)],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

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