import { useState } from "react";
import { useGeneralKeeperReleasePledge, usePrepareGeneralKeeperReleasePledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Key } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";

export function ReleasePledge({pld, setOpen, getAllPledges}:ActionsOfPledgeProps) {

  const { gk } = useComBooxContext();
  
  const [ key, setKey ] = useState<string>();

  const {
    isLoading: releasePledgeLoading,
    write: releasePledge,
  } = useGeneralKeeperReleasePledge({
    address: gk,
    args: key
      ? [ BigInt(seqOfShare), 
          BigInt(seqOfPld), 
          key
        ]
      : undefined,
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Release Pledge</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='HashKey'
          sx={{
            m:1,
            minWidth: 618,
          }}
          onChange={(e) => setKey(e.target.value ?? '')}
          value={ key }
          size='small'
        />

        <Button 
          disabled={ !releasePledge || releasePledgeLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Key /> }
          onClick={()=>releasePledge?.() }
          size='small'
        >
          Release
        </Button>        

      </Stack>
    </Paper>
  );

}

