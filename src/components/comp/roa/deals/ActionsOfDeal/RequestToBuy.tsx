import { useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { PanToolOutlined } from "@mui/icons-material";
import { useGeneralKeeperRequestToBuy } from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { ActionsOfDealProps } from "../ActionsOfDeal";


export function RequestToBuy({ia, deal, setOpen, refreshDealsList}:ActionsOfDealProps) {

  const {gk} = useComBooxContext();

  const [ paidOfTarget, setPaidOfTarget ] = useState<number>(0);
  const [ seqOfPledge, setSeqOfPledge ] = useState<number>(0);

  const {
    isLoading: requestToBuyLoading,
    write: requestToBuy,
  } = useGeneralKeeperRequestToBuy({
    address: gk,
    args: [ ia,
            BigInt(deal.head.seqOfDeal), 
            BigInt(paidOfTarget), 
            BigInt(seqOfPledge)
          ],
    onSuccess() {
      refreshDealsList();
      setOpen(false);
    }
  })

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
            label='PaidOfTarget'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setPaidOfTarget(parseInt(e.target.value ?? '0'))}
            value={ paidOfTarget.toString() }
          />

          <TextField 
            variant='outlined'
            label='SeqOfPledge'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setSeqOfPledge(parseInt(e.target.value ?? '0'))}
            value={ seqOfPledge.toString() }
          />

          <Button 
            disabled = {!requestToBuy || requestToBuyLoading }
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<PanToolOutlined />}
            onClick={()=> requestToBuy?.()}
            size='small'
          >
            Request To Buy
          </Button>

        </Stack>

    </Paper>

  );
  
}