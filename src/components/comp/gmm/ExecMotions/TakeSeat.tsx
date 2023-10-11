import { useGeneralKeeperTakeSeat } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../scripts/common";
import { Button, Paper } from "@mui/material";
import { Chair } from "@mui/icons-material";
import { TakePositionProps } from "../../bmm/ExecMotions/TakePosition";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function TakeSeat({seqOfMotion, seqOfPos, setOpen, refresh}:TakePositionProps) {

  const { gk } = useComBooxContext();
  
  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: takeSeatLoading,
    write: takeSeat,
  } = useGeneralKeeperTakeSeat({
    address: gk,
    args: [BigInt(seqOfMotion), BigInt(seqOfPos)],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

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