import { useGeneralKeeperRevokePledge, usePrepareGeneralKeeperRevokePledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Block } from "@mui/icons-material";

interface RevokePledgeProps{
  seqOfShare: number;
  seqOfPld: number;
  setOpen:(flag:boolean)=>void;
  getAllPledges:()=>void;
}

export function RevokePledge({seqOfShare, seqOfPld, setOpen, getAllPledges}:RevokePledgeProps) {

  const { gk } = useComBooxContext();
  
  const {
    config: revokePledgeConfig
  } = usePrepareGeneralKeeperRevokePledge({
    address: gk,
    args: [BigNumber.from(seqOfShare), BigNumber.from(seqOfPld)],
  })

  const {
    isLoading: revokePledgeLoading,
    write: revokePledge,
  } = useGeneralKeeperRevokePledge({
    ...revokePledgeConfig,
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h4>Revoke Pledge</h4>
      </Toolbar>

      <Stack direction='row' >

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

