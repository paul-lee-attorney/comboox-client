import { Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Update } from "@mui/icons-material";
import { useAccessControlSetOwner } from "../../../../generated";
import { AddrZero, HexType } from "../../../../scripts/common";
import { HexParser } from "../../../../scripts/common/toolsKit";

export interface AccessControlProps{
  docAddr: HexType;
  setDocAddr: Dispatch<SetStateAction<HexType>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}


export function SetOwner({docAddr, setDocAddr, setOpen}:AccessControlProps) {

  const [ owner, setOwner ] = useState<HexType>(AddrZero);

  const {
    isLoading: updateOwnerLoading,
    write: updateOwner,
  } = useAccessControlSetOwner({
    address: docAddr,
    args: [ owner ],
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
            label='Owner'
            size="small"
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ owner }
            onChange={(e)=>setOwner(HexParser( e.target.value ))}
          />

        </Stack>

        <Divider orientation="vertical" flexItem />

        <Button 
          disabled = {updateOwnerLoading }
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={()=> updateOwner?.()}
          size='small'
        >
          Update
        </Button>

      </Stack>
    </Paper>

  );  


}