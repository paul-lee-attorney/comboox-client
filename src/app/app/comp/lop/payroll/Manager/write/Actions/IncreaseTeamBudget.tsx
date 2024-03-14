import { useState } from "react";
import { usePayrollOfProjectIncreaseTeamBudget } from "../../../../../../../../generated";
import { Paper, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { HexType, MaxSeqNo } from "../../../../../../read";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx } from "../../../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfManagerProps } from "../ActionsOfManager";
import { useComBooxContext } from "../../../../../../_providers/ComBooxContextProvider";


export function IncreaseTeamBudget({ addr, seqOfTeam, refresh }: ActionsOfManagerProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const [ deltaQty, setDeltaQty] = useState<string>('0');

  const updateResults = ()=> {
    setLoading(false);
    refresh();
  }


  const {
    isLoading: increaseTeamBudgetLoading,
    write: increaseTeamBudget,
  } = usePayrollOfProjectIncreaseTeamBudget ({
    address: addr,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = () => {
    increaseTeamBudget({
      args: seqOfTeam
      ? [ BigInt(seqOfTeam),
          BigInt(deltaQty)]
      : undefined,
    });
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          variant='outlined'
          label='SeqOfTeam'
          inputProps={{readOnly: true}}
          sx={{
            m:1,
            minWidth: 218,
          }}
          value={ seqOfTeam.toString().padStart(6, '0') }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='DeltaQty'
          error={ valid['DeltaQty']?.error }
          helperText={ valid['DeltaQty']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('DeltaQty', input, MaxSeqNo, setValid);
            setDeltaQty(input);
          }}
          value={ deltaQty }
          size='small'
        />

        <LoadingButton 
          disabled = { seqOfTeam == 0 || deltaQty == '0' || increaseTeamBudgetLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<Add />}
          onClick={ handleClick }
          size='small'
        >
          Increase
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


