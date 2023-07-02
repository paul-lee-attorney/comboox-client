import { BigNumber } from "ethers";
import { 
  useGeneralKeeperRemoveOfficer, 
  usePrepareGeneralKeeperRemoveOfficer 
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
  
  const {
    config: removeOfficerConfig,
  } = usePrepareGeneralKeeperRemoveOfficer({
    address: gk,
    args: [BigNumber.from(seqOfMotion), BigNumber.from(seqOfPos)]
  })

  const {
    isLoading: removeOfficerLoading,
    write: removeOfficer,
  } = useGeneralKeeperRemoveOfficer({
    ...removeOfficerConfig,
    onSuccess(){
      getMotionsList();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ !removeOfficer || removeOfficerLoading}
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