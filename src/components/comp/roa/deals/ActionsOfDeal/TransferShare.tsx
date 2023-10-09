import { Button, Paper, Stack } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperTransferTargetShare } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { CurrencyExchange } from "@mui/icons-material";


export function TransferShare({ addr, deal, setOpen, setDeal, setTime}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    setTime(Date.now());
    setOpen(false);    
  }

  const {
    isLoading: transferTargetShareLoading,
    write: transferTargetShare
  } = useGeneralKeeperTransferTargetShare({
    address: gk,
    args: [addr, BigInt(deal.head.seqOfDeal)],
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