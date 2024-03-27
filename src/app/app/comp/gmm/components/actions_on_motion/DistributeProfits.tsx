import { useState } from "react";

import { HexType } from "../../../../common";

import { useGeneralKeeperDistributeProfits } from "../../../../../../../generated";

import { Divider, Paper, Stack, TextField } from "@mui/material";
import { PaymentOutlined } from "@mui/icons-material";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx, strNumToBigInt } from "../../../../common/toolsKit";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";

import { ActionsOnMotionProps } from "../ActionsOnMotion";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";


export function DistributeProfits({ motion, setOpen, refresh }:ActionsOnMotionProps) {

  const { gk, setErrMsg } = useComBooxContext();

  const [ amt, setAmt ] = useState('0');
  const [ expireDate, setExpireDate ] = useState(0);  

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults=()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: distributeProfitsLoading,
    write: distributeProfits
  } = useGeneralKeeperDistributeProfits({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=> {
    distributeProfits({
      args: [
        strNumToBigInt(amt, 9) * 10n ** 9n, 
        BigInt(expireDate), 
        BigInt(motion.head.seqOfMotion)
      ],
    });
  };

  return (

    <Paper elevation={3} sx={{ m:1, p:1, color:'divider', border:1 }}  >

      <Stack direction="row" sx={{ alignItems:'start' }} >

        <TextField 
          variant='outlined'
          label='Amount'
          size="small"
          error={ valid['Amount']?.error }
          helperText={ valid['Amount']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Amount', input, 0n, 9, setValid);
            setAmt( input );
          }}
          value={ amt }
        />

        <DateTimeField
          label='ExpireDate'
          size='small'
          sx={{
            m:1,
            minWidth: 218,
          }}
          helperText=' '
          value={ dayjs.unix(expireDate) }
          onChange={(date) => setExpireDate( date ? date.unix() : 0)}
          format='YYYY-MM-DD HH:mm:ss'
        />

        <Divider orientation="vertical" flexItem sx={{m:1}} />

        <LoadingButton
          disabled={ distributeProfitsLoading || hasError(valid)}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          endIcon={<PaymentOutlined />}
          sx={{ m:1, minWidth:128 }}
          onClick={ handleClick }
        >
          Transfer
        </LoadingButton>

      </Stack>

    </Paper>

  );


}

