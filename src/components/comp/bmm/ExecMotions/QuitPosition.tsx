import { useGeneralKeeperQuitPosition } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";
import { HexType } from "../../../../scripts/common";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";


interface QuitPositionProps{
  seq: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: ()=>void;
}

export function QuitPosition({seq, setOpen, refresh}: QuitPositionProps) {

  const { gk } = useComBooxContext();

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: quitPositionLoading,
    write: quitPosition,
  } = useGeneralKeeperQuitPosition({
    address: gk,
    args: [BigInt(seq)],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  })

  return(
    <Button
      sx={{m:1, mr:5, p:1, minWidth:128 }}
      variant="outlined"
      color="error" 
      disabled={ quitPositionLoading }
      onClick={ ()=>quitPosition?.() }
      endIcon={<FollowTheSigns />}
    >
      Quit
    </Button>
  );
}