import { useGeneralKeeperTakeSeat } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../scripts/common";
import { Button, Paper } from "@mui/material";
import { Chair } from "@mui/icons-material";
import { TakePositionProps } from "../../bmm/ExecMotions/TakePosition";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

export function TakeSeat({seqOfMotion, seqOfPos, setOpen, refresh}:TakePositionProps) {

  const { gk } = useComBooxContext();
  const [ loading, setLoading ] = useState(false);
  
  const updateResults = ()=>{
    refresh();
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: takeSeatLoading,
    write: takeSeat,
  } = useGeneralKeeperTakeSeat({
    address: gk,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    takeSeat({
      args: [BigInt(seqOfMotion), BigInt(seqOfPos)],
    })  
  }

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <LoadingButton
        disabled={ !takeSeat || takeSeatLoading}
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<Chair />}
        sx={{ m:1, mr:6 }}
        onClick={ handleClick }
      >
        Take Seat
      </LoadingButton>

    </Paper>
  );
}