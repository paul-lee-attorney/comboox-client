import { Button, Divider, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import {  Approval, PersonAddAlt } from "@mui/icons-material";
import { useState } from "react";
import { useGeneralKeeperApproveInvestor } from "../../../../generated";
import { ActionsOfInvestorProps } from "../ActionsOfInvestor";


export function ApproveInvestor({acct: acct, getAllInvestors: getAllInvestors }: ActionsOfInvestorProps) {
  const { gk } = useComBooxContext();

  const [ userNo, setUserNo ] = useState<string>(acct);
  const [ seqOfLR, setSeqOfLR ] = useState<string>('18');

  const {
    isLoading: approveInvestorLoading,
    write:approveInvestor,
  } = useGeneralKeeperApproveInvestor({
    address: gk,
    args: [ BigInt(userNo), 
            BigInt(seqOfLR)
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
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <TextField 
            variant='outlined'
            size="small"
            label='UserNo'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={ e => setUserNo(e.target.value ?? '0') }
            value={ userNo } 
          />

          <TextField 
            variant='outlined'
            size="small"
            label='SeqOfListingRule'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={ e => setSeqOfLR(e.target.value ?? '0')}
            value={ seqOfLR } 
          />

          <Button 
            disabled = { approveInvestorLoading }

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<PersonAddAlt />}
            onClick={()=> approveInvestor?.()}
            size='small'
          >
            Approve
          </Button>

        </Stack>

    </Paper>

  );  

}