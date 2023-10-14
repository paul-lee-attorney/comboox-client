import { Button, Paper, Stack, TextField, } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import {  BorderColor } from "@mui/icons-material";
import { useState } from "react";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { useGeneralKeeperRegInvestor } from "../../../../generated";
import { ActionsOfInvestorProps } from "../ActionsOfInvestor";
import { Bytes32Zero, HexType, MaxUserNo } from "../../../../scripts/common";


export function RegInvestor({ refresh }: ActionsOfInvestorProps) {
  const {gk} = useComBooxContext();

  const [ groupRep, setGroupRep ] = useState<string>('0');
  const [ idHash, setIdHash ] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: regInvestorLoading,
    write:regInvestor,
  } = useGeneralKeeperRegInvestor({
    address: gk,
    args: [ BigInt(groupRep), 
            idHash
          ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });
      
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
          error={ valid['GroupRep'].error }
          helperText={ valid['GroupRep'].helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => {
            let input = e.target.value;
            onlyNum('GroupRep', input, MaxUserNo, setValid);
            setGroupRep(input); 
          }}
          value={ groupRep } 
        />

        <TextField
          variant='outlined'
          label='IdentityInfoHash'
          size="small"
          error={ valid['IDHash'].error }
          helperText={ valid['IDHash'].helpTx }
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

        <Button 
          disabled = { regInvestorLoading || hasError(valid)}
          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<BorderColor />}
          onClick={()=> regInvestor?.()}
          size='small'
        >
          Register
        </Button>

      </Stack>

    </Paper>

  );  

}