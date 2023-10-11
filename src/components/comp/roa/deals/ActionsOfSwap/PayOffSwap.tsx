
import { Button, Paper } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useGeneralKeeperPayOffRejectedDeal } from "../../../../../generated";
import { ActionsOfSwapProps } from "../ActionsOfSwap";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../../scripts/common";
import { refreshAfterTx } from "../../../../../scripts/common/toolsKit";

export function PayOffSwap({addr, deal, seqOfSwap, setShow}: ActionsOfSwapProps) {

  const { gk } = useComBooxContext();

  const refresh = ()=>{
    setShow(false);
  }

  const {
    isLoading: payOffSwapLoading,
    write: payOffSwap,
  } = useGeneralKeeperPayOffRejectedDeal({
    address: gk,
    args: [addr, BigInt(deal.head.seqOfDeal), BigInt(seqOfSwap)],
    onSuccess(data) {
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