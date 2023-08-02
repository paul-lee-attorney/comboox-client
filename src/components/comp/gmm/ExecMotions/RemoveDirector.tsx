import { useGeneralKeeperRemoveDirector } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { HexType } from "../../../../interfaces";
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
    isLoading: removeDirectorLoading,
    write: removeDirector,
  } = useGeneralKeeperRemoveDirector({
    address: gk,
    args: [BigInt(seqOfMotion), BigInt(seqOfPos)],
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