import { useEffect, useState } from "react";

import { 
  Box,
  Divider,
  Grid,
  Paper,
  Stack,
  Toolbar,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { AntiDilution } from "../terms/AntiDilution/AntiDilution";

import { defaultTerms, getTerm, obtainRules, obtainTitles } from "../../../../queries/sha";
import { SetGovernanceRule } from "../rules/SetGovernanceRule";
import { VotingRules } from "../rules/VotingRules";
import { PositionAllocateRules } from "../rules/PositionAllocateRules";
import { FirstRefusalRules } from "../rules/FirstRefusalRules";
import { GroupUpdateOrders } from "../rules/GroupUpdateOrders";
import { LockUp } from "../terms/LockUp/LockUp";

export async function getGroupOfRules(addr: HexType): Promise<number[][]>{

  let arrRules = await obtainRules(addr);

  let rules:number[][] = Array.from(Array(4), ()=>new Array<number>());

  arrRules.forEach( v => {
    if (v > 0) {
      if (v < 256) rules[0].push(v);
      else if (v < 512) rules[1].push(v);
      else if (v < 768) rules[2].push(v);
      else if (v < 1024) rules[3].push(v);     
    }
  })

  // console.log('rules before return: ', rules);
  return rules;
}

interface ShaBodyTermsProps {
  sha: HexType;
  isFinalized: boolean;
}

export function ShaBodyTerms({sha, isFinalized}: ShaBodyTermsProps) {

  const [ vrLs, setVrLs ] = useState<number[]>();
  const [ prLs, setPrLs ] = useState<number[]>();
  const [ frLs, setFrLs ] = useState<number[]>();
  const [ guoLs, setGuoLs ] = useState<number[]>();

  useEffect(()=>{
    const setUpRules = async () => {
      // console.log('enter time: ', new Date().getTime())
      
      let rules = await getGroupOfRules(sha);

      setVrLs(rules[0]);
      setPrLs(rules[1]);
      setFrLs(rules[2]);
      setGuoLs(rules[3]);

      // console.log('rules in Effect: ', rules);

      // console.log('exit time: ', new Date().getTime())
    }
    setUpRules();
  }, [sha]);

  const [ terms, setTerms ] = useState<HexType[]>(defaultTerms);

  useEffect(()=>{
    const getTitles = async () => {
      let titles = await obtainTitles(sha);
      titles.forEach(async (v, i) => {
        let res: HexType = await getTerm(sha, v);
        setTerms(k => {
          let out = [...k];
          out[i] = res;
          return out;
        });
      });
    }
    getTitles();
  }, [sha]);

  return (
    // <Box width={1180} >
      <Stack direction={'row'} justifyContent='center' >

        <Stack direction="column"  >
          <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider' }} >
            <Toolbar sx={{ textDecoration:'underline' }} >
              <h4>Rules</h4>
            </Toolbar>

            <Divider />

            <Stack direction="row" sx={{m:1, p:1, alignItems:'center'}}>
              <SetGovernanceRule addr={ sha } isFinalized={ isFinalized } />
              <VotingRules sha={ sha } initSeqList={ vrLs } isFinalized={ isFinalized } />
            </Stack>
            <Stack direction="row" sx={{m:1, p:1, alignItems:'center'}}>
              <PositionAllocateRules sha={ sha } initSeqList={ prLs } isFinalized={ isFinalized } />
              <FirstRefusalRules sha={ sha } initSeqList={ frLs } isFinalized={ isFinalized } />
            </Stack>
            <Stack direction="row" sx={{m:1, p:1, alignItems:'center'}}>
              {(!isFinalized || (isFinalized && guoLs)) && (<GroupUpdateOrders sha={ sha } initSeqList={ guoLs } isFinalized={isFinalized} />)}
            </Stack>

          </Paper>
        </Stack>

        <Stack direction="column" >
          <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider' }} >

            <Toolbar sx={{ textDecoration:'underline' }}>
              <h4>Terms</h4>
            </Toolbar>

            <Divider />

            <Stack direction="row" sx={{m:1, p:1, alignItems:'center'}}>          
              <AntiDilution sha={ sha } term={ terms[0] } setTerms={ setTerms } isFinalized={isFinalized} />
              <LockUp sha={ sha } term={ terms[2] } setTerms={ setTerms } isFinalized={isFinalized} />
            </Stack>

          </Paper>
        </Stack>

      </Stack>    
    // </Box>
  );
} 