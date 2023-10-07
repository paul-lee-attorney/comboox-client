import { Button, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { RedoOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperWithdrawInitialOffer } from "../../../../generated";
import { ActionsOfOrderProps } from "../ActionsOfOrder";
import { InitOffer, defaultOffer } from "../../../../scripts/comp/loo";

export function WithdrawInitialOffer({ classOfShare: classOfShare, getAllOrders: getAllOrders }: ActionsOfOrderProps) {
  const {gk} = useComBooxContext();

  const [ offer, setOffer ] = useState<InitOffer>(defaultOffer);

  const {
    isLoading: withdrawInitOfferLoading,
    write:withdrawInitOffer,
  } = useGeneralKeeperWithdrawInitialOffer({
    address: gk,
    args: [ BigInt(classOfShare),
            BigInt(offer.seqOfOrder),
            BigInt(offer.seqOfLR), 
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

        <TextField 
          variant='outlined'
          size="small"
          label='SeqOfListingRule'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setOffer( v => ({
            ...v,
            seqOfLR: parseInt(e.target.value ?? '0'),
          }))}

          value={ offer.seqOfLR.toString() } 
        />

        <Button 
          disabled = { withdrawInitOfferLoading }

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<RedoOutlined />}
          onClick={()=> withdrawInitOffer?.()}
          size='small'
        >
          Withdraw
        </Button>

      </Stack>

    </Paper>

  );  

}