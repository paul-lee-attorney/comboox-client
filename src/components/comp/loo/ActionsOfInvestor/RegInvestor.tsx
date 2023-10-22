import { Button, Paper, Stack, TextField, } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import {  BorderColor } from "@mui/icons-material";
import { useState } from "react";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyInt, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { useGeneralKeeperRegInvestor } from "../../../../generated";
import { ActionsOfInvestorProps } from "../ActionsOfInvestor";
import { Bytes32Zero, HexType, MaxUserNo } from "../../../../scripts/common";
import { LoadingButton } from "@mui/lab";


export function RegInvestor({ refresh }: ActionsOfInvestorProps) {
  const {gk} = useComBooxContext();

  const [ groupRep, setGroupRep ] = useState<string>('0');
  const [ idHash, setIdHash ] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const {
    isLoading: regInvestorLoading,
    write:regInvestor,
  } = useGeneralKeeperRegInvestor({
    address: gk,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });
      
  const handleClick = ()=>{
    regInvestor({
      args: [ 
        BigInt(groupRep), 
        idHash
      ],
    })
  }

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >

      <Stack direction="row" sx={{ alignItems:'center' }} >

        <TextField 
          variant='outlined'
          size="small"
          label='GroupRep'
          error={ valid['GroupRep']?.error }
          helperText={ valid['GroupRep']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyInt('GroupRep', input, MaxUserNo, setValid);
            setGroupRep(input); 
          }}
          value={ groupRep } 
        />

        <TextField
          variant='outlined'
          label='IdentityInfoHash'
          size="small"
          error={ valid['IDHash']?.error }
          helperText={ valid['IDHash']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 685,
          }}
          value={ idHash }
          onChange={(e)=>{
            let input = HexParser( e.target.value );
            onlyHex('IDHash', input, 64, setValid);
            setIdHash(input);
          }}
        />

        <LoadingButton 
          disabled = { regInvestorLoading || hasError(valid)}
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<BorderColor />}
          onClick={ handleClick }
          size='small'
        >
          Register
        </LoadingButton>

      </Stack>

    </Paper>

  );  

}