import { useState } from "react";
import { usePayrollOfProjectRestoreMember } from "../../../../../../../../generated";
import { Paper, Stack, TextField } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { HexType } from "../../../../../../read";
import { FormResults, defFormResults, hasError, longSnParser, refreshAfterTx } from "../../../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfLeaderProps } from "../ActionsOfLeader";
import { useComBooxContext } from "../../../../../../_providers/ComBooxContextProvider";

export function RestoreMember({ addr, seqOfTeam, memberNo, refresh }: ActionsOfLeaderProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=> {
    setLoading(false);
    refresh();
  }

  const {
    isLoading: restoreMemberLoading,
    write: restoreMember,
  } = usePayrollOfProjectRestoreMember({
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
    restoreMember({
      args: seqOfTeam && memberNo 
        ? [ BigInt(seqOfTeam),
            BigInt(memberNo)]
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

        <LoadingButton 
          disabled = { seqOfTeam == undefined || memberNo == undefined || 
            restoreMemberLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<PersonAdd />}
          onClick={ handleClick }
          size='small'
        >
          Restore
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


