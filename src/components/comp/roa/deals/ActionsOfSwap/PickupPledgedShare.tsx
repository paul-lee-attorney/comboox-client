import { Paper } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import { useGeneralKeeperPickupPledgedShare } from "../../../../../generated";
import { ActionsOfSwapProps } from "../ActionsOfSwap";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../../scripts/common";
import { refreshAfterTx } from "../../../../../scripts/common/toolsKit";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

export function PickupPledgedShare({addr, deal, seqOfSwap, setShow}: ActionsOfSwapProps) {

  const { gk } = useComBooxContext();
  const [ loading, setLoading ] = useState(false);

  const refresh = ()=>{
    setLoading(false);
    setShow(false);
  }

  const {
    isLoading: pickupPledgedShareLoading,
    write: pickupPledgedShare,
  } = useGeneralKeeperPickupPledgedShare({
    address: gk,
    args: [addr, BigInt(deal.head.seqOfDeal), BigInt(seqOfSwap)],
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (
    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >

      <LoadingButton
        variant="outlined"
        disabled={ pickupPledgedShareLoading || !seqOfSwap }
        loading = {loading}
        loadingPosition="end"
        endIcon={<LockOpen />}
        sx={{ m:1, height: 40, minWidth:218 }}
        onClick={ ()=>pickupPledgedShare?.() }
      >
        Pickup 
      </LoadingButton>

    </Paper>
  );
}