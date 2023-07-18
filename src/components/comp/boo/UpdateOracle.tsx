import { Dispatch, SetStateAction, useState } from "react";
import { ActionsOfOptionProps } from "./ActionsOfOption";
import { useGeneralKeeperUpdateOracle } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { LockOutlined, Update } from "@mui/icons-material";

interface Paras {
  p1: bigint;
  p2: bigint;
  p3: bigint;
}

const defaultParas = {
  p1: BigInt(0),
  p2: BigInt(0),
  p3: BigInt(0),
}

export function UpdateOracle({seqOfOpt, setOpen, getAllOpts}:ActionsOfOptionProps) {

  const { gk } = useComBooxContext();
  const [paras, setParas] = useState<Paras>(defaultParas);

  const {
    isLoading: updateOracleLoading,
    write: updateOracle,
  } = useGeneralKeeperUpdateOracle({
    address: gk,
    args: [seqOfOpt, paras.p1, paras.p2, paras.p3],
    onSuccess() {
      getAllOpts();
      setOpen(false);
    }
  })

  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h4>Update Oracle</h4>
      </Toolbar>

      <Stack direction='row' >

        <TextField 
          variant='filled'
          label='Parameter_1'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setParas(v =>({
            ...v,
            para1: BigInt(e.target.value ?? '0'),
          }))}
          value={ paras.p1.toString() }
          size='small'
        />

        <TextField 
          variant='filled'
          label='Parameter_2'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setParas(v =>({
            ...v,
            para1: BigInt(e.target.value ?? '0'),
          }))}
          value={ paras.p2.toString() }
          size='small'
        />

        <TextField 
          variant='filled'
          label='Parameter_3'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setParas(v =>({
            ...v,
            para1: BigInt(e.target.value ?? '0'),
          }))}
          value={ paras.p3.toString() }
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

