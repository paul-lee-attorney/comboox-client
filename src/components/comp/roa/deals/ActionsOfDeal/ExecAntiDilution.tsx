import { useState } from "react";
import { Bytes32Zero, HexType, MaxPrice } from "../../../../../scripts/common";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperExecAntiDilution } from "../../../../../generated";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { LocalDrinkOutlined } from "@mui/icons-material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyNum, refreshAfterTx } from "../../../../../scripts/common/toolsKit";

export function ExecAntiDilution({addr, deal, setOpen, setDeal, refresh}:ActionsOfDealProps) {

  const {gk} = useComBooxContext();

  const [ seqOfShare, setSeqOfShare ] = useState<string>('0');
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const updateResults = ()=>{
    setDeal(defaultDeal);
    refresh();
    setOpen(false);    
  }

  const {
    isLoading: execAntiDilutionLoading,
    write: execAntiDilution,
  } = useGeneralKeeperExecAntiDilution({
    address: gk,
    args: !hasError(valid)
        ? [ addr, 
            BigInt(deal.head.seqOfDeal), 
            BigInt(seqOfShare),
            sigHash
          ]
        : undefined,
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
            label='SeqOfTargetShare'
            size="small"
            error={ valid['SeqOfTarget']?.error }
            helperText={ valid['SeqOfTarget']?.helpTx }
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => {
              let input = e.target.value;
              onlyNum('SeqOfTarget', input, MaxPrice, setValid);
              setSeqOfShare(input);
            }}
            value={ seqOfShare }
          />

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
            onChange={(e) => {
              let input = HexParser( e.target.value );
              onlyHex('SigHash', input, 64, setValid);
              setSigHash(input);
            }}
            value={ sigHash }
          />

          <Button 
            disabled = {!execAntiDilution || execAntiDilutionLoading || deal.body.state > 1 || hasError(valid)}

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<LocalDrinkOutlined />}
            onClick={()=> execAntiDilution?.()}
            size='small'
          >
            Anti Dilution
          </Button>

        </Stack>

    </Paper>



  );
  
}