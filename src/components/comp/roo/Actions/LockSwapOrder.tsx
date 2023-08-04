import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperLockSwapOrder } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Lock } from "@mui/icons-material";
import { useState } from "react";
import { Bytes32Zero, HexType } from "../../../../interfaces";

export function LockSwapOrder({seqOfOpt, setOpen, getAllOpts}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfBrf, setSeqOfBrf ] = useState<string>('0');
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  const {
    isLoading: lockSwapOrderLoading,
    write: lockSwapOrder,
  } = useGeneralKeeperLockSwapOrder({
    address: gk,
    args: seqOfBrf
      ? [ BigInt(seqOfOpt), 
          BigInt(seqOfBrf),
          hashLock]
      : undefined,
    onSuccess() {
      getAllOpts();
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Lock Swap Order</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='seqOfBrief'
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
          label='hashLock'
          sx={{
            m:1,
            minWidth: 685,
          }}
          onChange={(e) => setHashLock(`0x${(e.target.value ?? '0').padStart(64, '0')}`)}
          value={ hashLock.substring(2) }
          size='small'
        />

        <Button 
          disabled={ lockSwapOrderLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Lock /> }
          onClick={()=>lockSwapOrder?.() }
          size='small'
        >
          Lock
        </Button>        

      </Stack>
    </Paper>
    
  );

}

