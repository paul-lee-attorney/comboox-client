import { Button, Paper, Stack, TextField, } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import {  BorderColor } from "@mui/icons-material";
import { useState } from "react";
import { HexParser } from "../../../../scripts/common/toolsKit";
import { useGeneralKeeperRegInvestor } from "../../../../generated";
import { ActionsOfInvestorProps } from "../ActionsOfInvestor";
import { Bytes32Zero, HexType } from "../../../../scripts/common";


export function RegInvestor({getAllInvestors: getAllInvestors }: ActionsOfInvestorProps) {
  const {gk} = useComBooxContext();

  const [ groupRep, setGroupRep ] = useState<string>('0');
  const [ idHash, setIdHash ] = useState<HexType>(Bytes32Zero);

  const {
    isLoading: regInvestorLoading,
    write:regInvestor,
  } = useGeneralKeeperRegInvestor({
    address: gk,
    args: [ BigInt(groupRep), 
            idHash
          ],
    onSuccess() {
      getAllInvestors();
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
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={ e => setGroupRep(e.target.value ?? '0') }
          value={ groupRep } 
        />

        <TextField
          variant='outlined'
          label='IdentityInfoHash'
          size="small"
          sx={{
            m:1,
            minWidth: 685,
          }}
          value={ idHash }
          onChange={(e)=>setIdHash(HexParser( e.target.value ))}
        />

        <Button 
          disabled = { regInvestorLoading }

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