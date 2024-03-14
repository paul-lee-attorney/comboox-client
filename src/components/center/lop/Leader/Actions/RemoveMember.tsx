import { useState } from "react";
import { usePayrollOfProjectRemoveMember } from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Paper, Stack, TextField } from "@mui/material";
import { PersonRemove } from "@mui/icons-material";
import { HexType } from "../../../../../scripts/common";
import { FormResults, defFormResults, hasError, longSnParser, refreshAfterTx } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfLeaderProps } from "../ActionsOfLeader";


export function RemoveMember({ addr, seqOfTeam, memberNo, refresh }: ActionsOfLeaderProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=> {
    setLoading(false);
    refresh();
  }

  const {
    isLoading: removeMemberLoading,
    write: removeMember,
  } = usePayrollOfProjectRemoveMember({
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
    removeMember({
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
            removeMemberLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<PersonRemove />}
          onClick={ handleClick }
          size='small'
        >
          Remove
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


