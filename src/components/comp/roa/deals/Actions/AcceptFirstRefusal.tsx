import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/ComBooxContext";
import { useState } from "react";
import { defaultDeal } from "../../../../../queries/ia";
import { useGeneralKeeperComputeFirstRefusal } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { HandshakeOutlined, LockOpen } from "@mui/icons-material";
import { Bytes32Zero, HexType } from "../../../../../interfaces";
import { HexParser } from "../../../../../scripts/toolsKit";





export function AcceptFirstRefusal({ ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: computeFirstRefusalLoading,
    write: computeFirstRefusal
  } = useGeneralKeeperComputeFirstRefusal({
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
      <Stack direction={'row'} sx={{ alignItems:'center'}} >

        <TextField 
          variant='outlined'
          label='SigHash'
          size="small"
          sx={{
            m:1,
            minWidth: 680,
          }}
          value={ sigHash }
          onChange={(e)=>setSigHash(HexParser( e.target.value ))}
        />

        <Button 
          disabled = {computeFirstRefusalLoading }

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<HandshakeOutlined />}
          onClick={()=> computeFirstRefusal?.()}
          size='small'
        >
          Accept First Refusal
        </Button>

      </Stack>

    </Paper>

  );  


}