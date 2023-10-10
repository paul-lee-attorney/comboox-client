import { useGeneralKeeperQuitPosition } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";


interface QuitPositionProps{
  seq: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTime: Dispatch<SetStateAction<number>>;
}

export function QuitPosition({seq, setOpen, setTime}: QuitPositionProps) {

  const { gk } = useComBooxContext();

  const {
    isLoading: quitPositionLoading,
    write: quitPosition,
  } = useGeneralKeeperQuitPosition({
    address: gk,
    args: [BigInt(seq)],
    onSuccess() {
      setTime(Date.now());
      setOpen(false);
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