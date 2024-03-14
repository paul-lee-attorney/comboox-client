import { useState } from "react";
import { usePayrollOfProjectIncreaseBudget } from "../../../../../../../../generated";
import { Paper, Stack, TextField } from "@mui/material";
import { Update } from "@mui/icons-material";
import { HexType, MaxSeqNo } from "../../../../../../read";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx } from "../../../../../../read/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfOwnerProps } from "../../../Owner/write/ActionsOfOwner";
import { useComBooxContext } from "../../../../../../_providers/ComBooxContextProvider";


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


