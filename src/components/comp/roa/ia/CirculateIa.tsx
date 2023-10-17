import { Button, Divider, Stack, TextField } from "@mui/material";
import { useGeneralKeeperCirculateIa } from "../../../../generated";
import { Bytes32Zero, HexType, } from "../../../../scripts/common";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Recycling } from "@mui/icons-material";
import { useState } from "react";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { FileHistoryProps } from "../../roc/sha/Actions/CirculateSha";

export function CirculateIa({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const [ docUrl, setDocUrl ] = useState<HexType>(Bytes32Zero);
  const [ docHash, setDocHash ] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const refresh = ()=>{
    setNextStep(2);
  }

  const {
    isLoading,
    write
  } = useGeneralKeeperCirculateIa({
    address: gk,
    args: [addr, docUrl, docHash],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (

    <Stack direction={'row'} sx={{m:1, p:1, alignItems:'center'}}>

      <Stack direction='column' >

        <TextField
          sx={{ m: 1, minWidth: 650 }} 
          id="tfDocUrl" 
          label="DocUrl / CID in IPFS" 
          variant="outlined"
          error={ valid['DocUrl']?.error }
          helperText={ valid['DocUrl']?.helpTx }
          onChange={e => {
            let input = HexParser( e.target.value );
            onlyHex('DocUrl', input, 64, setValid);
            setDocUrl(input);
          }}
          value = { docUrl }
          size='small'
        />                                            

        <TextField
          sx={{ m: 1, minWidth: 650 }} 
          id="tfDocHash" 
          label="DocHash" 
          variant="outlined"
          error={ valid['DocHash']?.error }
          helperText={ valid['DocHash']?.helpTx }
          onChange={e => {
            let input = HexParser( e.target.value );
            setDocHash(input);
          }}
          value = { docHash }
          size='small'
        />                                            

      </Stack>

      <Divider orientation="vertical" sx={{ m:1 }} flexItem />

      <Button
        disabled={ isLoading || hasError(valid)}
        variant="contained"
        endIcon={<Recycling />}
        sx={{ m:1, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Circulate Ia
      </Button>

    </Stack>
  )

}