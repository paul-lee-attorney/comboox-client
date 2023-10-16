import { useGeneralKeeperRevokePledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack } from "@mui/material";
import { Block } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { HexType } from "../../../../scripts/common";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function RevokePledge({pld, setOpen, refresh}:ActionsOfPledgeProps) {

  const { gk } = useComBooxContext();
  
  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: revokePledgeLoading,
    write: revokePledge,
  } = useGeneralKeeperRevokePledge({
    address: gk,
    args: [BigInt(pld.head.seqOfShare), BigInt(pld.head.seqOfPld)],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }    
  });

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

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


