import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useGeneralKeeperSignSha } from "../../../../../generated";
import { Bytes32Zero, HexType } from "../../../../../scripts/common";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ParasOfSigPage, established, getParasOfPage, parseParasOfPage } from "../../../../../scripts/common/sigPage";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyNum } from "../../../../../scripts/common/toolsKit";
import { FileHistoryProps } from "./CirculateSha";

export function SignSha({ addr, setNextStep }: FileHistoryProps) {

  const [ parasOfPage, setParasOfPage ] = useState<ParasOfSigPage>();
  
  const { gk } = useComBooxContext();
  const [sigHash, setSigHash] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: signShaLoading,
    write: signSha
  } = useGeneralKeeperSignSha({
    address: gk,
    args: sigHash && !hasError(valid) 
        ? [addr, sigHash]
        : undefined,
  });

  useEffect(()=>{
    getParasOfPage(addr, true).then(
      para => setParasOfPage(parseParasOfPage(para))
    );
    established(addr).then(
      flag => {
        if (flag) setNextStep(3);
      }
    )
  }, [addr, signSha, setNextStep])

  return (
    <Stack direction={'row'} sx={{m:1, p:1, alignItems:'center'}}>

      <TextField
        sx={{ m: 1, minWidth: 650 }} 
        id="tfSigHash" 
        label="SigHash / CID in IPFS" 
        variant="outlined"
        error={ valid['SigHash']?.error }
        helperText={ valid['SigHash']?.helpTx }
        onChange={e => {
          let input = HexParser( e.target.value );
          onlyHex('SigHash', input, 64, setValid);
          setSigHash(input);
        }}
        value = { sigHash }
        size='small'
      />                                            

      <Button
        disabled={signShaLoading || hasError(valid)}
        variant="contained"
        endIcon={<DriveFileRenameOutline />}
        sx={{ m:1, height:40, minWidth:218 }}
        onClick={()=>signSha?.()}
      >
        Sign Sha
      </Button>

      {parasOfPage && (
        <Box sx={{ width:280, m:1 }} >        
          <Alert 
            variant='outlined' 
            severity='info'
            sx={{ height: 45,  p:0.5 }} 
          >
            Sigers / Parties: { parasOfPage?.counterOfSigs +'/'+ parasOfPage?.counterOfBlanks } 
          </Alert>
        </Box>  
      )}


    </Stack>
  )

}