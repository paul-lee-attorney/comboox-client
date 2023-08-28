import { Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Update } from "@mui/icons-material";
import { useAccessControlSetDirectKeeper, useAccessControlSetOwner } from "../../../../generated";
import { AddrZero, HexType } from "../../../../scripts/common";
import { AccessControlProps } from "./SetOwner";
import { HexParser } from "../../../../scripts/common/toolsKit";

export function SetDK({docAddr, setDocAddr, setOpen}:AccessControlProps) {

  // const [ doc, setDoc ] = useState<HexType>(docAddr);
  const [ keeper, setKeeper ] = useState<HexType>(AddrZero);

  const {
    isLoading: updateDKLoading,
    write: updateDK,
  } = useAccessControlSetDirectKeeper({
    address: docAddr,
    args: [ keeper ],
    onSuccess() {
      setOpen(false)
    }
  });

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
      <Stack direction={'row'} sx={{ alignItems:'center'}} >

        <Stack direction={'column'} sx={{ justifyContent:'center'}} >

          <TextField 
            variant='outlined'
            label='DocAddress'
            size="small"
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ docAddr }
            onChange={(e)=>setDocAddr(HexParser( e.target.value ))}
          />

          <TextField 
            variant='outlined'
            label='DirectKeeper'
            size="small"
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ keeper }
            onChange={(e)=>setKeeper(HexParser( e.target.value ))}
          />

        </Stack>

        <Divider orientation="vertical" flexItem />

        <Button 
          disabled = {updateDKLoading }
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={()=> updateDK?.()}
          size='small'
        >
          Update
        </Button>

      </Stack>
    </Paper>

  );  


}