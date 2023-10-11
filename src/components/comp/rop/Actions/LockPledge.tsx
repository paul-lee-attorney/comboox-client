import { useState } from "react";
import { useGeneralKeeperLockPledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Bytes32Zero, HexType } from "../../../../scripts/common";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { HexParser, refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function LockPledge({pld, setOpen, refresh}:ActionsOfPledgeProps) {

  const { gk } = useComBooxContext();
  
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: lockPledgeLoading,
    write: lockPledge,
  } = useGeneralKeeperLockPledge({
    address: gk,
    args: hashLock
      ? [ BigInt(pld.head.seqOfShare), 
          BigInt(pld.head.seqOfPld), 
          hashLock
        ]
      : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }    
  });
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='HashLock'
          sx={{
            m:1,
            minWidth: 688,
          }}
          onChange={(e) => setHashLock(HexParser( e.target.value ))}
          value={ hashLock }
          size='small'
        />

        <Button 
          disabled={ !lockPledge || lockPledgeLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <LockOutlined /> }
          onClick={()=>lockPledge?.() }
          size='small'
        >
          Lock
        </Button>        

      </Stack>
    </Paper>
  );

}


