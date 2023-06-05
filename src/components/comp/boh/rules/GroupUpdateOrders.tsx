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
  SetFirstRefusalRule, SetGroupUpdateOrder, 
} from '../../..';

export function GroupUpdateOrders({sha, seqList, finalized}: ShaRuleInputProps) {

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

  return (
    <Paper sx={{ m:1 , p:1, border: 1, borderColor:'divider' }}>
      <Box sx={{ width:1680 }}>

        <Stack direction={'row'} sx={{ alignItems:'center' }}>
          <Toolbar>
            <h4>Group Update Orders</h4>
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

        {cp.map((v, _, arr)=> (
          <SetGroupUpdateOrder key={ v } sha={ sha } qty={ arr.length } seq={ v } finalized={finalized} />
        ))}
      
      </Box>
    </Paper>
  );
} 

