
import { Paper } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useGeneralKeeperPayOffRejectedDeal } from "../../../../../generated";
import { ActionsOfSwapProps } from "../ActionsOfSwap";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../../scripts/common";
import { refreshAfterTx } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

export function PayOffSwap({addr, deal, seqOfSwap, setShow}: ActionsOfSwapProps) {

  const { gk, setErrMsg } = useComBooxContext();

  const [ loading, setLoading ] = useState(false);

  const refresh = ()=>{
    setLoading(false);
    setShow(false);
  }

  const {
    isLoading: payOffSwapLoading,
    write: payOffSwap,
  } = useGeneralKeeperPayOffRejectedDeal({
    address: gk,
    args: [addr, BigInt(deal.head.seqOfDeal), BigInt(seqOfSwap)],
    onError(err) {
      setErrMsg(err.message);
    },
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
        disabled={ payOffSwapLoading || !seqOfSwap }
        loading = {loading}
        loadingPosition="end"
        endIcon={<Payment />}
        sx={{ m:1, height: 40, minWidth:218 }}
        onClick={ ()=>payOffSwap?.() }
      >
        Payoff 
      </LoadingButton>

    </Paper>
  );
}