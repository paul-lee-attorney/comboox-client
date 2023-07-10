import { BigNumber } from "ethers";
import { useGeneralKeeperRemoveDirector, usePrepareGeneralKeeperRemoveDirector } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { HexType } from "../../../interfaces";
import { Button, Paper } from "@mui/material";
import { Chair, FollowTheSigns } from "@mui/icons-material";


interface RemoveDirectorProps {
  seqOfMotion: string;
  seqOfPos: number;  
  setOpen: (flag: boolean) => void;
  getMotionsList: (minutes: HexType)=>any;
}


export function RemoveDirector({seqOfMotion, seqOfPos, setOpen, getMotionsList}:RemoveDirectorProps) {

  const {gk, boox} = useComBooxContext();
  
  const {
    config: removeDirectorConfig,
  } = usePrepareGeneralKeeperRemoveDirector({
    address: gk,
    args: [BigNumber.from(seqOfMotion), BigNumber.from(seqOfPos)]
  })

  const {
    isLoading: removeDirectorLoading,
    write: removeDirector,
  } = useGeneralKeeperRemoveDirector({
    ...removeDirectorConfig,
    onSuccess(){
      if (boox) {
        getMotionsList(boox[5]);
        setOpen(false);
      }
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