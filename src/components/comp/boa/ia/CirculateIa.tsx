import { Button } from "@mui/material";
import { useGeneralKeeperCirculateIa, usePrepareGeneralKeeperCirculateIa } from "../../../../generated";
import { Bytes32Zero, FileHistoryProps, } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Recycling } from "@mui/icons-material";

export function CirculateIa({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperCirculateIa({
    address: gk,
    args: [addr, Bytes32Zero, Bytes32Zero],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperCirculateIa({
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