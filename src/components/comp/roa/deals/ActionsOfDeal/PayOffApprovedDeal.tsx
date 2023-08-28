import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperPayOffApprovedDeal } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { CurrencyExchange, Payment } from "@mui/icons-material";
import { useState } from "react";
import { removeKiloSymbol } from "../../../../../scripts/common/toolsKit";


export function PayOffApprovedDeal({ ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const [ value, setValue ] = useState<string>('0');

  const {
    isLoading: payOffApprovedDealLoading,
    write: payOffApprovedDeal
  } = useGeneralKeeperPayOffApprovedDeal({
    address: gk,
    args: [ia, BigInt(deal.head.seqOfDeal)],
    value: BigInt(value) * BigInt( 10 ** 9 ),
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

          <TextField 
            variant='outlined'
            label='Consideration (GWei)'
            size="small"
            sx={{
              m:1,
              minWidth: 456,
            }}
            value={ value }
            onChange={(e)=>setValue(  removeKiloSymbol(e.target.value) ?? '0')}
          />

        <Button 
          disabled = { payOffApprovedDealLoading || deal.body.state > 2}

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Payment />}
          onClick={()=> payOffApprovedDeal?.()}
          size='small'
        >
          Pay Off
        </Button>

        </Stack>

    </Paper>

  );  


}