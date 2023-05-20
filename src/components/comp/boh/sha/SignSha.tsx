import { Button, Tooltip } from "@mui/material";
import { useGeneralKeeperSignSha, usePrepareGeneralKeeperSignSha } from "../../../../generated";
import { Bytes32Zero, ContractProps, HexType } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Fingerprint } from "@mui/icons-material";



interface SignShaProps {
  addr: HexType,
  refreshSellers: () => void,
  refreshBuyers: () => void,
}

export function SignSha({ addr, refreshSellers, refreshBuyers }: SignShaProps) {

  const { gk } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperSignSha({
    address: gk,
    args: [addr, Bytes32Zero],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperSignSha({
    ...config,
    onSuccess() {
      refreshSellers();
      refreshBuyers();
    }
  });

  return (
    <Tooltip
      title='Sign Doc'
      placement="top"
      arrow
    >          
      <Button
        disabled={!write || isLoading}
        variant="contained"
        endIcon={<Fingerprint />}
        sx={{ m:1, mr:6 }}
        onClick={()=>write?.()}
      >
        Sign Sha
      </Button>

    </Tooltip>
  )

}