import { useState } from "react";
import { usePayrollOfProjectIncreaseBudget, usePayrollOfProjectSetBudget } from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Paper, Stack, TextField } from "@mui/material";
import { Update } from "@mui/icons-material";
import { HexType, MaxPrice, MaxSeqNo, MaxUserNo } from "../../../../../scripts/common";
import { FormResults, centToDollar, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfOwnerProps } from "../../Owner/ActionsOfOwner";


export function IncreaseBudget({ addr, refresh }: ActionsOfOwnerProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const [ deltaQty, setDeltaQty] = useState<string>('0');

  const updateResults = ()=> {
    setLoading(false);
    refresh();
  }

  const {
    isLoading: increaseBudgetLoading,
    write: increaseBudget,
  } = usePayrollOfProjectIncreaseBudget ({
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
    increaseBudget({
      args: [ 
        BigInt(deltaQty)
      ],
    });
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'start' }} >

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
          disabled = { increaseBudgetLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={ handleClick }
          size='small'
        >
          Increase
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


