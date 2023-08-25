import { IconButton, Tooltip } from "@mui/material";
import { useGeneralKeeperPickupDeposit } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Savings, SavingsOutlined } from "@mui/icons-material";


interface PickupDepositProps{
  getBalanceOf: ()=>void;
}

export function PickupDeposit({ getBalanceOf }:PickupDepositProps) {
  
  const { gk } = useComBooxContext();

  const {
    isLoading: pickupDepositLoading,
    write: pickupDeposit,
  } = useGeneralKeeperPickupDeposit({
    address: gk,
    onSuccess() {
      getBalanceOf();
    }
  })

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