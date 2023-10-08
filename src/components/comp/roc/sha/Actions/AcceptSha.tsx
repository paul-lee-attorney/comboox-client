import { Button, Stack, TextField } from "@mui/material";
import { useGeneralKeeperAcceptSha } from "../../../../../generated";
import { Bytes32Zero, HexType } from "../../../../../scripts/common";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import { HexParser } from "../../../../../scripts/common/toolsKit";

interface AcceptShaProps {
  setTime:Dispatch<SetStateAction<number>>;
}

export function AcceptSha({ setTime }:AcceptShaProps) {

  const { gk } = useComBooxContext();
  const [sigHash, setSigHash] = useState<HexType>(Bytes32Zero);

  const {
    isLoading,
    write
  } = useGeneralKeeperAcceptSha({
    address: gk,
    args: [ sigHash ],
    onSuccess() {
      setTime(Date.now());
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