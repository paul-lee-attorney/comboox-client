import { Alert, Button, Collapse, Divider, IconButton, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import {  Close, HelpOutline, ShoppingCartOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperPlaceBuyOrder } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";
import { longDataParser, removeKiloSymbol } from "../../../../scripts/common/toolsKit";
import { getCentPrice } from "../../../../scripts/comp/gk";

export function PlaceBuyOrder({ classOfShare, setTime }: ActionsOfOrderProps) {
  const { gk } = useComBooxContext();

  const [ order, setOrder ] = useState<InitOffer>(defaultOffer);
  const [ value, setValue ] = useState<string>('0');

  const {
    isLoading: placeBuyOrderLoading,
    write:placeBuyOrder,
  } = useGeneralKeeperPlaceBuyOrder({
    address: gk,
    args: [ BigInt(classOfShare),
            order.paid, 
            BigInt(order.price)
           ],
    value: BigInt(value) * BigInt(10 ** 9),
    onSuccess() {
      setTime(Date.now());
    }
  });

  const [ valueOfOrder, setValueOfOrder ] = useState<bigint>(BigInt(0));
  const [ open, setOpen ] = useState<boolean>(false);
  const getValueOfOrder = async () => {
    if ( gk ) {
      let centPrice = await getCentPrice( gk );
      let output = centPrice * BigInt(order.paid) * BigInt(order.price) / BigInt(100);
      setValueOfOrder(output);
      setOpen(true);
    }
  }

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
          label='Paid (Cent)'
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
          label='Price (Cent)'
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

        <TextField 
          variant='outlined'
          label='Consideration (GWei)'
          size="small"
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ value }
          onChange={(e)=>setValue(  removeKiloSymbol(e.target.value) ?? '0')}
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

        <Tooltip
          title='ValueInGwei'
          placement="top"
          arrow
        >
          <IconButton 
            disabled = { gk == undefined }
            onClick={getValueOfOrder}
            size='small'
          >
            <HelpOutline />
          </IconButton>
        </Tooltip>

        <Collapse in={open} sx={{width:"20%"}}>        
          <Alert 
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }

            variant='outlined' 
            severity='info'
            sx={{ height: 50,  m: 1, }} 
          >
            {longDataParser( (valueOfOrder / BigInt(10**9) ).toString() ) + ' (GWei)'}
          </Alert>
        </Collapse>



      </Stack>
      
    </Paper>

  );  

}