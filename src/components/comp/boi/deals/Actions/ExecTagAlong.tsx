import { Button, Divider, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/ComBooxContext";
import { defaultDeal } from "../../../../../queries/ia";
import { useGeneralKeeperExecTagAlong } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import {  DirectionsRun, SellOutlined, SurfingOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Bytes32Zero, HexType } from "../../../../../interfaces";

export interface TargetShare {
  seqOfShare: number;
  paid: string;
  par: string;
}

export const defaultTargetShare: TargetShare = {
  seqOfShare: 0,
  paid: '0',
  par: '0',
}

export function ExecTagAlong({ ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const [ targetShare, setTargetShare ] = useState<TargetShare>(defaultTargetShare);
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: execTagAlongLoading,
    write: execTagAlong,
  } = useGeneralKeeperExecTagAlong({
    address: gk,
    args: [ ia, 
            BigInt(deal.head.seqOfDeal), 
            BigInt(targetShare.seqOfShare),
            BigInt(targetShare.paid),
            BigInt(targetShare.par),
            sigHash
          ],
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
          <h4>Exercise Tag Along</h4>
        </Toolbar> */}

        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <Stack direction="column" >
            <Stack direction="row" sx={{ alignItems:'center' }} >

              <TextField 
                variant='outlined'
                size="small"
                label='SeqOfTargetShare'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={ e => setTargetShare(v => ({
                  ...v,
                  seqOfShare: parseInt(e.target.value ?? '0'),
                }))}
                value={ targetShare.seqOfShare.toString() } 
              />

              <TextField 
                variant='outlined'
                size="small"
                label='PaidOfTargetShare'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={ e => setTargetShare(v => ({
                  ...v,
                  paid: (e.target.value ?? '0'),
                }))}
                value={ targetShare.paid } 
              />

              <TextField 
                variant='outlined'
                size="small"
                label='ParOfTargetShare'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={ e => setTargetShare(v => ({
                  ...v,
                  paid: (e.target.value ?? '0'),
                }))}
                value={ targetShare.par } 
              />

            </Stack>
            <Stack direction="row" sx={{ alignItems:'center' }} >
              <TextField
                variant='outlined'
                label='SigHash'
                size="small"
                sx={{
                  m:1,
                  minWidth: 685,
                }}
                value={ sigHash.substring(2) }
                onChange={(e)=>setSigHash(`0x${e.target.value}`)}
              />
            </Stack>

          </Stack>

          <Divider orientation="vertical" flexItem />

          <Button 
            disabled = { execTagAlongLoading }

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<SurfingOutlined />}
            onClick={()=> execTagAlong?.()}
            size='small'
          >
            Tag Along
          </Button>

        </Stack>

    </Paper>

  );  

}