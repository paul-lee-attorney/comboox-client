import { Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Update } from "@mui/icons-material";
import { useAccessControlTakeBackKeys } from "../../../../generated";
import { AddrZero, HexType } from "../../../../scripts/common";
import { AccessControlProps } from "./SetOwner";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function TakeBackKeys({docAddr, setDocAddr, setOpen}:AccessControlProps) {

  const [ target, setTarget ] = useState<HexType>(AddrZero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const updateResults = ()=>{
    setOpen(false);
  }

  const {
    isLoading: takeBackKeysLoading,
    write: takeBackKeys,
  } = useAccessControlTakeBackKeys({
    address: docAddr,
    args: [ target ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
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
            error={ valid['DocAddress'].error }
            helperText={ valid['DocAddress'].helpTx }
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ docAddr }
            onChange={(e)=>{
              let input = HexParser( e.target.value );
              onlyHex('DocAddress', input, 40, setValid);
              setDocAddr(input);
            }}
          />

          <TextField 
            variant='outlined'
            label='TargetBook'
            size="small"
            error={ valid['TargetBook'].error }
            helperText={ valid['TargetBook'].helpTx }
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ target }
            onChange={(e)=>{
              let input = HexParser( e.target.value );
              onlyHex('TargetBook', input, 40, setValid);
              setTarget(input);
            }}
          />

        </Stack>

        <Divider orientation="vertical" flexItem />

        <Button 
          disabled = {takeBackKeysLoading || hasError(valid) }
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