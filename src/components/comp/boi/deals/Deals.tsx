import { useEffect, useState } from "react";
import { HexType } from "../../../../interfaces";
import { Box, IconButton, Paper, Stack, Toolbar } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { SetDeal } from "./SetDeal";
import { SetTypeOfIa } from "./SetTypeOfIa";

interface DealsProps{
  ia: HexType,
  seqList: number[] | undefined,
  isFinalized: boolean,
}

export function Deals({ia, seqList, isFinalized}: DealsProps) {

  const [ cp, setCp ] = useState<number[]>([1]);

  useEffect(()=>{
    if (seqList)
      setCp(v => {
        let setDeals = new Set([...v]);
        seqList.forEach(k => {
          setDeals.add(k)
        });
        let arrDeals = Array.from(setDeals).sort(
          (a, b) => (a-b)
        );
        return arrDeals;
      })
  }, [seqList])

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
    <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
      <Box sx={{ width:'100%' }}>

        <Stack direction={'row'} sx={{ alignItems:'center' }}>
          <Toolbar sx={{ textDecoration:'underline' }}>
            <h4>Deals</h4>
          </Toolbar>

          {!isFinalized && (
            <>
              <IconButton 
                sx={{width: 20, height: 20, m: 1, p: 1}} 
                onClick={ addCp }
                color="primary"
              >
                <AddCircle/>
              </IconButton>
              <IconButton
                disabled={ cp.length <2 } 
                sx={{width: 20, height: 20, m: 1, mr:40, p: 1, }} 
                onClick={ removeCp }
                color="primary"
              >
                <RemoveCircle/>
              </IconButton>

              <SetTypeOfIa ia={ia} isFinalized={ isFinalized } />
            </>
          )}

        </Stack>

        {cp.map((v)=> (
          <SetDeal key={ v } ia={ ia } seq={ v } isFinalized={ isFinalized } />
        ))}

      </Box>
    </Paper>
  );

}
