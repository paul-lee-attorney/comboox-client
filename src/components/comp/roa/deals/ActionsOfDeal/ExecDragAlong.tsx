import { Button, Divider, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperExecDragAlong } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import {  AgricultureOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Bytes32Zero, HexType, MaxData, MaxPrice } from "../../../../../scripts/common";
import { TargetShare, defaultTargetShare } from "./ExecTagAlong";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyNum, refreshAfterTx } from "../../../../../scripts/common/toolsKit";

export function ExecDragAlong({ addr, deal, setOpen, setDeal, refresh}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const [ targetShare, setTargetShare ] = useState<TargetShare>(defaultTargetShare);
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const updateResults = ()=>{
    setDeal(defaultDeal);
    refresh();
    setOpen(false);    
  }

  const {
    isLoading: execDragAlongLoading,
    write: execDragAlong,
  } = useGeneralKeeperExecDragAlong({
    address: gk,
    args: [ addr, 
            BigInt(deal.head.seqOfDeal), 
            BigInt(targetShare.seqOfShare),
            BigInt(targetShare.paid),
            BigInt(targetShare.par),
            sigHash
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

          <Stack direction="column" >
            <Stack direction="row" sx={{ alignItems:'center' }} >

              <TextField 
                variant='outlined'
                size="small"
                label='SeqOfTargetShare'
                error={ valid['SeqOfTarget']?.error }
                helperText={ valid['SeqOfTarget']?.helpTx }
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={ e => {
                  let input = e.target.value;
                  onlyNum('SeqOfTarget', input, MaxPrice, setValid);
                  setTargetShare(v => ({
                    ...v,
                    seqOfShare: input,
                  }));
                }}
                value={ targetShare.seqOfShare } 
              />

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
                  setTargetShare(v => ({
                    ...v,
                    paid: input,
                  }));
                }}
                value={ targetShare.paid } 
              />

              <TextField 
                variant='outlined'
                size="small"
                label='Par (Cent)'
                error={ valid['Par']?.error }
                helperText={ valid['Par']?.helpTx }
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={ e => {
                  let input = e.target.value;
                  onlyNum('Par', input, MaxData, setValid);
                  setTargetShare(v => ({
                    ...v,
                    par: input,
                  }));
                }}
                value={ targetShare.par } 
              />

            </Stack>
            <Stack direction="row" sx={{ alignItems:'center' }} >
              <TextField
                variant='outlined'
                label='SigHash'
                size="small"
                error={ valid['SigHash']?.error }
                helperText={ valid['SigHash']?.helpTx }
                sx={{
                  m:1,
                  minWidth: 685,
                }}
                value={ sigHash }
                onChange={(e)=>{
                  let input = HexParser( e.target.value );
                  onlyHex('SigHash', input, 64, setValid); 
                  setSigHash(input);
                }}
              />
            </Stack>

          </Stack>

          <Divider orientation="vertical" flexItem />

          <Button 
            disabled = { execDragAlongLoading || hasError(valid)}
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<AgricultureOutlined />}
            onClick={()=> execDragAlong?.()}
            size='small'
          >
            Drag Along
          </Button>

        </Stack>

    </Paper>

  );  

}