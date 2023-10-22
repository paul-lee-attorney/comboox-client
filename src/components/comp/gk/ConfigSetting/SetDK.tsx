import { Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Update } from "@mui/icons-material";
import { useAccessControlSetDirectKeeper } from "../../../../generated";
import { AddrZero, HexType } from "../../../../scripts/common";
import { AccessControlProps } from "./SetOwner";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function SetDK({docAddr, setDocAddr, setOpen}:AccessControlProps) {

  const [ keeper, setKeeper ] = useState<HexType>(AddrZero);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: updateDKLoading,
    write: updateDK,
  } = useAccessControlSetDirectKeeper({
    address: docAddr,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    updateDK({
      args: [ 
        keeper 
      ],
    });
  };

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
            error={ valid['DocAddress']?.error }
            helperText={ valid['DocAddress']?.helpTx ?? ' ' }
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
            label='DirectKeeper'
            size="small"
            error={ valid['DirectKeeper']?.error }
            helperText={ valid['DirectKeeper']?.helpTx ?? ' ' }
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ keeper }
            onChange={(e)=>{
              let input = HexParser( e.target.value );
              onlyHex('DirectKeeper', input, 40, setValid);
              setKeeper(input);
            }}
          />

        </Stack>

        <Divider orientation="vertical" flexItem />

        <LoadingButton 
          disabled = {updateDKLoading || hasError(valid)}
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={ handleClick }
          size='small'
        >
          Update
        </LoadingButton>

      </Stack>
    </Paper>

  );  

}