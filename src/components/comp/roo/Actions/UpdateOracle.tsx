import { useState } from "react";
import { ActionsOfOptionProps } from "../ActionsOfOption";
import { useGeneralKeeperUpdateOracle } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { Update } from "@mui/icons-material";

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

export function UpdateOracle({seqOfOpt, setOpen, getAllOpts}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();
  const [paras, setParas] = useState<Paras>(defaultParas);

  const {
    isLoading: updateOracleLoading,
    write: updateOracle,
  } = useGeneralKeeperUpdateOracle({
    address: gk,
    args: [seqOfOpt, BigInt(paras.p1), BigInt(paras.p2), BigInt(paras.p3)],
    onSuccess() {
      getAllOpts();
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Update Oracle</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='Parameter_1'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setParas(v =>({
            ...v,
            p1: e.target.value ?? '0',
          }))}
          value={ paras.p1 }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Parameter_2'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setParas(v =>({
            ...v,
            p2: e.target.value ?? '0',
          }))}
          value={ paras.p2 }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Parameter_3'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setParas(v =>({
            ...v,
            p3: e.target.value ?? '0',
          }))}
          value={ paras.p3 }
          size='small'
        />

        <Button 
          disabled={ updateOracleLoading }
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

