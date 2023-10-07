import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { useState } from "react";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperCloseDeal } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { LockOpen } from "@mui/icons-material";

export function PickupShare({ ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const [ hashKey, setHashKey ] = useState<string>('Input your key string here');

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: closeDealLoading,
    write: closeDeal
  } = useGeneralKeeperCloseDeal({
    address: gk,
    args: [ia, BigInt(deal.head.seqOfDeal), hashKey],
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
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <TextField 
            variant='outlined'
            label='HashKey'
            size="small"
            sx={{
              m:1,
              minWidth: 680,
            }}
            value={ hashKey }
            onChange={(e)=>setHashKey(e.target.value)}
          />

          <Button 
            disabled = {closeDealLoading || deal.body.state > 2 }

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<LockOpen />}
            onClick={()=> closeDeal?.()}
            size='small'
          >
            Pickup Share
          </Button>

        </Stack>

    </Paper>

  );  


}