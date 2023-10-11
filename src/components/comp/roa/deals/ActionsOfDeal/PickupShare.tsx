import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { useState } from "react";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperCloseDeal } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { LockOpen } from "@mui/icons-material";
import { HexType } from "../../../../../scripts/common";
import { refreshAfterTx } from "../../../../../scripts/common/toolsKit";

export function PickupShare({ addr, deal, setOpen, setDeal, refresh}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const [ hashKey, setHashKey ] = useState<string>('Input your key string here');

  const updateResults = ()=>{
    setDeal(defaultDeal);
    refresh();
    setOpen(false);    
  }

  const {
    isLoading: closeDealLoading,
    write: closeDeal
  } = useGeneralKeeperCloseDeal({
    address: gk,
    args: [addr, BigInt(deal.head.seqOfDeal), hashKey],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
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