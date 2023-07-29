import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/ComBooxContext";
import { useState } from "react";
import { defaultDeal } from "../../../../../queries/ia";
import { useGeneralKeeperAcceptFirstRefusal, useGeneralKeeperCloseDeal } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { HandshakeOutlined, LockOpen } from "@mui/icons-material";
import { Bytes32Zero, HexType } from "../../../../../interfaces";





export function AcceptFirstRefusal({ ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: acceptFirstRefusalLoading,
    write: acceptFirstRefusal
  } = useGeneralKeeperAcceptFirstRefusal({
    address: gk,
    args: [ia, BigInt(deal.head.seqOfDeal), sigHash],
    onSuccess() {
      closeOrderOfDeal();
    }
  });

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
        {/* <Toolbar>
          <h4>Pickup Share</h4>
        </Toolbar> */}

        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <TextField 
            variant='outlined'
            label='SigHash'
            size="small"
            sx={{
              m:1,
              minWidth: 680,
            }}
            value={ sigHash.substring(2) }
            onChange={(e)=>setSigHash(`0x${e.target.value}`)}
          />

          <Button 
            disabled = {acceptFirstRefusalLoading }

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<HandshakeOutlined />}
            onClick={()=> acceptFirstRefusal?.()}
            size='small'
          >
            Accept First Refusal
          </Button>

        </Stack>

    </Paper>

  );  


}