import { useGeneralKeeperExecPledge, usePrepareGeneralKeeperExecPledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Paper, Stack, Toolbar } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";

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
    args: [BigInt(seqOfShare), BigInt(seqOfPld)],
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
          disabled={ execPledgeLoading }
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


