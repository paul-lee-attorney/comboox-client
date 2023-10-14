import { IconButton, Tooltip } from "@mui/material";
import { useGeneralKeeperPickupDeposit } from "../../../generated";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { Savings, SavingsOutlined } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";
import { HexType } from "../../../scripts/common";
import { refreshAfterTx } from "../../../scripts/common/toolsKit";


interface PickupDepositProps{
  refresh: ()=>void;
}

export function PickupDeposit({ refresh }:PickupDepositProps) {
  
  const { gk } = useComBooxContext();

  const {
    isLoading: pickupDepositLoading,
    write: pickupDeposit,
  } = useGeneralKeeperPickupDeposit({
    address: gk,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
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
          disabled={ pickupDepositLoading }
          onClick={()=>pickupDeposit?.()}
          color="primary"
        >
          <SavingsOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
}