import { Button, Stack, TextField } from "@mui/material";
import { useGeneralKeeperAcceptSha } from "../../../../../generated";
import { Bytes32Zero, HexType } from "../../../../../scripts/common";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

interface AcceptShaProps {
  setTime:Dispatch<SetStateAction<number>>;
}

export function AcceptSha({ setTime }:AcceptShaProps) {

  const { gk } = useComBooxContext();
  const [sigHash, setSigHash] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const refresh = ()=> {
    setLoading(false);
    setTime(Date.now());
  }

  const {
    isLoading,
    write
  } = useGeneralKeeperAcceptSha({
    address: gk,
    args: !hasError(valid) ? [ sigHash ] : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (
    <Stack direction='row' sx={{ alignItems:'center' }}>

      <TextField
        sx={{ m: 1, minWidth: 650 }} 
        id="tfSigHash" 
        label="SigHash / CID in IPFS" 
        variant="outlined"
        error={ valid['SigHash']?.error }
        helperText={ valid['SigHash']?.helpTx ?? ' ' }
        onChange={e => {
          let input = HexParser( e.target.value );
          onlyHex('SigHash', input, 64, setValid);
          setSigHash( input );
        }}
        value = { sigHash }
        size='small'
      />                                            

      <LoadingButton
        disabled={isLoading || hasError(valid)}
        loading = {loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<DriveFileRenameOutline />}
        sx={{ m:1, height:40, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Accept Sha
      </LoadingButton>

    </Stack>
  )

}