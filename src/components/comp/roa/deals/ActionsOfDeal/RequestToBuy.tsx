import { useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { PanToolOutlined } from "@mui/icons-material";
import { useGeneralKeeperRequestToBuy } from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { HexType, MaxData, MaxPrice } from "../../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../../scripts/common/toolsKit";


export function RequestToBuy({addr, deal, setOpen, refresh}:ActionsOfDealProps) {

  const {gk} = useComBooxContext();

  const [ paidOfTarget, setPaidOfTarget ] = useState<string>('0');
  const [ seqOfPledge, setSeqOfPledge ] = useState<string>('0');
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const updateResults = ()=>{
    refresh();
    setOpen(false);    
  }

  const {
    isLoading: requestToBuyLoading,
    write: requestToBuy,
  } = useGeneralKeeperRequestToBuy({
    address: gk,
    args: [ addr,
            BigInt(deal.head.seqOfDeal), 
            BigInt(paidOfTarget), 
            BigInt(seqOfPledge)
          ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
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
            label='PaidOfTarget'
            size="small"
            error={ valid['PaidOfTarget'].error }
            helperText={ valid['PaidOfTarget'].helpTx }
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => {
              let input = e.target.value;
              onlyNum('PaidOfTarget', input, MaxData, setValid);
              setPaidOfTarget(input);
            }}
            value={ paidOfTarget }
          />

          <TextField 
            variant='outlined'
            label='SeqOfPledge'
            size="small"
            error={ valid['SeqOfPledge'].error }
            helperText={ valid['SeqOfPledge'].helpTx }
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => {
              let input = e.target.value;
              onlyNum('SeqOfPledge', input, MaxPrice, setValid);
              setSeqOfPledge(input);
            }}
            value={ seqOfPledge }
          />

          <Button 
            disabled = {!requestToBuy || requestToBuyLoading || hasError(valid)}
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