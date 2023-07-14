import { useState } from "react";
import { useGeneralKeeperLockPledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { LockOutlined, Start } from "@mui/icons-material";
import { Bytes32Zero, HexType } from "../../../interfaces";

interface LockPledgeProps{
  seqOfShare: number;
  seqOfPld: number;
  setOpen:(flag:boolean)=>void;
  getAllPledges:()=>void;
}

export function LockPledge({seqOfShare, seqOfPld, setOpen, getAllPledges}:LockPledgeProps) {

  const { gk } = useComBooxContext();
  
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  // const {
  //   config: lockPledgeConfig
  // } = usePrepareGeneralKeeperLockPledge({
  //   address: gk,
  //   args: hashLock
  //     ? [ BigInt(seqOfShare), 
  //         BigInt(seqOfPld), 
  //         hashLock
  //       ]
  //     : undefined,
  // })

  const {
    isLoading: lockPledgeLoading,
    write: lockPledge,
  } = useGeneralKeeperLockPledge({
    address: gk,
    args: hashLock
      ? [ BigInt(seqOfShare), 
          BigInt(seqOfPld), 
          hashLock
        ]
      : undefined,
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h4>Lock Pledge</h4>
      </Toolbar>

      <Stack direction='row' sx={{ alignItems:'center' }} >

        <TextField 
          variant='filled'
          label='HashLock'
          sx={{
            m:1,
            minWidth: 618,
          }}
          onChange={(e) => setHashLock(`0x${e.target.value}`)}
          value={ hashLock?.substring(2) }
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


