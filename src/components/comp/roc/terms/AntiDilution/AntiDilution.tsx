import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  TextField,
  Button,
  Tooltip,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { AddrZero, HexType, MaxPrice, MaxSeqNo, MaxUserNo } from "../../../../../scripts/common";

import {
  AddCircle,
  RemoveCircle,
  ListAlt,
} from "@mui/icons-material"

import {
  useAntiDilutionAddBenchmark,
  useAntiDilutionRemoveBenchmark,
  useAntiDilutionAddObligor,
  useAntiDilutionRemoveObligor,
} from "../../../../../generated";


import { Benchmark } from "../Alongs/Benchmark";
import { AddTerm } from "../AddTerm";
import { CopyLongStrSpan } from "../../../../common/utils/CopyLongStr";
import { BenchmarkType, getBenchmarks } from "../../../../../scripts/comp/ad";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../../scripts/common/toolsKit";

export interface SetShaTermProps {
  sha: HexType,
  term: HexType,
  setTerms: Dispatch<SetStateAction<HexType[]>> ,
  isFinalized: boolean,
}

export function AntiDilution({ sha, term, setTerms, isFinalized }: SetShaTermProps) {

  const [ newMarks, setNewMarks ] = useState<BenchmarkType[]>();

  const [ classOfShare, setClassOfShare ] = useState<string>();
  const [ price, setPrice ] = useState<string>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ time, setTime ] = useState<number>(0);
  const [ loading, setLoading ] = useState(false);

  const refresh = ()=> {
    setTime(Date.now());
    setLoading(false);
  }

  const { 
    isLoading: addMarkLoading,
    write: addMark 
  } = useAntiDilutionAddBenchmark({
    address: term,
    args: classOfShare && price && !hasError(valid)
        ? [BigInt(classOfShare), BigInt(price)] 
        : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const { 
    isLoading: removeMarkIsLoading, 
    write: removeMark 
  } = useAntiDilutionRemoveBenchmark({
    address: term,
    args: classOfShare && !hasError(valid) 
        ? [BigInt(classOfShare)] 
        :  undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    },    
  });

  const [ obligor, setObligor ] = useState<string>();

  const { 
    isLoading: addObligorIsLoading, 
    write: addObligor 
  } = useAntiDilutionAddObligor({
    address: term,
    args: classOfShare && obligor && !hasError(valid)
        ? [ BigInt(classOfShare), BigInt(obligor)] 
        :   undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    },    
  });
    
  const { 
    isLoading: removeObligorIsLoading, 
    write: removeObligor 
  } = useAntiDilutionRemoveObligor({
    address: term,
    args: classOfShare && obligor && !hasError(valid)
        ? [ BigInt(classOfShare), BigInt(obligor)] 
        :   undefined, 
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    },    
  });
    
  useEffect(()=>{
    getBenchmarks(term).then(
      res => setNewMarks(res)
    );
  }, [term, time]);

  const [ open, setOpen ] = useState(false);

  return (
    <>
      <Button
        disabled={ isFinalized && !term }
        variant={term != AddrZero ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Anti-Dilution 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >

        <DialogContent>

          <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
            <Box sx={{ width:1180 }}>

              <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'space-between' }}>
                <Stack direction={'row'} >
                  <Toolbar sx={{ textDecoration:'underline' }}>
                    <h3>Anti Dilution</h3>
                  </Toolbar>

                  <CopyLongStrSpan title="Addr"  src={term.toLowerCase()} />
                </Stack>
                {!isFinalized && (
                  <AddTerm sha={ sha } title={ 1 } setTerms={ setTerms } isCreated={ term != AddrZero }  />
                )}


              </Stack>

              {term != AddrZero && !isFinalized && (
                <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

                  <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'space-between' }}>      

                    <Tooltip
                      title='Add Benchmark'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addMarkLoading || hasError(valid) || loading}
                        sx={{width: 20, height: 20, m: 1, ml: 5 }} 
                        onClick={ () => addMark?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>
                    </Tooltip>

                    <TextField 
                      variant='outlined'
                      label='ClassOfShare'
                      size="small"
                      error={ valid['ClassOfShare']?.error }
                      helperText={ valid['ClassOfShare']?.helpTx }
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => {
                        let input = e.target.value;
                        onlyNum('ClassOfShare', input, MaxSeqNo, setValid);
                        setClassOfShare(input);
                      }}
                      value={ classOfShare }              
                    />

                    <TextField 
                      variant='outlined'
                      label='Price'
                      size="small"
                      error={ valid['Price']?.error }
                      helperText={ valid['Price']?.helpTx }
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => {
                        let input = e.target.value;
                        onlyNum('Price', input, MaxPrice, setValid);
                        setPrice(input);
                      }}
                      value={ price }
                    />

                    <Tooltip
                      title='Remove Benchmark'
                      placement="top-end"
                      arrow
                    >           
                      <IconButton
                        disabled={ removeMarkIsLoading || hasError(valid) || loading} 
                        sx={{width: 20, height: 20, m: 1, mr: 10, }} 
                        onClick={ () => removeMark?.() }
                        color="primary"
                      >
                        <RemoveCircle/>
                      </IconButton>
                    </Tooltip>

                    <Tooltip
                      title='Add Obligor'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addObligorIsLoading || loading}
                        sx={{width: 20, height: 20, m: 1, ml: 10,}} 
                        onClick={ () => addObligor?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>

                    </Tooltip>

                    <TextField 
                      variant='outlined'
                      label='Obligor'
                      size="small"
                      error={ valid['Obligor']?.error }
                      helperText={ valid['Obligor']?.helpTx }
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => {
                        let input = e.target.value;
                        onlyNum('Obligor', input, MaxUserNo, setValid);
                        setObligor(input);
                      }}
                      value={ obligor }              
                    />

                    <Tooltip
                      title='Remove Obligor'
                      placement="top-end"
                      arrow
                    >

                      <IconButton
                        disabled={ removeObligorIsLoading || hasError(valid) || loading} 
                        sx={{width: 20, height: 20, m: 1, mr: 10}} 
                        onClick={ () => removeObligor?.() }
                        color="primary"
                      >
                        <RemoveCircle/>
                      </IconButton>
                    
                    </Tooltip>

                  </Stack>
                
                </Paper>
              )}
              
              {term != AddrZero && newMarks?.map((v) => (
                <Benchmark 
                  key={v.classOfShare} 
                  classOfShare={v.classOfShare}
                  floorPrice={v.floorPrice}
                  obligors={v.obligors} 
                />
              ))}

            </Box>
          </Paper>

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>
  
    </>
  );
} 

