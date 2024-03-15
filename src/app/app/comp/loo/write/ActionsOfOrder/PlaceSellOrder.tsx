import { Checkbox, FormControlLabel, Paper, Stack, TextField } from "@mui/material";

import { Loyalty } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperPlaceSellOrder } from "../../../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer, } from "../../read/loo";
import { HexType, MaxData, MaxPrice, MaxSeqNo } from "../../../../read";
import { FormResults, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";

export function PlaceSellOrder({ classOfShare, refresh }: ActionsOfOrderProps) {
  const { gk, setErrMsg} = useComBooxContext();

  const [ order, setOrder ] = useState<InitOffer>(defaultOffer);

  const [ fromHead, setFromHead ] = useState(false);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults= ()=>{
    refresh();
    setLoading(false);
  }

  const {
    isLoading: placeSellOrderLoading,
    write:placeSellOrder,
  } = useGeneralKeeperPlaceSellOrder({
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
    placeSellOrder({
      args: [ 
        BigInt(classOfShare),
        BigInt(order.execHours), 
        strNumToBigInt(order.paid, 4),
        strNumToBigInt(order.price, 4),
        // BigInt(order.paid), 
        // BigInt(order.price), 
        BigInt(order.seqOfLR),
        fromHead, 
      ],
    });
  };

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >

      <Stack direction="row" sx={{ alignItems:'start' }} >

        <TextField 
          variant='outlined'
          size="small"
          label='ExecHours'
          error={ valid['ExecHours']?.error }
          helperText={ valid['ExecHours']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyInt('ExecHours', input, MaxSeqNo, setValid);
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
          error={ valid['SeqOfLR']?.error }
          helperText={ valid['SeqOfLR']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyInt('SeqOfLR', input, MaxSeqNo, setValid);
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
          error={ valid['Paid']?.error }
          helperText={ valid['Paid']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('Paid', input, MaxData, 4, setValid);
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
          error={ valid['Price']?.error }
          helperText={ valid['Price']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('Price', input, MaxPrice, 4, setValid);
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
                mx:1,
                height: 30,
              }}
              onChange={e => setFromHead(e.target.checked)}
              checked={ fromHead }
            />
          }
        />

        <LoadingButton 
          disabled = { placeSellOrderLoading || hasError(valid)}
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Loyalty />}
          onClick={ handleClick }
          size='small'
        >
          Sell
        </LoadingButton>

      </Stack>

    </Paper>

  );  

}