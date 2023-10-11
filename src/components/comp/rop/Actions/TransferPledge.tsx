import { useState } from "react";
import { useGeneralKeeperTransferPledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { HexType } from "../../../../scripts/common";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function TransferPledge({pld, setOpen, refresh}:ActionsOfPledgeProps) {

  const { gk } = useComBooxContext();
  
  const [ buyer, setBuyer ] = useState<number>();
  const [ amt, setAmt ] = useState<number>();

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: transferPledgeLoading,
    write: transferPledge,
  } = useGeneralKeeperTransferPledge({
    address: gk,
    args: buyer && amt
      ? [ BigInt(pld.head.seqOfShare), 
          BigInt(pld.head.seqOfPld), 
          BigInt(buyer),
          BigInt(amt)
        ]
      : undefined,
      onSuccess(data) {
        let hash: HexType = data.hash;
        refreshAfterTx(hash, updateResults);
      }    
    });

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Transfer Pledge</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='Buyer'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setBuyer(parseInt(e.target.value ?? '0'))}
          value={ buyer?.toString() }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Amount'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setAmt(parseInt(e.target.value ?? '0'))}
          value={ amt?.toString() }
          size='small'
        />

        <Button 
          disabled={ !transferPledge || transferPledgeLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <CurrencyExchange /> }
          onClick={()=>transferPledge?.() }
          size='small'
        >
          Transfer
        </Button>        

      </Stack>
    </Paper>
  );

}


