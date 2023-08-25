import { Button, Paper, Stack, Toolbar } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/ComBooxContext";
import { defaultDeal } from "../../../../../queries/ia";
import { useGeneralKeeperTransferTargetShare } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { CurrencyExchange } from "@mui/icons-material";


export function TransferShare({ ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: transferTargetShareLoading,
    write: transferTargetShare
  } = useGeneralKeeperTransferTargetShare({
    address: gk,
    args: [ia, BigInt(deal.head.seqOfDeal)],
    onSuccess() {
      closeOrderOfDeal()
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
          <h4>Transfer Share</h4>
        </Toolbar> */}

        <Stack direction={'row'} sx={{ alignItems:'center'}} >

        <Button 
          disabled = { transferTargetShareLoading || deal.body.state > 2}

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<CurrencyExchange />}
          onClick={()=> transferTargetShare?.()}
          size='small'
        >
          Transfer
        </Button>

        </Stack>

    </Paper>

  );  


}