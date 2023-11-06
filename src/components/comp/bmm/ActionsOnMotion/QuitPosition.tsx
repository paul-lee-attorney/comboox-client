import { useGeneralKeeperQuitPosition } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import { HexType } from "../../../../scripts/common";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";


interface QuitPositionProps{
  seq: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: ()=>void;
}

export function QuitPosition({seq, setOpen, refresh}: QuitPositionProps) {

  const { gk, setErrMsg } = useComBooxContext();
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: quitPositionLoading,
    write: quitPosition,
  } = useGeneralKeeperQuitPosition({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  })

  const handleClick = ()=>{
    quitPosition({
      args: [BigInt(seq)],
    })
  }

  return(
    <LoadingButton
      sx={{m:1, mr:5, p:1, minWidth:128 }}
      loading={loading}
      loadingPosition="end"
      variant="outlined"
      color="error" 
      disabled={ quitPositionLoading }
      onClick={ handleClick }
      endIcon={<FollowTheSigns />}
    >
      Quit
    </LoadingButton>
  );
}