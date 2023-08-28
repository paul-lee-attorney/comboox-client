import { Alert, Box, Button, Stack, TextField, } from "@mui/material";
import { useGeneralKeeperSignIa, useSigPageEstablished, useSigPageGetParasOfPage } from "../../../../generated";
import { Bytes32Zero, FileHistoryProps, HexType, } from "../../../../scripts/common";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { useState } from "react";
import { ParasOfSigPage, parseParasOfPage } from "../../../../scripts/common/sigPage";
import { HexParser } from "../../../../scripts/common/toolsKit";

export function SignIa({ addr, setNextStep }: FileHistoryProps) {
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
  } = useGeneralKeeperSignIa({
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
        disabled={!write || isLoading}
        variant="contained"
        endIcon={<DriveFileRenameOutline />}
        sx={{ m:1, minWidth:218, height:40 }}
        onClick={()=>write?.()}
      >
        Sign Ia
      </Button>

      {parasOfPage && (
        <Box sx={{ width:280 }} >        
          <Alert 
            variant='outlined' 
            severity='info' 
            sx={{ height: 45, p:0.5 }} 
          >
            Sigers / Parties: { parasOfPage?.counterOfSigs +'/'+ parasOfPage?.counterOfBlanks } 
          </Alert>
        </Box>  
      )}

    </Stack>
  )

}