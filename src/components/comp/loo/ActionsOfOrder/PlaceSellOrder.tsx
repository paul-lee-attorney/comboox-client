import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { Loyalty } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperPlaceSellOrder } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";

export function PlaceSellOrder({ classOfShare: classOfShare, getAllOrders: getAllOrders }: ActionsOfOrderProps) {
  const {gk} = useComBooxContext();

  const [ order, setOrder ] = useState<InitOffer>(defaultOffer);

  const {
    isLoading: placeSellOrderLoading,
    write:placeSellOrder,
  } = useGeneralKeeperPlaceSellOrder({
    address: gk,
    args: [ BigInt(classOfShare),
            BigInt(order.execHours), 
            order.paid, 
            BigInt(order.price), 
            BigInt(order.seqOfLR), 
           ],
    onSuccess() {
      getAllOrders();
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
          label='SeqOfShare'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOrder( v => ({
            ...v,
            classOfShare: parseInt( e.target.value ?? '0' ),
          }))}

          value={ order.classOfShare.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='ExecHours'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOrder( v => ({
            ...v,
            execHours: parseInt( e.target.value ?? '0' ),
          }))}

          value={ order.execHours.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='SeqOfListingRule'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOrder( v => ({
            ...v,
            seqOfLR: parseInt( e.target.value ?? '0' ),
          }))}

          value={ order.seqOfLR.toString() } 
        />


        <TextField 
          variant='outlined'
          size="small"
          label='Paid'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOrder( v => ({
            ...v,
            paid: BigInt( e.target.value ?? '0' ),
          }))}

          value={ order.paid.toString() } 
        />

        <TextField 
          variant='outlined'
          size="small"
          label='Price'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOrder( v => ({
            ...v,
            price: parseInt( e.target.value ?? '0' ),
          }))}

          value={ order.price.toString() } 
        />

        <Button 
          disabled = { placeSellOrderLoading }

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