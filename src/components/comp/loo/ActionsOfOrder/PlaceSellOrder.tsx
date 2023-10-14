import { Button, Checkbox, FormControlLabel, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { Loyalty } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperPlaceSellOrder } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer, } from "../../../../scripts/comp/loo";
import { HexType, MaxData, MaxPrice, MaxSeqNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function PlaceSellOrder({ classOfShare, refresh }: ActionsOfOrderProps) {
  const {gk} = useComBooxContext();

  const [ order, setOrder ] = useState<InitOffer>(defaultOffer);

  const [ fromHead, setFromHead ] = useState(false);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: placeSellOrderLoading,
    write:placeSellOrder,
  } = useGeneralKeeperPlaceSellOrder({
    address: gk,
    args: [ BigInt(classOfShare),
            BigInt(order.execHours), 
            BigInt(order.paid), 
            BigInt(order.price), 
            BigInt(order.seqOfLR),
            fromHead, 
           ],
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
          label='ExecHours'
          error={ valid['ExecHours'].error }
          helperText={ valid['ExecHours'].helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('ExecHours', input, MaxSeqNo, setValid);
            setOrder( v => ({
              ...v,
              execHours: input,
            }));
          }}

          value={ order.execHours.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='SeqOfListingRule'
          error={ valid['SeqOfLR'].error }
          helperText={ valid['SeqOfLR'].helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('SeqOfLR', input, MaxSeqNo, setValid);
            setOrder( v => ({
              ...v,
              seqOfLR: input,
            }));
          }}

          value={ order.seqOfLR.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='Paid'
          error={ valid['Paid'].error }
          helperText={ valid['Paid'].helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('Paid', input, MaxData, setValid);
            setOrder( v => ({
              ...v,
              paid: input,
            }));
          }}

          value={ order.paid.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='Price'
          error={ valid['Price'].error }
          helperText={ valid['Price'].helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('Price', input, MaxPrice, setValid);
            setOrder( v => ({
              ...v,
              price: input,
            }));
          }}

          value={ order.price.toString() } 
        />

        <FormControlLabel
          label='SortFromHead'
          sx={{
            m:1,
            width: 188,
          }}
          control={
            <Checkbox 
              sx={{
                m: 1,
                height: 64,
              }}
              onChange={e => setFromHead(e.target.checked)}
              checked={ fromHead }
            />
          }
        />

        <Button 
          disabled = { placeSellOrderLoading || hasError(valid)}

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Loyalty />}
          onClick={()=> placeSellOrder?.()}
          size='small'
        >
          Sell
        </Button>

      </Stack>

    </Paper>

  );  

}