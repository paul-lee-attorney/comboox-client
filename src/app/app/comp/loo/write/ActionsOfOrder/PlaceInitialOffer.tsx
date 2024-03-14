import { Paper, Stack, TextField } from "@mui/material";

import { Loyalty } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperPlaceInitialOffer } from "../../../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../read/loo";
import { HexType, MaxData, MaxPrice, MaxSeqNo } from "../../../../read";
import { FormResults, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";


export function PlaceInitialOffer({ classOfShare, refresh }: ActionsOfOrderProps) {
  const { gk, setErrMsg } = useComBooxContext();

  const [ offer, setOffer ] = useState<InitOffer>(defaultOffer);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
  }

  const {
    isLoading: placeInitOfferLoading,
    write:placeInitOffer,
  } = useGeneralKeeperPlaceInitialOffer({
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
      
  const handleClick = ()=> {
    placeInitOffer({
      args: [
        BigInt(classOfShare),
        BigInt(offer.execHours),
        strNumToBigInt(offer.paid, 2),
        strNumToBigInt(offer.price, 2), 
        BigInt(offer.seqOfLR), 
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
            setOffer( v => ({
              ...v,
              execHours: input,
            }));
          }}
          value={ offer.execHours } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='SeqOfListingRule'
          error={ valid['SetOfLR']?.error }
          helperText={ valid['SetOfLR']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyInt('SeqOfLR', input, MaxSeqNo, setValid);
            setOffer( v => ({
              ...v,
              seqOfLR: input,
            }));
          }}
          value={ offer.seqOfLR } 
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
            onlyNum('Paid', input, MaxData, 2, setValid);
            setOffer( v => ({
              ...v,
              paid: input,
            }));
          }}
          value={ offer.paid } 
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
            onlyNum('Price', input, MaxPrice, 2, setValid);
            setOffer( v => ({
              ...v,
              price: input,
            }));
        }}

          value={ offer.price } 
        />

        <LoadingButton 
          disabled = { placeInitOfferLoading || hasError(valid)}
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Loyalty />}
          onClick={ handleClick }
          size='small'
        >
          Offer
        </LoadingButton>

      </Stack>

    </Paper>

  );  

}