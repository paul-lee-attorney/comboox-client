import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { Loyalty } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperPlaceInitialOffer } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";


export function PlaceInitialOffer({ classOfShare, setTime }: ActionsOfOrderProps) {
  const {gk} = useComBooxContext();

  const [ offer, setOffer ] = useState<InitOffer>(defaultOffer);

  const {
    isLoading: placeInitOfferLoading,
    write:placeInitOffer,
  } = useGeneralKeeperPlaceInitialOffer({
    address: gk,
    args: [ BigInt(classOfShare),
            BigInt(offer.execHours), 
            offer.paid, 
            BigInt(offer.price), 
            BigInt(offer.seqOfLR), 
           ],
    onSuccess() {
      setTime(Date.now());
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
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOffer( v => ({
            ...v,
            execHours: parseInt(e.target.value ?? '0'),
          }))}

          value={ offer.execHours.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='SeqOfListingRule'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOffer( v => ({
            ...v,
            seqOfLR: parseInt(e.target.value ?? '0'),
          }))}

          value={ offer.seqOfLR.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='Paid'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOffer( v => ({
            ...v,
            paid: BigInt(e.target.value ?? '0'),
          }))}

          value={ offer.paid.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='Price'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOffer( v => ({
            ...v,
            price: parseInt( e.target.value ?? '0' ),
          }))}

          value={ offer.price.toString() } 
        />

        <Button 
          disabled = { placeInitOfferLoading }

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<Loyalty />}
          onClick={()=> placeInitOffer?.()}
          size='small'
        >
          Offer
        </Button>

      </Stack>

    </Paper>

  );  

}