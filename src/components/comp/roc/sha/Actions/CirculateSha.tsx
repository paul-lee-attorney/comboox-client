import { Button, Divider, Stack, TextField } from "@mui/material";
import { useGeneralKeeperCirculateSha } from "../../../../../generated";
import { Bytes32Zero, HexType } from "../../../../../scripts/common";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Recycling } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import { FormResults, HexParser, defFormResults, hasError, onlyHex } from "../../../../../scripts/common/toolsKit";

export interface FileHistoryProps {
  addr: HexType,
  setNextStep: Dispatch<SetStateAction<number>>;
}

export function CirculateSha({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const [ docUrl, setDocUrl ] = useState<HexType>(Bytes32Zero);
  const [ docHash, setDocHash ] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading,
    write
  } = useGeneralKeeperCirculateSha({
    address: gk,
    args: [addr, docUrl, docHash],
    onSuccess() {
      setNextStep(2);
    }
  });

  return (
    <Stack direction='row' sx={{m:1, alignItems:'center'}}>

      <Stack direction='column' >

        <TextField 
          sx={{ m: 1, minWidth: 650 }} 
          id="tfUrlOfDoc" 
          label="UrlOfDoc / CID in IPFS" 
          variant="outlined"
          error={ valid['UrlOfDoc']?.error }
          helperText={ valid['UrlOfDoc']?.helpTx }
          onChange={e => {
            let input = HexParser( e.target.value );
            onlyHex('UrlOfDoc', input, 64, setValid); 
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
            onlyHex('DocHash', input, 64, setValid);
            setDocHash(input);
          }}
          value = { docHash }
          size='small'
        />                                            

      </Stack>
      
      <Divider orientation="vertical" sx={{ m:1 }} flexItem />
      
      <Button
        disabled={!write || isLoading || hasError(valid)}
        variant="contained"
        endIcon={<Recycling />}
        sx={{ m:1, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Circulate Sha
      </Button>

    </Stack>
  )

}