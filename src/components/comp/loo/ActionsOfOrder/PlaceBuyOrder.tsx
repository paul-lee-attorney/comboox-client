import { Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import {  ShoppingCartOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperPlaceBuyOrder } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";

export function PlaceBuyOrder({ classOfShare: classOfShare, getAllOrders: getAllOrders }: ActionsOfOrderProps) {
  const { gk } = useComBooxContext();

  const [ order, setOrder ] = useState<InitOffer>(defaultOffer);

  const {
    isLoading: placeBuyOrderLoading,
    write:placeBuyOrder,
  } = useGeneralKeeperPlaceBuyOrder({
    address: gk,
    args: [ BigInt(classOfShare),
            order.paid, 
            BigInt(order.price)
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

      <Stack direction={'row'} sx={{ alignItems:'center'}} >

          
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
          disabled = { placeBuyOrderLoading }

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<ShoppingCartOutlined />}
          onClick={()=> placeBuyOrder?.()}
          size='small'
        >
          Buy
        </Button>
        
      </Stack>
      
    </Paper>

  );  

}