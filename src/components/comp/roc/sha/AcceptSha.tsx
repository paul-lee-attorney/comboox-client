import { Button, Stack, TextField } from "@mui/material";
import { useGeneralKeeperAcceptSha } from "../../../../generated";
import { Bytes32Zero, HexType } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { useState } from "react";
import { HexParser } from "../../../../scripts/toolsKit";

interface AcceptShaProps {
  getBuyers:()=>void;
  getSellers:()=>void;
}

export function AcceptSha({getBuyers, getSellers}:AcceptShaProps) {

  const { gk } = useComBooxContext();
  const [sigHash, setSigHash] = useState<HexType>(Bytes32Zero);

  const {
    isLoading,
    write
  } = useGeneralKeeperAcceptSha({
    address: gk,
    args: [ sigHash ],
    onSuccess() {
      getBuyers();
      getSellers();
    }
  });

  return (
    <Stack direction='row' sx={{ alignItems:'center' }}>

      <TextField
        sx={{ m: 1, minWidth: 650 }} 
        id="tfSigHash" 
        label="SigHash / CID in IPFS" 
        variant="outlined"
        onChange={e => setSigHash( HexParser( e.target.value ) )}
        value = { sigHash }
        size='small'
      />                                            

      <Button
        disabled={isLoading}
        variant="contained"
        endIcon={<DriveFileRenameOutline />}
        sx={{ m:1, height:40, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Accept Sha
      </Button>

    </Stack>
  )

}