import { Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Update } from "@mui/icons-material";
import { useAccessControlSetOwner } from "../../../../generated";
import { AddrZero, HexType } from "../../../../scripts/common";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export interface AccessControlProps{
  docAddr: HexType;
  setDocAddr: Dispatch<SetStateAction<HexType>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}


export function SetOwner({docAddr, setDocAddr, setOpen}:AccessControlProps) {

  const [ owner, setOwner ] = useState<HexType>(AddrZero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: updateOwnerLoading,
    write: updateOwner,
  } = useAccessControlSetOwner({
    address: docAddr,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    updateOwner({
      args: [ 
        owner 
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
            label='Owner'
            size="small"
            error={ valid['Owner']?.error }
            helperText={ valid['Owner']?.helpTx ?? ' ' }                        
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ owner }
            onChange={(e)=>{
              let input = HexParser( e.target.value );
              onlyHex('Owner', input, 40, setValid);
              setOwner(input);
            }}
          />

        </Stack>

        <Divider orientation="vertical" flexItem />

        <LoadingButton 
          disabled = {updateOwnerLoading || hasError(valid)}
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