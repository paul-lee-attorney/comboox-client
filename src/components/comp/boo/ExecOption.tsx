import { ActionsOfOptionProps } from "./ActionsOfOption";
import { useGeneralKeeperExecOption } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Paper, Stack, Toolbar } from "@mui/material";
import { Approval } from "@mui/icons-material";

export function ExecOption({seqOfOpt, setOpen, getAllOpts}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();

  const {
    isLoading: execOptLoading,
    write: execOpt,
  } = useGeneralKeeperExecOption({
    address: gk,
    args: [ BigInt(seqOfOpt) ],
    onSuccess() {
      getAllOpts();
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h4>Exercise Right Of Option</h4>
      </Toolbar>

      <Stack direction='row' >

        <Button 
          disabled={ execOptLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Approval /> }
          onClick={()=>execOpt?.() }
          size='small'
        >
          Exercise
        </Button>        

      </Stack>
    </Paper>
    
  );

}

