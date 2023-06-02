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

export function VotingRules({sha, seqList, finalized}: ShaRuleInputProps) {

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
      subTitle: '- Issue New Share (i.e. Capital Increase "CI")',
      seqOfRule: 1, 
      qtyOfSubRule: 12, 
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
      subTitle: '- Transfer Share to External Invester (i.e. External Transfer "EXT")',
      seqOfRule: 2, 
      qtyOfSubRule: 12, 
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
      subTitle: '- Transfer Share to Other Shareholders (i.e. Internal Transfer "INT")',
      seqOfRule: 3, 
      qtyOfSubRule: 12, 
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
      subTitle: '- Capital Increase and Internal Transfer (i.e. CI & INT)',
      seqOfRule: 4, 
      qtyOfSubRule: 12, 
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
      subTitle: '- Internal and External Transfer (i.e. EXT & INT)',
      seqOfRule: 5, 
      qtyOfSubRule: 12, 
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
      subTitle: '- Capital Increase, External Transfer and Internal Transfer (i.e. CI & EXT & INT)',
      seqOfRule: 6, 
      qtyOfSubRule: 12, 
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
      subTitle: '- Capital Increase and External Transfer (i.e. CI & EXT) ',
      seqOfRule: 7, 
      qtyOfSubRule: 12, 
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
      subTitle: "- Approve Shareholders' Agreement",
      seqOfRule: 8, 
      qtyOfSubRule: 12, 
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
      subTitle: '- Ordinary resolution of Shareholders Meeting',
      seqOfRule: 9, 
      qtyOfSubRule: 12, 
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
      subTitle: '- Special resolution of Shareholders Meeting',
      seqOfRule: 10, 
      qtyOfSubRule: 12, 
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
    11: {
      subTitle: '- Ordinary resolution of Board Meeting',
      seqOfRule: 11, 
      qtyOfSubRule: 12, 
      seqOfSubRule: 11,
      authority: 2,
      headRatio: 5000,
      amountRatio: 0,
      onlyAttendance: true,
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
    12: {
      subTitle: '- Special resolution of Board Meeting',
      seqOfRule: 12, 
      qtyOfSubRule: 12, 
      seqOfSubRule: 12,
      authority: 2,
      headRatio: 6667,
      amountRatio: 0,
      onlyAttendance: true,
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
      <Box sx={{ width:1680 }}>

        <Stack direction={'row'} sx={{ alignItems:'center' }}>
          <Toolbar>
            <h4>Voting Rules</h4>
          </Toolbar>

          {!finalized && (
            <>
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
            </>
          )}

        </Stack>

        {cp.map((v)=> (
          <SetVotingRule key={ v } sha={ sha } defaultRule={ defaultRules[v] } seq={ v } finalized={ finalized } />
        ))}

      </Box>
    </Paper>
  );
} 

