import { useState } from "react";
import { usePayrollOfProjectEnrollTeam, usePayrollOfProjectIncreaseBudget, usePayrollOfProjectSetBudget } from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Paper, Stack, TextField } from "@mui/material";
import { BorderColor, Update } from "@mui/icons-material";
import { HexType, MaxPrice, MaxSeqNo, MaxUserNo } from "../../../../../scripts/common";
import { FormResults, centToDollar, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfLeaderProps } from "../../Leader/ActionsOfLeader";
import { ActionsOfManagerProps } from "../ActionsOfManager";


export function EnrollTeam({ addr, seqOfTeam, refresh }: ActionsOfManagerProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const {
    isLoading: enrollTeamLoading,
    write: enrollTeam,
  } = usePayrollOfProjectEnrollTeam ({
    address: addr,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const handleClick = () => {
    enrollTeam({
      args: [ 
        BigInt(seqOfTeam)
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
          value={ seqOfTeam?.toString().padStart(6, '0') }
          size='small'
        />

        <LoadingButton 
          disabled = { seqOfTeam == undefined || enrollTeamLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<BorderColor />}
          onClick={ handleClick }
          size='small'
        >
          Enroll
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


