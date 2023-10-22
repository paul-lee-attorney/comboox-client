import { Divider, Paper, Stack, TextField } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperExecTagAlong } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { SurfingOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Bytes32Zero, HexType, MaxData, MaxPrice } from "../../../../../scripts/common";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export interface TargetShare {
  seqOfShare: string;
  paid: string;
  par: string;
}

export const defaultTargetShare: TargetShare = {
  seqOfShare: '0',
  paid: '0',
  par: '0',
}

export function ExecTagAlong({ addr, deal, setOpen, setDeal, refresh}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const [ targetShare, setTargetShare ] = useState<TargetShare>(defaultTargetShare);
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    setDeal(defaultDeal);
    refresh();
    setLoading(false);
    setOpen(false);    
  }

  const {
    isLoading: execTagAlongLoading,
    write: execTagAlong,
  } = useGeneralKeeperExecTagAlong({
    address: gk,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });
      
  const handleClick = ()=> {
    execTagAlong({
      args:[ 
          addr, 
          BigInt(deal.head.seqOfDeal), 
          BigInt(targetShare.seqOfShare),
          strNumToBigInt(targetShare.paid, 2),
          strNumToBigInt(targetShare.par, 2),
          sigHash
        ],
    });
  };

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
                helperText={ valid['SeqOfTarget']?.helpTx ?? ' ' }
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={ e => {
                  let input = e.target.value;
                  onlyInt('SeqOfTarget', input, MaxPrice, setValid);
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
                label='Paid'
                error={ valid['Paid']?.error }
                helperText={ valid['Paid']?.helpTx ?? ' ' }
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={ e => {
                  let input = e.target.value;
                  onlyNum('Paid', input, MaxData, 2, setValid);
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
                label='Par'
                error={ valid['Par']?.error }
                helperText={ valid['Par']?.helpTx ?? ' ' }                
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={ e => {
                  let input = e.target.value;
                  onlyNum('Par', input, MaxData, 2, setValid);
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
                helperText={ valid['SigHash']?.helpTx ?? ' ' }                
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

          <LoadingButton 
            disabled = { execTagAlongLoading || hasError(valid)}
            loading = {loading}
            loadingPosition="end"

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<SurfingOutlined />}
            onClick={ handleClick }
            size='small'
          >
            Tag Along
          </LoadingButton>

        </Stack>

    </Paper>

  );  

}