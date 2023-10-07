import { Button, Paper, Stack } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperTakeGiftShares } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { HandshakeOutlined } from "@mui/icons-material";


export function TakeGiftShares({ ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: takeGiftShareLoading,
    write: takeGiftShare
  } = useGeneralKeeperTakeGiftShares({
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
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <Button 
            disabled = { takeGiftShareLoading }

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<HandshakeOutlined />}
            onClick={()=> takeGiftShare?.()}
            size='small'
          >
            Take Gift
          </Button>

        </Stack>

    </Paper>

  );  


}