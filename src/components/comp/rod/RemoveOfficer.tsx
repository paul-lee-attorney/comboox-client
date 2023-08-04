import { 
  useGeneralKeeperRemoveOfficer, 
} from "../../../generated";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Paper } from "@mui/material";
import { FollowTheSigns } from "@mui/icons-material";


interface RemoveOfficerProps {
  seqOfMotion: string;
  seqOfPos: number;  
  setOpen: (flag: boolean) => void;
  getMotionsList: ()=>any;
}


export function RemoveOfficer({seqOfMotion, seqOfPos, setOpen, getMotionsList}:RemoveOfficerProps) {

  const {gk, boox} = useComBooxContext();
  
  // const {
  //   config: removeOfficerConfig,
  // } = usePrepareGeneralKeeperRemoveOfficer({
  //   address: gk,
  //   args: [BigInt(seqOfMotion), BigInt(seqOfPos)]
  // })

  const {
    isLoading: removeOfficerLoading,
    write: removeOfficer,
  } = useGeneralKeeperRemoveOfficer({
    address: gk,
    args: [BigInt(seqOfMotion), BigInt(seqOfPos)],
    onSuccess(){
      getMotionsList();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ removeOfficerLoading }
        variant="contained"
        endIcon={<FollowTheSigns />}
        sx={{ m:1, mr:6 }}
        onClick={()=>removeOfficer?.()}
      >
        Remove Officer
      </Button>

    </Paper>
  );
}