import { useState } from "react";
import { useGeneralKeeperTransferPledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { HexType, MaxData, MaxUserNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function TransferPledge({pld, setOpen, refresh}:ActionsOfPledgeProps) {

  const { gk } = useComBooxContext();
  
  const [ buyer, setBuyer ] = useState<string>('0');
  const [ amt, setAmt ] = useState<string>('0');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: transferPledgeLoading,
    write: transferPledge,
  } = useGeneralKeeperTransferPledge({
    address: gk,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }    
  });

  const handleClick = ()=>{
    transferPledge({
      args: [ 
        BigInt(pld.head.seqOfShare), 
        BigInt(pld.head.seqOfPld), 
        BigInt(buyer),
        BigInt(amt)
      ],
    })
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='Buyer'
          error={ valid['Buyer']?.error }
          helperText={ valid['Buyer']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('Buyer', input, MaxUserNo, setValid);
            setBuyer(input);
          }}
          value={ buyer }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Amount'
          error={ valid['Amount']?.error }
          helperText={ valid['Amount']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('Amount', input, MaxData, setValid);
            setAmt(input);
          }}
          value={ amt }
          size='small'
        />

        <LoadingButton 
          disabled={ !transferPledge || transferPledgeLoading || hasError(valid)}
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <CurrencyExchange /> }
          onClick={ handleClick }
          size='small'
        >
          Transfer
        </LoadingButton>        

      </Stack>
    </Paper>
  );

}


