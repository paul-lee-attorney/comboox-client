import { useGeneralKeeperRevokePledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Block } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";

export function RevokePledge({pld, setOpen, getAllPledges}:ActionsOfPledgeProps) {

  const { gk } = useComBooxContext();
  
  const {
    isLoading: revokePledgeLoading,
    write: revokePledge,
  } = useGeneralKeeperRevokePledge({
    address: gk,
    args: [BigInt(pld.head.seqOfShare), BigInt(pld.head.seqOfPld)],
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Revoke Pledge</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <Button 
          disabled={ !revokePledge || revokePledgeLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Block /> }
          onClick={()=>revokePledge?.() }
          size='small'
        >
          Revoke
        </Button>        

      </Stack>
    </Paper>
  );

}


