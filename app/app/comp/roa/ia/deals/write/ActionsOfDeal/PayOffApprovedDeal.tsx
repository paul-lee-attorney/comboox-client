
import { useState } from "react";

import { Paper, Stack, TextField } from "@mui/material";
import { defaultDeal } from "../../../read/ia";
import { useGeneralKeeperPayOffApprovedDeal } from "../../../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { Payment } from "@mui/icons-material";
import { FormResults, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx, removeKiloSymbol, strNumToBigInt } from "../../../../../../read/toolsKit";
import { HexType } from "../../../../../../read";
import { LoadingButton } from "@mui/lab";
import { useComBooxContext } from "../../../../../../_providers/ComBooxContextProvider";


export function PayOffApprovedDeal({ addr, deal, setOpen, setDeal, refresh}: ActionsOfDealProps ) {
  const { gk, setErrMsg } = useComBooxContext();

  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    setDeal(defaultDeal);
    refresh();
    setLoading(false);
    setOpen(false);    
  }

  const [ value, setValue ] = useState<string>('0');
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: payOffApprovedDealLoading,
    write: payOffApprovedDeal
  } = useGeneralKeeperPayOffApprovedDeal({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    payOffApprovedDeal({
      args: [addr, BigInt(deal.head.seqOfDeal)],
      value: strNumToBigInt(value, 9) * (10n ** 9n),  
    });
  };

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
        <Stack direction={'row'} sx={{ alignItems:'start'}} >

          <TextField 
            variant='outlined'
            label='Consideration (ETH)'
            size="small"
            error={ valid['Consideration']?.error }
            helperText={ valid['Consideration']?.helpTx ?? ' ' }
            sx={{
              m:1,
              minWidth: 456,
            }}
            value={ value }
            onChange={(e)=>{
              let input = removeKiloSymbol(e.target.value);
              onlyNum('Consideration', input, 0n, 9, setValid); 
              setValue(input);
            }}
          />

        <LoadingButton 
          disabled = { payOffApprovedDealLoading || deal.body.state > 2 || hasError(valid)}
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 128, height: 40 }} 
          variant="contained" 
          endIcon={<Payment />}
          onClick={ handleClick }
          size='small'
        >
          Pay Off
        </LoadingButton>

        </Stack>

    </Paper>

  );  


}