import { useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  Box,
} from "@mui/material";

import { ShaRuleInputProps } from "../../../../interfaces";

import {
  AddCircle,
  RemoveCircle,
} from "@mui/icons-material"

import { 
  SetFirstRefusalRule, 
} from '../../..';
import { FirstRefusalRuleWrap } from "./SetFirstRefusalRule";

export function FirstRefusalRules({sha, seqList, finalized}: ShaRuleInputProps) {

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

let defaultRules: {[seq: number]: FirstRefusalRuleWrap} = {
    512 : {
      subTitle: '- For Capital Increase ',
      rule: {
        seqOfRule: 512, 
        qtyOfSubRule: 2, 
        seqOfSubRule: 1,
        typeOfDeal: 1,
        membersEqual: true,
        proRata: true,
        basedOnPar: false,
        rightholders: [0,0,0,0],
        para: 0,
        argu: 0,
      },
    },
    513 : {
      subTitle: '- For External Transfer ',
      rule: {
        seqOfRule: 513, 
        qtyOfSubRule: 2, 
        seqOfSubRule: 2,
        typeOfDeal: 2,
        membersEqual: true,
        proRata: true,
        basedOnPar: false,
        rightholders: [0,0,0,0],
        para: 0,
        argu: 0,
      },
    },
  }

  return (
    <Paper sx={{ m:1 , p:1, border: 1, borderColor:'divider' }}>

      <Box sx={{ width:1680 }}>

        <Stack direction={'row'} sx={{ alignItems:'center' }}>
          <Toolbar>
            <h4>First Refusal Rules</h4>
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
              <IconButton
                disabled={ cp.length < 2 } 
                sx={{width: 20, height: 20, m: 1, p: 1, }} 
                onClick={ removeCp }
                color="primary"
              >
                <RemoveCircle/>
              </IconButton>
            </>
          )}

        </Stack>

        {cp.map((v)=> (
          <SetFirstRefusalRule key={ v } sha={ sha } defaultRule={ defaultRules[v] } seq={ v } finalized={ finalized } />
        ))}

      </Box>

    </Paper>
  );
} 

