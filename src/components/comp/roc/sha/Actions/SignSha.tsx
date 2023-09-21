import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useGeneralKeeperSignSha, useSigPageEstablished, useSigPageGetParasOfPage } from "../../../../../generated";
import { Bytes32Zero, HexType } from "../../../../../scripts/common";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { DriveFileRenameOutline, Fingerprint } from "@mui/icons-material";
import { useState } from "react";
import { ParasOfSigPage, parseParasOfPage } from "../../../../../scripts/common/sigPage";
import { HexParser } from "../../../../../scripts/common/toolsKit";
import { FileHistoryProps } from "./CirculateSha";


export function SignSha({ addr, setNextStep }: FileHistoryProps) {

  const [ parasOfPage, setParasOfPage ] = useState<ParasOfSigPage>();
  
  const {
    refetch: getParasOfPage
  } = useSigPageGetParasOfPage({
    address: addr,
    args: [true],
    onSuccess(res) {
      setParasOfPage(parseParasOfPage(res));
    }
  })

  const {
    refetch: isEstablished
  } = useSigPageEstablished({
    address: addr,
    onSuccess(res) {
      if (res) setNextStep(3);
    }
  })

  const { gk } = useComBooxContext();
  const [sigHash, setSigHash] = useState<HexType>(Bytes32Zero);

  const {
    isLoading,
    write
  } = useGeneralKeeperSignSha({
    address: gk,
    args: sigHash 
        ? [addr, sigHash]
        : undefined,
    onSuccess() {
      getParasOfPage();
      isEstablished();
    }
  });

  return (
    <Stack direction={'row'} sx={{m:1, p:1, alignItems:'center'}}>

      <TextField
        sx={{ m: 1, minWidth: 650 }} 
        id="tfSigHash" 
        label="SigHash / CID in IPFS" 
        variant="outlined"
        onChange={e => setSigHash(HexParser( e.target.value ))}
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