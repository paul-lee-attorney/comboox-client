import { BigNumber } from "ethers";
import { useGeneralKeeperRemoveDirector, usePrepareGeneralKeeperRemoveDirector } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { HexType } from "../../../interfaces";
import { Button } from "@mui/material";
import { Chair } from "@mui/icons-material";


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
      getMotionsList(boox[3]);
      setOpen(false);
    }
  })

  return (
    <Button
      disabled={ !removeDirector || removeDirectorLoading}
      variant="contained"
      endIcon={<Chair />}
      sx={{ m:1, mr:6 }}
      onClick={()=>removeDirector?.()}
    >
      Remove Director
    </Button>
  );
}