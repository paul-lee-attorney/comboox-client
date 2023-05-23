import { Button } from "@mui/material";
import { useGeneralKeeperCirculateSha, usePrepareGeneralKeeperCirculateSha } from "../../../../generated";
import { Bytes32Zero, FileHistoryProps, } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Outbox, Recycling, Share } from "@mui/icons-material";

export function CirculateSha({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperCirculateSha({
    address: gk,
    args: [addr, Bytes32Zero, Bytes32Zero],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperCirculateSha({
    ...config,
    onSuccess() {
      setNextStep(2);
    }
  });

  return (
    <Button
      disabled={!write || isLoading}
      variant="contained"
      endIcon={<Recycling />}
      sx={{ m:1, minWidth:218 }}
      onClick={()=>write?.()}
    >
      Circulate
    </Button>
  )

}