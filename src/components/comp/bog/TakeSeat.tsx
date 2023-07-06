import { BigNumber } from "ethers";
import { useGeneralKeeperTakeSeat, usePrepareGeneralKeeperTakeSeat } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { HexType } from "../../../interfaces";
import { Button, Paper } from "@mui/material";
import { Chair } from "@mui/icons-material";


interface TakeSeatProps {
  seqOfMotion: string;
  seqOfPos: number;  
  setOpen: (flag: boolean) => void;
  getMotionsList: (minutes: HexType)=>any;
}


export function TakeSeat({seqOfMotion, seqOfPos, setOpen, getMotionsList}:TakeSeatProps) {

  const {gk, boox} = useComBooxContext();
  
  const {
    config: takeSeatConfig,
  } = usePrepareGeneralKeeperTakeSeat({
    address: gk,
    args: [BigNumber.from(seqOfMotion), BigNumber.from(seqOfPos)]
  })

  const {
    isLoading: takeSeatLoading,
    write: takeSeat,
  } = useGeneralKeeperTakeSeat({
    ...takeSeatConfig,
    onSuccess(){
      if (boox) {
        getMotionsList(boox[3]);
        setOpen(false);
      }
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Button
        disabled={ !takeSeat || takeSeatLoading}
        variant="contained"
        endIcon={<Chair />}
        sx={{ m:1, mr:6 }}
        onClick={()=>takeSeat?.()}
      >
        Take Seat
      </Button>

    </Paper>
  );
}