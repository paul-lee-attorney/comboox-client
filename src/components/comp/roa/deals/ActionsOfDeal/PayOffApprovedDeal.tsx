import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperPayOffApprovedDeal } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { Payment } from "@mui/icons-material";
import { useState } from "react";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx, removeKiloSymbol } from "../../../../../scripts/common/toolsKit";
import { HexType } from "../../../../../scripts/common";


export function PayOffApprovedDeal({ addr, deal, setOpen, setDeal, refresh}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const updateResults = ()=>{
    setDeal(defaultDeal);
    refresh();
    setOpen(false);    
  }

  const [ value, setValue ] = useState<string>('0');
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: payOffApprovedDealLoading,
    write: payOffApprovedDeal
  } = useGeneralKeeperPayOffApprovedDeal({
    address: gk,
    args: [addr, BigInt(deal.head.seqOfDeal)],
    value: BigInt(value) * BigInt( 10 ** 9 ),
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
            label='Consideration (GWei)'
            size="small"
            error={ valid['Consideration'].error }
            helperText={ valid['Consideration'].helpTx }
            sx={{
              m:1,
              minWidth: 456,
            }}
            value={ value }
            onChange={(e)=>{
              let input = removeKiloSymbol(e.target.value);
              onlyNum('Consideration', input, 0n, setValid); 
              setValue(input);
            }}
          />

        <Button 
          disabled = { payOffApprovedDealLoading || deal.body.state > 2 || hasError(valid)}

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