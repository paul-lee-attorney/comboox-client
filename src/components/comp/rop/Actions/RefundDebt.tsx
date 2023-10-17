import { useState } from "react";
import { useGeneralKeeperRefundDebt } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { VolunteerActivismOutlined } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { HexType, MaxData } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function RefundDebt({pld, setOpen, refresh}:ActionsOfPledgeProps) {

  const { gk } = useComBooxContext();
  
  const [ amt, setAmt ] = useState<string>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: refundDebtLoading,
    write: refundDebt,
  } = useGeneralKeeperRefundDebt({
    address: gk,
    args: amt
      ? [ BigInt(pld.head.seqOfShare), 
          BigInt(pld.head.seqOfPld), 
          BigInt(amt)
        ]
      : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }    
  });
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='Amount (Cent)'
          size="small"
          error={ valid['Amount']?.error }
          helperText={ valid['Amount']?.helpTx }
  
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Amount', input, MaxData, setValid);
            setAmt(input);
          }}
          value={ amt?.toString() }
        />

        <Button 
          disabled={ refundDebtLoading || hasError(valid) }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <VolunteerActivismOutlined /> }
          onClick={()=>refundDebt?.() }
          size='small'
        >
          Refund Debt
        </Button>        

      </Stack>
    </Paper>
  );

}


