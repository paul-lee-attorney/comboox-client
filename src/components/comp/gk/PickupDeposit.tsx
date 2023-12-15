import { IconButton, Tooltip } from "@mui/material";
import { useGeneralKeeperPickupDeposit } from "../../../generated";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { SavingsOutlined } from "@mui/icons-material";
import { useState } from "react";
import { HexType } from "../../../scripts/common";
import { refreshAfterTx } from "../../../scripts/common/toolsKit";


interface PickupDepositProps{
  refresh: ()=>void;
}

export function PickupDeposit({ refresh }:PickupDepositProps) {
  
  const { gk, setErrMsg } = useComBooxContext();
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
  }

  const {
    isLoading: pickupDepositLoading,
    write: pickupDeposit,
  } = useGeneralKeeperPickupDeposit({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return(
    <Tooltip 
      title='Pickup Deposits' 
      placement='right' 
      arrow 
    >
      <span>
        <IconButton 
          sx={{mx:1}}
          size="large"
          disabled={ pickupDepositLoading || loading}
          onClick={()=>pickupDeposit?.()}
          color="primary"
        >
          <SavingsOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
}