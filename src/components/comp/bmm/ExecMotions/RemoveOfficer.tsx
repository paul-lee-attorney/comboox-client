import { 
  useGeneralKeeperRemoveOfficer, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";
import { TakePositionProps } from "./TakePosition";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { HexType } from "../../../../scripts/common";

export function RemoveOfficer({seqOfMotion, seqOfPos, setOpen, refresh}:TakePositionProps) {

  const {gk, boox} = useComBooxContext();

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: removeOfficerLoading,
    write: removeOfficer,
  } = useGeneralKeeperRemoveOfficer({
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
        disabled={ removeOfficerLoading }
        variant="contained"
        endIcon={<FollowTheSigns />}
        sx={{ m:1, mr:6 }}
        onClick={()=>removeOfficer?.()}
      >
        Remove Officer
      </Button>

    </Paper>
  );
}