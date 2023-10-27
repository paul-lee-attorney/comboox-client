import { 
  useGeneralKeeperRemoveOfficer, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Paper } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";
import { TakePositionProps } from "./TakePosition";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { HexType } from "../../../../scripts/common";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

export function RemoveOfficer({seqOfMotion, seqOfPos, setOpen, refresh}:TakePositionProps) {

  const {gk, setErrMsg} = useComBooxContext();
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: removeOfficerLoading,
    write: removeOfficer,
  } = useGeneralKeeperRemoveOfficer({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    removeOfficer({
      args: [seqOfMotion, BigInt(seqOfPos)],
    })
  }

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <LoadingButton
        disabled={ removeOfficerLoading }
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<FollowTheSigns />}
        sx={{ m:1, mr:6 }}
        onClick={ handleClick }
      >
        Remove Officer
      </LoadingButton>

    </Paper>
  );
}