import { Button, Paper, Stack, TextField, } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { PersonRemoveOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperRevokeInvestor } from "../../../../generated";
import { ActionsOfInvestorProps } from "../ActionsOfInvestor";
import { HexType, MaxSeqNo, MaxUserNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";


export function RevokeInvestor({ acct, refresh }: ActionsOfInvestorProps) {
  const { gk } = useComBooxContext();

  const [ userNo, setUserNo ] = useState<string>(acct);
  const [ seqOfLR, setSeqOfLR ] = useState<string>('1024');
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
  }

  const {
    isLoading: revokeInvestorLoading,
    write:revokeInvestor,
  } = useGeneralKeeperRevokeInvestor({
    address: gk,
    args: !hasError(valid)
        ? [ BigInt(userNo), BigInt(seqOfLR)]
        : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });
      
  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <TextField 
            variant='outlined'
            size="small"
            label='UserNo'
            error={ valid['UserNo']?.error }
            helperText={ valid['UserNo']?.helpTx ?? ' ' }
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={ e => {
              let input = e.target.value;
              onlyNum('UserNo', input, MaxUserNo, setValid);
              setUserNo(input); 
            }}
            value={ userNo } 
          />

          <TextField 
            variant='outlined'
            size="small"
            label='SeqOfListingRule'
            error={ valid['SeqOfLR']?.error }
            helperText={ valid['SeqOfLR']?.helpTx ?? ' ' }
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={ e => {
              let input = e.target.value;
              onlyNum('SeqOfLR', input, MaxSeqNo, setValid);
              setSeqOfLR( input );
            }}
            value={ seqOfLR } 
          />

          <LoadingButton 
            disabled = { revokeInvestorLoading || hasError(valid)}
            loading={loading}
            loadingPosition="end"
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<PersonRemoveOutlined />}
            onClick={()=> revokeInvestor?.()}
            size='small'
          >
            Revoke
          </LoadingButton>

        </Stack>

    </Paper>

  );  

}