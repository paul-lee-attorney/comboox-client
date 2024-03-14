import { useState } from "react";
import { usePayrollOfProjectExtendPeriod } from "../../../../../../../../generated";
import { Paper, Stack, TextField } from "@mui/material";
import { Update } from "@mui/icons-material";
import { HexType, MaxSeqNo } from "../../../../../../read";
import { FormResults, defFormResults, hasError, longSnParser, onlyInt, refreshAfterTx } from "../../../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfLeaderProps } from "../ActionsOfLeader";
import { useComBooxContext } from "../../../../../../_providers/ComBooxContextProvider";


export function ExtendPeriod({ addr, seqOfTeam, memberNo, refresh }: ActionsOfLeaderProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=> {
    setLoading(false);
    refresh();
  }

  const [ delta, setDelta ] = useState(0);

  const {
    isLoading: extendPeriodLoading,
    write: extendPeriod,
  } = usePayrollOfProjectExtendPeriod({
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
    extendPeriod({
      args: seqOfTeam && memberNo && delta
        ? [ BigInt(seqOfTeam),
            BigInt(memberNo),
            BigInt(delta)]
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
          value={ seqOfTeam?.toString().padStart(6, '0') }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='UserNo'
          inputProps={{readOnly: true}}
          sx={{
            m:1,
            minWidth: 218,
          }}
          value={ longSnParser(memberNo?.toString() ?? '0') }
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
            setDelta(Number(input));
          }}
          value={ delta }
          size='small'
        />

        <LoadingButton 
          disabled = { !(seqOfTeam && memberNo) || delta == 0 || 
            extendPeriodLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={ handleClick }
          size='small'
        >
          Extend Period
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


