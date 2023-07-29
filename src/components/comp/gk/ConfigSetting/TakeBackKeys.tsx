import { Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Update } from "@mui/icons-material";
import { useAccessControlSetDirectKeeper, useAccessControlSetOwner, useAccessControlTakeBackKeys } from "../../../../generated";
import { AddrZero, HexType } from "../../../../interfaces";
import { AccessControlProps } from "./SetOwner";

export function TakeBackKeys({docAddr, setDocAddr, setOpen}:AccessControlProps) {

  // const [ doc, setDoc ] = useState<HexType>(docAddr);
  const [ target, setTarget ] = useState<HexType>(AddrZero);

  const {
    isLoading: takeBackKeysLoading,
    write: takeBackKeys,
  } = useAccessControlTakeBackKeys({
    address: docAddr,
    args: [ target ],
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
            value={ docAddr.substring(2) }
            onChange={(e)=>setDocAddr(`0x${e.target.value}`)}
          />

          <TextField 
            variant='outlined'
            label='TargetBook'
            size="small"
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ target.substring(2) }
            onChange={(e)=>setTarget(`0x${e.target.value}`)}
          />

        </Stack>

        <Divider orientation="vertical" flexItem />

        <Button 
          disabled = {takeBackKeysLoading }
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={()=> takeBackKeys?.()}
          size='small'
        >
          Update
        </Button>

      </Stack>
    </Paper>

  );  


}