import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { RedoOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperWithdrawInitialOffer } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";
import { HexType, MaxPrice, MaxSeqNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function WithdrawInitialOffer({ classOfShare, refresh }: ActionsOfOrderProps) {
  const {gk} = useComBooxContext();

  const [ offer, setOffer ] = useState<InitOffer>(defaultOffer);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: withdrawInitOfferLoading,
    write:withdrawInitOffer,
  } = useGeneralKeeperWithdrawInitialOffer({
    address: gk,
    args: !hasError(valid)
        ? [ BigInt(classOfShare),
            BigInt(offer.seqOfOrder),
            BigInt(offer.seqOfLR), 
           ]
        : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
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
          helperText={ valid['SeqOfOrder']?.helpTx }
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

        <TextField 
          variant='outlined'
          size="small"
          label='SeqOfListingRule'
          error={ valid['SeqOfLR']?.error }
          helperText={ valid['SeqOfLR']?.helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('SeqOfLR', input, MaxSeqNo, setValid);
            setOffer( v => ({
              ...v,
              seqOfLR: input,
            }));
          }}

          value={ offer.seqOfLR.toString() } 
        />

        <Button 
          disabled = { withdrawInitOfferLoading || hasError(valid)}

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<RedoOutlined />}
          onClick={()=> withdrawInitOffer?.()}
          size='small'
        >
          Withdraw
        </Button>

      </Stack>

    </Paper>

  );  

}