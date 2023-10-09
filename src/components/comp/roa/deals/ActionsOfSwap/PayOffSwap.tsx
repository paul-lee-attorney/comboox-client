
import { Button, Paper } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useGeneralKeeperPayOffRejectedDeal } from "../../../../../generated";
import { ActionsOfSwapProps } from "../ActionsOfSwap";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";

export function PayOffSwap({addr, deal, seqOfSwap, setShow}: ActionsOfSwapProps) {

  const { gk } = useComBooxContext();

  const {
    isLoading: payOffSwapLoading,
    write: payOffSwap,
  } = useGeneralKeeperPayOffRejectedDeal({
    address: gk,
    args: [addr, BigInt(deal.head.seqOfDeal), BigInt(seqOfSwap)],
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
        disabled={ payOffSwapLoading || !seqOfSwap }
        endIcon={<Payment />}
        sx={{ m:1, height: 40, minWidth:218 }}
        onClick={ ()=>payOffSwap?.() }
      >
        Payoff 
      </Button>

    </Paper>
  );
}