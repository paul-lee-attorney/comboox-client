import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { LockOpen, Update } from "@mui/icons-material";
import { useGeneralKeeperSetCompInfo } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";


export interface ConfigSettingProps{
  setOpen: Dispatch<SetStateAction<boolean>>;
}


export function SetCompInfo({setOpen}:ConfigSettingProps) {
  const { gk, boox } = useComBooxContext();

  const [ compName, setCompName ] = useState<string>('');
  const [ symbol, setSymbol ] = useState<string>('');

  const {
    isLoading: setCompInfoLoading,
    write: setCompInfo,
  } = useGeneralKeeperSetCompInfo({
    address: gk,
    args: [compName, symbol],
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

          <TextField 
            variant='outlined'
            label='CompanyName'
            size="small"
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ compName }
            onChange={(e)=>setCompName(e.target.value ?? '')}
          />

          <TextField 
            variant='outlined'
            label='Symbol'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }}
            value={ symbol }
            onChange={(e)=>setSymbol(e.target.value ?? '')}
          />

          <Button 
            disabled = {setCompInfoLoading }
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<Update />}
            onClick={()=> setCompInfo?.()}
            size='small'
          >
            Update
          </Button>

        </Stack>

    </Paper>

  );  


}