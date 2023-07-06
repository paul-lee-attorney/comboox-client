import { useState } from "react";
import { useBookOfPledgesCreatePledge, useGeneralKeeperTransferPledge, usePrepareBookOfPledgesCreatePledge, usePrepareGeneralKeeperTransferPledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Body, Head, codifyHeadOfPledge } from "../../../queries/bop";
import { BigNumber } from "ethers";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getShare } from "../../../queries/bos";
import { Create } from "@mui/icons-material";

interface TransferPledgeProps{
  seqOfShare: number;
  seqOfPld: number;
  setOpen:(flag:boolean)=>void;
  getAllPledges:()=>void;
}

export function TransferPledge({seqOfShare, seqOfPld, setOpen, getAllPledges}:TransferPledgeProps) {

  const { gk, boox } = useComBooxContext();
  
  const [ buyer, setBuyer ] = useState<number>();
  const [ amt, setAmt ] = useState<number>();

  const {
    config: transferPledgeConfig
  } = usePrepareGeneralKeeperTransferPledge({
    address: gk,
    args: buyer && amt
      ? [ BigNumber.from(seqOfShare), 
          BigNumber.from(seqOfPld), 
          BigNumber.from(buyer),
          BigNumber.from(amt)
        ]
      : undefined,
  })

  const {
    isLoading: transferPledgeLoading,
    write: transferPledge,
  } = useGeneralKeeperTransferPledge({
    ...transferPledgeConfig,
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h4>Transfer Pledge</h4>
      </Toolbar>

      <Stack direction='row' sx={{ alignItems:'center' }} >

        <TextField 
          variant='filled'
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
          variant='filled'
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
          endIcon={ <Create /> }
          onClick={()=>transferPledge?.() }
          size='small'
        >
          Transfer
        </Button>        

      </Stack>
    </Paper>
  );

}


