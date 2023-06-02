import { useState } from "react";
import { HexType } from "../../../../interfaces";
import { Box, IconButton, Paper, Stack, Toolbar } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { SetDeal } from "./SetDeal";
import { SetTypeOfIa } from "./SetTypeOfIa";

interface DealsProps{
  ia: HexType,
  seqList: number[],
  finalized: boolean,
}

export function Deals({ia, seqList, finalized}: DealsProps) {

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

  return(
    <Paper sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
      <Box sx={{ width:1680 }}>

        <Stack direction={'row'} sx={{ alignItems:'center' }}>
          <Toolbar>
            <h4>Deals</h4>
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
              <IconButton sx={{width: 20, height: 20, m: 1, mr:40, p: 1, }} 
                onClick={ removeCp }
                color="primary"
              >
                <RemoveCircle/>
              </IconButton>

              <SetTypeOfIa  ia={ia} finalized={ finalized } />
            </>
          )}

        </Stack>

        {cp.map((v)=> (
          <SetDeal key={ v } ia={ ia } seq={ v } finalized={ finalized } />
        ))}

      </Box>
    </Paper>
  );

}
