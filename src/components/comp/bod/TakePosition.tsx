import { bigint } from "ethers";

import { 
  useGeneralKeeperTakePosition, 
  usePrepareGeneralKeeperTakePosition,
} from "../../../generated";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Paper } from "@mui/material";
import { Chair } from "@mui/icons-material";

interface TakePositionProps {
  seqOfMotion: string;
  seqOfPos: number;  
  setOpen: (flag: boolean) => void;
  getMotionsList: ()=>any;
}


export function TakePosition({seqOfMotion, seqOfPos, setOpen, getMotionsList}:TakePositionProps) {

  const { gk } = useComBooxContext();
  
  // const {
  //   config: takePositionConfig,
  // } = usePrepareGeneralKeeperTakePosition({
  //   address: gk,
  //   args: [BigInt(seqOfMotion), BigInt(seqOfPos)]
  // })

  const {
    isLoading: takePositionLoading,
    write: takePosition,
  } = useGeneralKeeperTakePosition({
    address: gk,
    args: [BigInt(seqOfMotion), BigInt(seqOfPos)]
    onSuccess(){
        getMotionsList();
        setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ !takePosition || takePositionLoading}
        variant="contained"
        endIcon={<Chair />}
        sx={{ m:1, mr:6 }}
        onClick={()=>takePosition?.()}
      >
        Take Position
      </Button>

    </Paper>
  );
}