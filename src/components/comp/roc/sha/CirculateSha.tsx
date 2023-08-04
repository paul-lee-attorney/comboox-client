import { Button, Divider, Stack, TextField } from "@mui/material";
import { useGeneralKeeperCirculateSha } from "../../../../generated";
import { Bytes32Zero, FileHistoryProps, HexType, } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Recycling } from "@mui/icons-material";
import { useState } from "react";
import { HexParser } from "../../../../scripts/toolsKit";

export function CirculateSha({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const [ docUrl, setDocUrl ] = useState<HexType>(Bytes32Zero);
  const [ docHash, setDocHash ] = useState<HexType>(Bytes32Zero);

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
          id="tfDocOfUrl" 
          label="DocOfUrl / CID in IPFS" 
          variant="outlined"
          onChange={e => setDocUrl( HexParser( e.target.value ) )}
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
        disabled={!write || isLoading}
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