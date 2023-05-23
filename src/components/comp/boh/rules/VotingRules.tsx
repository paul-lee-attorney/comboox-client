import { useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  Box,
} from "@mui/material";

import { ShaRuleInputProps, VotingRuleType } from "../../../../interfaces";

import {
  AddCircle,
  RemoveCircle,
} from "@mui/icons-material"

import { 
  SetVotingRule, 
} from '../../..';

export function VotingRules({sha, seqList}: ShaRuleInputProps) {

  const [ cp, setCp ] = useState(seqList);

  const addCp = () => {
    setCp(v => {
      let arr = [...v];
      arr.push(v[v.length-1] + 1);      
      return arr;
    })
  }

  const removeCp = () => {
    setCp(v => {
      let arr = [...v];
      arr.pop();      
      return arr;
    })
  }

  let defaultRules: {[seq: number]: VotingRuleType} = {
    1 : {
      seqOfRule: 1, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 1,
      authority: 1,
      headRatio: 0,
      amountRatio: 6667,
      onlyAttendance: false,
      impliedConsent: false,
      partyAsConsent: true,
      againstShallBuy: false,
      shaExecDays: 15,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },

    2 : {
      seqOfRule: 2, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 2,
      authority: 1,
      headRatio: 0,
      amountRatio: 5000,
      onlyAttendance: false,
      impliedConsent: true,
      partyAsConsent: false,
      againstShallBuy: true,
      shaExecDays: 15,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },
    
    3: {
      seqOfRule: 3, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 3,
      authority: 1,
      headRatio: 0,
      amountRatio: 0,
      onlyAttendance: false,
      impliedConsent: false,
      partyAsConsent: false,
      againstShallBuy: false,
      shaExecDays: 0,
      reviewDays: 0,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 0,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },

    4: {
      seqOfRule: 4, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 4,
      authority: 1,
      headRatio: 0,
      amountRatio: 6667,
      onlyAttendance: false,
      impliedConsent: false,
      partyAsConsent: true,
      againstShallBuy: false,
      shaExecDays: 15,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },

    5: {
      seqOfRule: 5, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 5,
      authority: 1,
      headRatio: 0,
      amountRatio: 5000,
      onlyAttendance: false,
      impliedConsent: true,
      partyAsConsent: false,
      againstShallBuy: true,
      shaExecDays: 15,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },

    6: {
      seqOfRule: 6, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 6,
      authority: 1,
      headRatio: 0,
      amountRatio: 6667,
      onlyAttendance: false,
      impliedConsent: false,
      partyAsConsent: true,
      againstShallBuy: false,
      shaExecDays: 15,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },

    7: {
      seqOfRule: 7, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 7,
      authority: 1,
      headRatio: 0,
      amountRatio: 6667,
      onlyAttendance: false,
      impliedConsent: false,
      partyAsConsent: true,
      againstShallBuy: false,
      shaExecDays: 15,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },

    8: {
      seqOfRule: 8, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 8,
      authority: 1,
      headRatio: 0,
      amountRatio: 6667,
      onlyAttendance: false,
      impliedConsent: false,
      partyAsConsent: true,
      againstShallBuy: false,
      shaExecDays: 0,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },

    9: {
      seqOfRule: 9, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 9,
      authority: 1,
      headRatio: 0,
      amountRatio: 5000,
      onlyAttendance: false,
      impliedConsent: false,
      partyAsConsent: false,
      againstShallBuy: false,
      shaExecDays: 0,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },

    10: {
      seqOfRule: 10, 
      qtyOfSubRule: 10, 
      seqOfSubRule: 10,
      authority: 1,
      headRatio: 0,
      amountRatio: 6667,
      onlyAttendance: false,
      impliedConsent: false,
      partyAsConsent: false,
      againstShallBuy: false,
      shaExecDays: 0,
      reviewDays: 15,
      reconsiderDays: 0,
      votePrepareDays: 0,
      votingDays: 1,
      execDaysForPutOpt: 0,
      vetoers1: 0,
      vetoers2: 0,
    },    
  }

  return (
    <Paper sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
      <Box sx={{ width:1440 }}>

        <Stack direction={'row'} sx={{ alignItems:'center' }}>
          <Toolbar>
            <h4>Voting Rules</h4>
          </Toolbar>
          <IconButton 
            sx={{width: 20, height: 20, m: 1, p: 1}} 
            onClick={ addCp }
            color="primary"
          >
            <AddCircle/>
          </IconButton>
          <IconButton sx={{width: 20, height: 20, m: 1, p: 1, }} 
            onClick={ removeCp }
            color="primary"
          >
            <RemoveCircle/>
          </IconButton>
        </Stack>

        {cp.map((v)=> (
          <SetVotingRule key={ v } sha={ sha } defaultRule={ defaultRules[v] } seq={ v } />
        ))}

      </Box>
    </Paper>
  );
} 

