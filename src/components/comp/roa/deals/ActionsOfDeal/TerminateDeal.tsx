import { Button, Paper, Stack } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperTerminateDeal } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import {  DirectionsRun } from "@mui/icons-material";


export function TerminateDeal({ ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: terminateDealLoading,
    write: terminateDeal
  } = useGeneralKeeperTerminateDeal({
    address: gk,
    args: [ia, BigInt(deal.head.seqOfDeal)],
    onSuccess() {
      closeOrderOfDeal();
    }
  });

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
        {/* <Toolbar>
          <h4>Terminate Deal</h4>
        </Toolbar> */}

        <Stack direction={'row'} sx={{ alignItems:'center'}} >

        <Button 
          disabled = { terminateDealLoading || deal.body.state > 2}

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<DirectionsRun />}
          onClick={()=> terminateDeal?.()}
          size='small'
        >
          Terminate Deal
        </Button>

        </Stack>

    </Paper>

  );  

}