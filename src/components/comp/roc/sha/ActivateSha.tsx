
import { Button } from "@mui/material";
import { 
  useGeneralKeeperActivateSha,
} from "../../../../generated";

import { FileHistoryProps, } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { LightMode } from "@mui/icons-material";

export function ActivateSha({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const {
    isLoading,
    write,
  } = useGeneralKeeperActivateSha({
    address: gk,
    args: [ addr ],
    onSuccess() {
      setNextStep(7);
    }
  });

  return (
    <Button
      disabled={isLoading}
      variant="contained"
      endIcon={<LightMode />}
      sx={{ m:1, minWidth:218 }}
      onClick={()=>write?.()}
    >
      Activate
    </Button>
  )

}