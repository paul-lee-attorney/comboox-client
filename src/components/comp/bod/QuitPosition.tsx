import { BigNumber } from "ethers";
import { useGeneralKeeperQuitPosition, usePrepareGeneralKeeperQuitPosition } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";


interface QuitPositionProps{
  seq: number;
  setOpen: (flag:boolean)=>void;
  refreshPosition: ()=>void;
}

export function QuitPosition({seq, setOpen, refreshPosition}: QuitPositionProps) {

  const { gk } = useComBooxContext();

  const {
    config: quitPositionConfig
  } = usePrepareGeneralKeeperQuitPosition({
    address: gk,
    args: [BigNumber.from(seq)],
  })

  const {
    isLoading: quitPositionLoading,
    write: quitPosition,
  } = useGeneralKeeperQuitPosition({
    ...quitPositionConfig,
    onSuccess() {
      refreshPosition();
      setOpen(false);
    }
  })

  return(
    <Button
      sx={{m:1, mr:5, p:1, minWidth:128 }}
      variant="outlined"
      color="error" 
      disabled={!quitPosition || quitPositionLoading}
      onClick={ quitPosition }
      endIcon={<FollowTheSigns />}
    >
      Quit
    </Button>
  );
}