
import { Button } from "@mui/material";
import { 
  useGeneralKeeperActivateSha,
} from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { LightMode } from "@mui/icons-material";
import { FileHistoryProps } from "./CirculateSha";
import { HexType } from "../../../../../scripts/common";
import { refreshAfterTx } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

export function ActivateSha({ addr, setNextStep }: FileHistoryProps) {

  const { gk, setErrMsg } = useComBooxContext();

  const [ loading, setLoading ] = useState(false);

  const refresh = ()=>{
    setLoading(false);
    setNextStep(7);
  }

  const {
    isLoading,
    write,
  } = useGeneralKeeperActivateSha({
    address: gk,
    args: [ addr ],
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (
    <LoadingButton
      disabled={isLoading}
      loading = {loading}
      loadingPosition="end"
      variant="contained"
      endIcon={<LightMode />}
      sx={{ m:1, minWidth:218 }}
      onClick={()=>write?.()}
    >
      Activate
    </LoadingButton>
  )

}