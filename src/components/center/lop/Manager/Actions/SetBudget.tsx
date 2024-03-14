import { useState } from "react";
import { usePayrollOfProjectSetBudget } from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Paper, Stack, TextField } from "@mui/material";
import { Update } from "@mui/icons-material";
import { HexType, MaxPrice, MaxSeqNo, MaxUserNo } from "../../../../../scripts/common";
import { FormResults, centToDollar, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfOwnerProps } from "../../Owner/ActionsOfOwner";


export function SetBudget({ addr, refresh }: ActionsOfOwnerProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const [ rate, setRate] = useState<string>('0');
  const [ estimated, setEstimated] = useState<string>('0');

  const updateResults = () => {
    setLoading(false);
    refresh();
  }

  const {
    isLoading: setBudgetLoading,
    write: setBudget,
  } = usePayrollOfProjectSetBudget({
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
    setBudget({
      args: [ 
        strNumToBigInt(rate, 2),
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
            onlyNum('Rate', input, MaxPrice, 2, setValid);
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
          disabled = { setBudgetLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={ handleClick }
          size='small'
        >
          Set
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


