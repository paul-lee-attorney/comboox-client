import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperReleaseSwapOrder } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import { useState } from "react";

export function ReleaseSwapOrder({seqOfOpt, setOpen, getAllOpts}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfBrf, setSeqOfBrf ] = useState<string>('0');
  const [ hashKey, setHashKey ] = useState<string>('');

  const {
    isLoading: releaseSwapOrderLoading,
    write: releaseSwapOrder,
  } = useGeneralKeeperReleaseSwapOrder({
    address: gk,
    args: seqOfBrf
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfBrf),
          hashKey]
      : undefined,
    onSuccess() {
      getAllOpts();
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Release Swap Order</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='seqOfBrf'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfBrf(e.target.value ?? '0')}
          value={ seqOfBrf }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='hashKey'
          sx={{
            m:1,
            minWidth: 685,
          }}
          onChange={(e) => setHashKey( e.target.value )}
          value={ hashKey }
          size='small'
        />

        <Button 
          disabled={ releaseSwapOrderLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <LockOpen /> }
          onClick={()=>releaseSwapOrder?.() }
          size='small'
        >
          Release
        </Button>        

      </Stack>
    </Paper>
    
  );

}

