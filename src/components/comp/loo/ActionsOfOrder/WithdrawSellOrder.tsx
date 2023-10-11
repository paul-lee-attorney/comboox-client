import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { RedoOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperWithdrawSellOrder } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";
import { HexType } from "../../../../scripts/common";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";


export function WithdrawSellOrder({ classOfShare, refresh }: ActionsOfOrderProps) {
  const {gk} = useComBooxContext();

  const [ offer, setOffer ] = useState<InitOffer>(defaultOffer);

  const {
    isLoading: withdrawSellOrderLoading,
    write:withdrawSellOrder,
  } = useGeneralKeeperWithdrawSellOrder({
    address: gk,
    args: [ BigInt(classOfShare),
            BigInt(offer.seqOfOrder)
           ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
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
          label='SeqOfOrder'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOffer( v => ({
            ...v,
            seqOfOrder: parseInt(e.target.value ?? '0'),
          }))}

          value={ offer.seqOfOrder.toString() } 
        />

        <Button 
          disabled = { withdrawSellOrderLoading }

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<RedoOutlined />}
          onClick={()=> withdrawSellOrder?.()}
          size='small'
        >
          Withdraw
        </Button>

      </Stack>

    </Paper>

  );  

}