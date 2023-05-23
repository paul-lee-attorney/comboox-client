import { useState } from "react";

import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { 
  useGeneralKeeperActivateSha,
  usePrepareGeneralKeeperActivateSha, 
} from "../../../../generated";

import { FileHistoryProps, } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { LightMode } from "@mui/icons-material";

export function ActivateSha({ addr, setActiveStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperActivateSha({
    address: gk,
    args: [ addr ],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperActivateSha({
    ...config,
    onSuccess() {
      setActiveStep(7);
    }
  });

  return (
    <Button
      disabled={!write || isLoading}
      variant="contained"
      endIcon={<LightMode />}
      sx={{ m:1, minWidth:218 }}
      onClick={()=>write?.()}
    >
      Activate
    </Button>
  )

}