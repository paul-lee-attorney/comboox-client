import { Button, Divider, Stack, TextField } from "@mui/material";
import { useGeneralKeeperCirculateIa } from "../../../../generated";
import { Bytes32Zero, HexType, } from "../../../../scripts/common";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Recycling } from "@mui/icons-material";
import { useState } from "react";
import { HexParser } from "../../../../scripts/common/toolsKit";
import { FileHistoryProps } from "../../roc/sha/Actions/CirculateSha";

export function CirculateIa({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const [ docUrl, setDocUrl ] = useState<HexType>(Bytes32Zero);
  const [ docHash, setDocHash ] = useState<HexType>(Bytes32Zero);

  const {
    isLoading,
    write
  } = useGeneralKeeperCirculateIa({
    address: gk,
    args: [addr, docUrl, docHash],
    onSuccess() {
      setNextStep(2);
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
          onChange={e => setDocUrl(HexParser( e.target.value ))}
          value = { docUrl }
          size='small'
        />                                            

        <TextField
          sx={{ m: 1, minWidth: 650 }} 
          id="tfDocHash" 
          label="DocHash" 
          variant="outlined"
          onChange={e => setDocHash(HexParser( e.target.value ))}
          value = { docHash }
          size='small'
        />                                            

      </Stack>

      <Divider orientation="vertical" sx={{ m:1 }} flexItem />

      <Button
        disabled={ isLoading }
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