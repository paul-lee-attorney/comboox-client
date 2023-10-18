import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { RedoOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperWithdrawSellOrder } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";
import { HexType, MaxPrice } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";


export function WithdrawSellOrder({ classOfShare, refresh }: ActionsOfOrderProps) {
  const {gk} = useComBooxContext();

  const [ offer, setOffer ] = useState<InitOffer>(defaultOffer);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=> {
    refresh();
    setLoading(false);
  }

  const {
    isLoading: withdrawSellOrderLoading,
    write:withdrawSellOrder,
  } = useGeneralKeeperWithdrawSellOrder({
    address: gk,
    args: !hasError(valid)
        ? [ BigInt(classOfShare),
            BigInt(offer.seqOfOrder)
           ]
        : undefined,
    onSuccess(data) {
      setLoading(true);
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
      
      <Stack direction="row" sx={{ alignItems:'center' }} >

        <TextField 
          variant='outlined'
          size="small"
          label='SeqOfOrder'
          error={ valid['SeqOfOrder']?.error }
          helperText={ valid['SeqOfOrder']?.helpTx ?? ' ' }

          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('SeqOfOrder', input, MaxPrice, setValid);
            setOffer( v => ({
              ...v,
              seqOfOrder: input,
            }));
          }}

          value={ offer.seqOfOrder.toString() } 
        />

        <LoadingButton 
          disabled = { withdrawSellOrderLoading || hasError(valid)}
          loading = {loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<RedoOutlined />}
          onClick={()=> withdrawSellOrder?.()}
          size='small'
        >
          Withdraw
        </LoadingButton>

      </Stack>

    </Paper>

  );  

}