import { useState } from "react";
import { useGeneralKeeperExecPledge, useGeneralKeeperReleasePledge, usePrepareGeneralKeeperExecPledge, usePrepareGeneralKeeperReleasePledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Key, PlayArrow } from "@mui/icons-material";

interface ExecPledgeProps{
  seqOfShare: number;
  seqOfPld: number;
  setOpen:(flag:boolean)=>void;
  getAllPledges:()=>void;
}

export function ExecPledge({seqOfShare, seqOfPld, setOpen, getAllPledges}:ExecPledgeProps) {

  const { gk } = useComBooxContext();
  
  const {
    config: execPledgeConfig
  } = usePrepareGeneralKeeperExecPledge({
    address: gk,
    args: [BigNumber.from(seqOfShare), BigNumber.from(seqOfPld)],
  })

  const {
    isLoading: execPledgeLoading,
    write: execPledge,
  } = useGeneralKeeperExecPledge({
    ...execPledgeConfig,
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h4>Exercise Pledge</h4>
      </Toolbar>

      <Stack direction='row' >

        <Button 
          disabled={ !execPledge || execPledgeLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <PlayArrow /> }
          onClick={()=>execPledge?.() }
          size='small'
        >
          Execute
        </Button>        

      </Stack>
    </Paper>
  );

}


