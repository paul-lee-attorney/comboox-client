import { useState } from "react";
import { usePayrollOfProjectEnrollMember } from "../../../../../../../../generated";
import { Paper, Stack, TextField } from "@mui/material";
import { BorderColor } from "@mui/icons-material";
import { HexType, MaxPrice, MaxSeqNo, MaxUserNo } from "../../../../../../read";
import { FormResults, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfManagerProps } from "../../../Manager/write/ActionsOfManager";
import { useComBooxContext } from "../../../../../../_providers/ComBooxContextProvider";


export function EnrollMember({ addr, seqOfTeam, refresh }: ActionsOfManagerProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=> {
    setLoading(false);
    refresh();
  }

  const {
    isLoading: enrollMemberLoading,
    write: enrollMember,
  } = usePayrollOfProjectEnrollMember({
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

  const [ userNo, setUserNo ] = useState<string>('0');
  const [ rate, setRate ] = useState<string>('0');
  const [ estimated, setEstimated ] = useState<string>('0');

  const handleClick = () => {
    enrollMember({
      args: seqOfTeam
      ? [ BigInt(seqOfTeam),
          BigInt(userNo),
          strNumToBigInt(rate, 4),
          BigInt(estimated)]
      : undefined,
    });
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          variant='outlined'
          label='UserNo'
          error={ valid['UserNo']?.error }
          helperText={ valid['UserNo']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('UserNo', input, MaxUserNo, setValid);
            setUserNo(input);
          }}
          value={ userNo }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Rate'
          error={ valid['Rate']?.error }
          helperText={ valid['Rate']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Rate', input, MaxPrice, 4, setValid);
            setRate(input);
          }}
          value={ rate }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Estimated'
          error={ valid['Estimated']?.error }
          helperText={ valid['Estimated']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('Estimated', input, MaxSeqNo, setValid);
            setEstimated(input);
          }}
          value={ estimated }
          size='small'
        />

        <LoadingButton 
          disabled = { seqOfTeam == undefined || userNo == '0' || rate == '0' || 
            estimated == '0' || enrollMemberLoading || hasError(valid) }
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


