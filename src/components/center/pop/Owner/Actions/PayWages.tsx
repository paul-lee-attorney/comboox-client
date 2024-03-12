import { useState } from "react";
import { usePayrollOfProjectPayWages } from "../../../../../generated";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { Paper, Stack, TextField } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { HexType } from "../../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx, removeKiloSymbol, strNumToBigInt } from "../../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { ActionsOfOwnerProps } from "../ActionsOfOwner";

export function PayWages({ addr, refresh }: ActionsOfOwnerProps ) {

  const { setErrMsg } = useComBooxContext();
  
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [loading, setLoading] = useState(false);

  const updateInfo = ()=>{
    refresh();
    setLoading(false);
  }

  const [ amt, setAmt] = useState<string>('0');

  const {
    isLoading: payWagesLoading,
    write: payWages,
  } = usePayrollOfProjectPayWages({
    address: addr,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      refreshAfterTx(hash, updateInfo);
    }
  });

  const handleClick = () => {
    payWages({
      value: strNumToBigInt(amt, 9) * (10n ** 9n)
    });
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          variant='outlined'
          label='Amount (ETH)'
          error={ valid['Amount']?.error }
          helperText={ valid['Amount']?.helpTx ?? ' ' }  
          sx={{
            m:1,
            minWidth: 456,
          }}
          onChange={(e) => {
            let input = removeKiloSymbol(e.target.value);
            onlyNum('Amount', input, 0n, 9, setValid);
            setAmt(input);
          }}
          value={ amt }
          size='small'
        />

        <LoadingButton 
          disabled = { payWagesLoading || hasError(valid) }
          loading={loading}
          loadingPosition='end'
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<Payment />}
          onClick={ handleClick }
          size='small'
        >
          Pay Wages
        </LoadingButton>

      </Stack>
    </Paper>
  );

}


