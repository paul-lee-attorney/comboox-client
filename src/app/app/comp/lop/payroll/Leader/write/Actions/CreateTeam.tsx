import { useState } from "react";
import { usePayrollOfProjectCreateTeam } from "../../../../../../../../generated";
import { Paper, Stack, TextField } from "@mui/material";
import { BorderColor } from "@mui/icons-material";
import { HexType, MaxPrice, MaxSeqNo } from "../../../../../../read";
import { FormResults, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfOwnerProps } from "../../../Owner/write/ActionsOfOwner";
import { useComBooxContext } from "../../../../../../_providers/ComBooxContextProvider";


export function CreateTeam({ addr, refresh }: ActionsOfOwnerProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=> {
    setLoading(false);
    refresh();
  }

  const {
    isLoading: createTeamLoading,
    write: createTeam,
  } = usePayrollOfProjectCreateTeam({
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

  const [ rate, setRate ] = useState<string>('0');
  const [ estimated, setEstimated ] = useState<string>('0');

  const handleClick = () => {
    createTeam({
      args: [ 
        strNumToBigInt(rate, 4),
        BigInt(estimated)
      ],
    });
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'start' }} >

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
          disabled = { rate == '0' || estimated == '0' || createTeamLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<BorderColor />}
          onClick={ handleClick }
          size='small'
        >
          Create
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


