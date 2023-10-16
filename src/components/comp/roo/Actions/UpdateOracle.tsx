import { useState } from "react";
import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperUpdateOracle } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { Update } from "@mui/icons-material";
import { HexType, MaxData } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";

interface Paras {
  p1: string;
  p2: string;
  p3: string;
}

const defaultParas:Paras = {
  p1: '0',
  p2: '0',
  p3: '0',
}

export function UpdateOracle({seqOfOpt, setOpen, refresh}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();
  const [paras, setParas] = useState<Paras>(defaultParas);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: updateOracleLoading,
    write: updateOracle,
  } = useGeneralKeeperUpdateOracle({
    address: gk,
    args: [BigInt(seqOfOpt), BigInt(paras.p1), BigInt(paras.p2), BigInt(paras.p3)],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='Parameter_1'
          error={ valid['Para_1'].error }
          helperText={ valid['Para_1'].helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Para_1', input, MaxData, setValid);
            setParas(v =>({
              ...v,
              p1: input,
            }));
          }}
          value={ paras.p1 }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Parameter_2'
          error={ valid['Para_2'].error }
          helperText={ valid['Para_2'].helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Para_2', input, MaxData, setValid);
            setParas(v =>({
              ...v,
              p2: input,
            }));
          }}
          value={ paras.p2 }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Parameter_3'
          error={ valid['Para_3'].error }
          helperText={ valid['Para_3'].helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Para_3', input, MaxData, setValid);
            setParas(v =>({
              ...v,
              p3: input,
            }));
          }}
          value={ paras.p3 }
          size='small'
        />

        <Button 
          disabled={ updateOracleLoading || hasError(valid) }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Update /> }
          onClick={()=>updateOracle?.() }
          size='small'
        >
          Update
        </Button>        

      </Stack>
    </Paper>
    
  );

}

