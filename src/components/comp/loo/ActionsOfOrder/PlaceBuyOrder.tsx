import { Alert, Button, Collapse, IconButton, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import {  Close, HelpOutline, ShoppingCartOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperPlaceBuyOrder } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";
import { FormResults, defFormResults, hasError, longDataParser, onlyNum, refreshAfterTx, removeKiloSymbol } from "../../../../scripts/common/toolsKit";
import { getCentPrice } from "../../../../scripts/comp/gk";
import { HexType, MaxData, MaxPrice } from "../../../../scripts/common";
import { LoadingButton } from "@mui/lab";

export function PlaceBuyOrder({ classOfShare, refresh }: ActionsOfOrderProps) {
  const { gk } = useComBooxContext();

  const [ order, setOrder ] = useState<InitOffer>(defaultOffer);
  const [ value, setValue ] = useState<string>('0');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
  }

  const {
    isLoading: placeBuyOrderLoading,
    write:placeBuyOrder,
  } = useGeneralKeeperPlaceBuyOrder({
    address: gk,
    args: !hasError(valid)
        ? [ BigInt(classOfShare),
            BigInt(order.paid), 
            BigInt(order.price)
          ]
        : undefined,
    value: !hasError(valid) 
        ? BigInt(value) * (10n ** 9n) 
        : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
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
          error={ valid['Paid']?.error }
          helperText={ valid['Paid']?.helpTx }
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
          label='Price (Cent)'
          error={ valid['Price']?.error }
          helperText={ valid['Price']?.helpTx }
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

        <TextField 
          variant='outlined'
          label='Consideration (GWei)'
          size="small"
          error={ valid['Consideration']?.error }
          helperText={ valid['Consideration']?.helpTx }
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ value }
          onChange={(e)=>{
            let input = removeKiloSymbol(e.target.value);
            onlyNum('Consideration', input, 0n, setValid);
            setValue(input);
          }}
        />

        <LoadingButton 
          disabled = { placeBuyOrderLoading || hasError(valid) }
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<ShoppingCartOutlined />}
          onClick={()=> placeBuyOrder?.()}
          size='small'
        >
          Buy
        </LoadingButton>

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