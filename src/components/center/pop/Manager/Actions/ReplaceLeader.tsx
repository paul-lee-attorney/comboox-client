import { useState } from "react";
import { usePayrollOfProjectReplaceLeader, usePayrollOfProjectSetBudget } from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Paper, Stack, TextField } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import { HexType, MaxUserNo } from "../../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx, strNumToBigInt } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfLeaderProps } from "../../Leader/ActionsOfLeader";
import { ActionsOfManagerProps } from "../ActionsOfManager";


export function ReplaceLeader({ addr, seqOfTeam, refresh }: ActionsOfManagerProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const [ leader, setLeader] = useState<string>('0');

  const updateResults = ()=> {
    setLoading(false);
    refresh();
  }

  const {
    isLoading: replaceLeaderLoading,
    write: replaceLeader,
  } = usePayrollOfProjectReplaceLeader ({
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
    replaceLeader({
      args: [ 
        BigInt(seqOfTeam),
        BigInt(leader)
      ],
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
          label='Leader'
          error={ valid['Leader']?.error }
          helperText={ valid['Leader']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('Leader', input, MaxUserNo, setValid);
            setLeader(input);
          }}
          value={ leader }
          size='small'
        />

        <LoadingButton 
          disabled = { seqOfTeam == 0 || leader == '0' || replaceLeaderLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<CurrencyExchange />}
          onClick={ handleClick }
          size='small'
        >
          Replace
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


