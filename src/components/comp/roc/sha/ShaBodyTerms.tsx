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
import { DragAlong } from "../terms/DragAlong/DragAlong";
import { Options } from "../terms/Options/Options";
import { TagAlong } from "../terms/TagAlong/TagAlong";
import { useShareholdersAgreement, useShareholdersAgreementGetRules, useShareholdersAgreementGetTitles } from "../../../../generated";

export async function groupingRules(bigRules: readonly bigint[]): Promise<number[][]>{

  let arrRules = bigRules.map(v => Number(v));
  // console.log('arrRules: ', arrRules);

  let rules:number[][] = Array.from(Array(5), ()=>new Array<number>());

  arrRules.forEach( v => {
      if (v == 0) rules[0].push(v);
      else if (v < 256) rules[1].push(v);
      else if (v < 512) rules[2].push(v);
      else if (v < 768) rules[3].push(v);
      else if (v < 1024) rules[4].push(v);
  })

  // console.log('rules: ', rules);
  return rules;
}

interface ShaBodyTermsProps {
  sha: HexType;
  isFinalized: boolean;
}

export function ShaBodyTerms({sha, isFinalized}: ShaBodyTermsProps) {

  const [ grLs, setGrLs ] = useState<number[]>();
  const [ vrLs, setVrLs ] = useState<number[]>();
  const [ prLs, setPrLs ] = useState<number[]>();
  const [ frLs, setFrLs ] = useState<number[]>();
  const [ guoLs, setGuoLs ] = useState<number[]>();


  const {
    refetch: getRules
  } = useShareholdersAgreementGetRules({
    address: sha,
    onSuccess(res) {
      // console.log('sha: ', sha);
      // console.log('res: ', res);

      groupingRules(res).then(
        rules => {
          setGrLs(rules[0]);
          setVrLs(rules[1]);
          setPrLs(rules[2]);
          setFrLs(rules[3]);
          setGuoLs(rules[4]);

          // console.log('rules: ', rules);
        }
      )
    }
  })


  // useEffect(()=>{
  //   const setUpRules = async () => {

  //     let rules = await getGroupOfRules(sha);

  //     setVrLs(rules[0]);
  //     setPrLs(rules[1]);
  //     setFrLs(rules[2]);
  //     setGuoLs(rules[3]);
  //   }
    
  //   setUpRules();
  // }, [sha]);

  const [ terms, setTerms ] = useState<HexType[]>(defaultTerms);


  const {
    refetch: getTitles
  } = useShareholdersAgreementGetTitles({
    address: sha,
    onSuccess(res) {
      let titles = res.map(v=>Number(v));
      titles.forEach(async v => {
        let term = await getTerm(sha, v);
        setTerms(k => {
          let out = [...k];
          out[v-24] = term;
          return out;
        })
      })
    }
  })


  // useEffect(()=>{
  //   const getTitles = async () => {
  //     let titles = await obtainTitles(sha);
  //     titles.forEach(async v => {
  //       let res = await getTerm(sha, v);
  //       setTerms((k) => {          
  //         let out = [...k];
  //         out[v-24] = res;
  //         return out;
  //       });
  //     });
  //   }
  //   getTitles();
  // }, [sha]);

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
              <SetGovernanceRule sha={ sha } initSeqList={ grLs } isFinalized={ isFinalized } getRules={ getRules } />
              <VotingRules sha={ sha } initSeqList={ vrLs } isFinalized={ isFinalized } getRules={ getRules } />
            </Stack>
            <Stack direction="row" sx={{m:1, p:1, alignItems:'center'}}>
              <PositionAllocateRules sha={ sha } initSeqList={ prLs } isFinalized={ isFinalized } getRules={ getRules } />
              <FirstRefusalRules sha={ sha } initSeqList={ frLs } isFinalized={ isFinalized } getRules={ getRules } />
            </Stack>
            <Stack direction="row" sx={{m:1, p:1, alignItems:'center'}}>
              {(!isFinalized || (isFinalized && guoLs)) && (<GroupUpdateOrders sha={ sha } initSeqList={ guoLs } isFinalized={isFinalized} getRules={ getRules } />)}
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
            <Stack direction="row" sx={{m:1, p:1, alignItems:'center'}}>          
              <DragAlong sha={ sha } term={ terms[1] } setTerms={ setTerms } isFinalized={isFinalized} />
              <TagAlong sha={ sha } term={ terms[4] } setTerms={ setTerms } isFinalized={isFinalized} />
            </Stack>
            <Stack direction="row" sx={{m:1, p:1, alignItems:'center'}}>                      
              <Options sha={ sha } term={ terms[3] } setTerms={ setTerms } isFinalized={isFinalized} />
            </Stack>

          </Paper>
        </Stack>

      </Stack>    
    // </Box>
  );
} 