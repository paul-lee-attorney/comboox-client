import { Alert, Box, Button, Stack, Tooltip } from "@mui/material";
import { useGeneralKeeperSignSha, usePrepareGeneralKeeperSignSha, useSigPageGetParasOfPage } from "../../../../generated";
import { Bytes32Zero, ContractProps, FileHistoryProps, HexType } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { DriveFileRenameOutline, Fingerprint } from "@mui/icons-material";
import { useState } from "react";

interface StrParasOfSigPageType {
  circulateDate: number,
  established: boolean,
  counterOfBlanks: string,
  counterOfSigs: string,
  signingDays: string,
  closingDays: string,
}

function parseParasOfPage(data: any): StrParasOfSigPageType {
  let output: StrParasOfSigPageType = {
    circulateDate: data.sigDate,
    established: data.flag,
    counterOfBlanks: data.para.toString(),
    counterOfSigs: data.arg.toString(),
    signingDays: data.seq.toString(),
    closingDays: data.attr.toString(),
  }
  return output;
}

export function SignSha({ addr, setNextStep }: FileHistoryProps) {
  const [ parasOfPage, setParasOfPage ] = useState<StrParasOfSigPageType>();

  const {
    refetch: refetchParasOfPage
  } = useSigPageGetParasOfPage({
    address: addr,
    args: [true],
    onSuccess(data) {
      setParasOfPage(parseParasOfPage(data));
      if (data.flag)
        setNextStep(3);
    }
  })

  const { gk } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperSignSha({
    address: gk,
    args: [addr, Bytes32Zero],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperSignSha({
    ...config,
    onSuccess() {
      refetchParasOfPage();
    }
  });

  return (
    <Stack direction={'row'} sx={{m:1, p:1, alignItems:'center'}}>
      <Button
        disabled={!write || isLoading}
        variant="contained"
        endIcon={<DriveFileRenameOutline />}
        sx={{ m:1, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Sign Sha
      </Button>

      {parasOfPage && (
        <Box sx={{ width:280 }} >        
          <Alert 
            variant='outlined' 
            severity='info' 
            sx={{ height: 55,  m: 1 }} 
          >
            Sigers / Parties: { parasOfPage?.counterOfSigs +'/'+ parasOfPage?.counterOfBlanks } 
          </Alert>
        </Box>  
      )}


    </Stack>
  )

}