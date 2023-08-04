import { useState } from "react";
import { useGeneralKeeperLockPledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { LockOutlined, Start } from "@mui/icons-material";
import { Bytes32Zero, HexType } from "../../../../interfaces";
import { Pledge } from "../../../../queries/rop";
import { ActionsOfOptionProps } from "../../roo/ActionsOfOption";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { HexParser } from "../../../../scripts/toolsKit";


export function LockPledge({pld, setOpen, getAllPledges}:ActionsOfPledgeProps) {

  const { gk } = useComBooxContext();
  
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

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
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Lock Pledge</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='HashLock'
          sx={{
            m:1,
            minWidth: 618,
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


