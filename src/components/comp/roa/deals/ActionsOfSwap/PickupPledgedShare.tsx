import { Button, Paper } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import { useGeneralKeeperPickupPledgedShare } from "../../../../../generated";
import { ActionsOfSwapProps } from "../ActionsOfSwap";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";

export function PickupPledgedShare({ia, deal, seqOfSwap, setShow}: ActionsOfSwapProps) {

  const { gk } = useComBooxContext();

  const {
    isLoading: pickupPledgedShareLoading,
    write: pickupPledgedShare,
  } = useGeneralKeeperPickupPledgedShare({
    address: gk,
    args: [ia, BigInt(deal.head.seqOfDeal), BigInt(seqOfSwap)],
    onSuccess() {
      setShow(false);
    }
  })

  return (
    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >

      <Button
        variant="outlined"
        disabled={ pickupPledgedShareLoading || !seqOfSwap }
        endIcon={<LockOpen />}
        sx={{ m:1, height: 40, minWidth:218 }}
        onClick={ ()=>pickupPledgedShare?.() }
      >
        Pickup 
      </Button>

    </Paper>
  );
}