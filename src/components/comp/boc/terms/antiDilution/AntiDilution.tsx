import { Dispatch, SetStateAction, useState } from "react";

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

import { AddrZero, HexType } from "../../../../../interfaces";

import {
  AddCircle,
  RemoveCircle,
  PlaylistAdd,
  Delete,
  ListAlt,
} from "@mui/icons-material"

import { waitForTransaction, readContract } from "@wagmi/core";

import {
  antiDilutionABI,
  useShareholdersAgreementCreateTerm,
  useShareholdersAgreementRemoveTerm,
  useAntiDilutionGetClasses, 
  useAntiDilutionAddBenchmark,
  useAntiDilutionRemoveBenchmark,
  useAntiDilutionAddObligor,
  useAntiDilutionRemoveObligor, 
} from "../../../../../generated";


import { Benchmark } from "./Benchmark";
import { splitStrArr } from "../../../../../scripts/toolsKit";
import { getDocAddr } from "../../../../../queries/rc";


interface BenchmarkType {
  classOfShare: string,
  floorPrice: string,
  obligors: string,
}

async function getBenchmarks(ad: HexType, classes: number[]): Promise<BenchmarkType[]> {
  let len = classes.length;
  let output: BenchmarkType[] = [];

  while (len > 0) {

    let classOfShare = classes[len - 1];

    let floorPrice = await readContract({
      address: ad,
      abi: antiDilutionABI,
      functionName: 'getFloorPriceOfClass',
      args: [BigInt(classOfShare)],
    });

    let obligors = await readContract({
      address: ad,
      abi: antiDilutionABI,
      functionName: 'getObligorsOfAD',
      args: [BigInt(classOfShare)],
    });
    
    let strObligors = '';

    obligors.map(v => {
      strObligors += v.toString() + `\n`;
    });

    let item: BenchmarkType = {
      classOfShare: classOfShare.toString(),
      floorPrice: floorPrice.toString(),
      obligors: strObligors,
    }

    output.push(item);
    // console.log('item: ', item);

    len--;
  }

  return output;
}

export interface SetShaTermProps {
  sha: HexType,
  term: HexType,
  setTerms: Dispatch<SetStateAction<HexType[]>> ,
  isFinalized: boolean,
}

export function AntiDilution({ sha, term, setTerms, isFinalized }: SetShaTermProps) {

  const [ version, setVersion ] = useState<string>('1');

  const {
    data: createAdReceipt,
    isLoading: createAdIsLoading,
    write: createAd,
  } = useShareholdersAgreementCreateTerm({
    address: sha,
    args: version ? 
      [BigInt('24'), BigInt(version)]: 
      undefined,
    onSuccess(data:any) {
      getDocAddr(data.hash).
        then(addrOfAd => setTerms(v => {
          let out = [...v];
          out[0] = addrOfAd;
          return out;
        }));      
    }
  });

  const {
    isLoading: removeAdIsLoading,
    write: removeAd,
  } = useShareholdersAgreementRemoveTerm({
    address: sha,
    args: [BigInt('24')],
    onSuccess() {
      setTerms(v=>{
        let out = [...v];
        out[0] = AddrZero;
        return out;
      });
    }
  });

  const [ newMarks, setNewMarks ] = useState<BenchmarkType[]>();

  const { refetch } = useAntiDilutionGetClasses({
    address: term,
    onSuccess(data) {
      let ls: number[] = [];
      data.map(v => {
        ls.push(Number(v))
      })
      if (term)
        getBenchmarks(term, ls).
          then(marks => setNewMarks(marks));  
    }
  });

  const [ classOfShare, setClassOfShare ] = useState<string>();
  const [ price, setPrice ] = useState<string>();

  const { 
    data: addMarkReceipt,
    isLoading: addMarkIsLoading,
    write: addMark 
  } = useAntiDilutionAddBenchmark({
    address: term,
    args: classOfShare && 
          price ? 
            [BigInt(classOfShare), BigInt(price)] :
            undefined, 
    onSuccess() {
      refetch();
    }
  });

  const { 
    data: removeMarkReceipt,
    isLoading: removeMarkIsLoading, 
    write: removeMark 
  } = useAntiDilutionRemoveBenchmark({
    address: term,
    args: classOfShare ? 
            [BigInt(classOfShare)] :
            undefined, 
    onSuccess() {
      refetch();
    }
  });

  const [ obligor, setObligor ] = useState<string>();

  const { 
    data: addObligorReceipt,
    isLoading: addObligorIsLoading, 
    write: addObligor 
  } = useAntiDilutionAddObligor({
    address: term,
    args: classOfShare &&
          obligor ? 
            [ BigInt(classOfShare),
              BigInt(obligor)] :
            undefined, 
    onSuccess() {
      refetch();
    }
  });

  const { 
    data: removeObligorReceipt,
    isLoading: removeObligorIsLoading, 
    write: removeObligor 
  } = useAntiDilutionRemoveObligor({
    address: term,
    args: classOfShare &&
          obligor ? 
            [ BigInt(classOfShare),
              BigInt(obligor)] :
            undefined, 
    onSuccess() {
      refetch();
    }
  });

  const [ open, setOpen ] = useState(false);

  return (
    <>
      <Button
        disabled={ isFinalized && !term }
        variant="outlined"
        startIcon={<ListAlt />}
        // fullWidth={true}
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

                <Stack direction={'row'} sx={{ alignItems:'center' }}>
                  <Toolbar>
                    <h4>AntiDilution (Addr: {term} )</h4>
                  </Toolbar>

                  {term == AddrZero && !isFinalized && (
                    <>
                      <TextField 
                        variant='filled'
                        label='Version'
                        sx={{
                          m:1,
                          ml:3,
                          minWidth: 218,
                        }}
                        onChange={(e) => setVersion(e.target.value)}
                        value={ version }              
                      />

                      <Button
                        disabled={ createAdIsLoading }
                        variant="contained"
                        sx={{
                          height: 40,
                        }}
                        endIcon={ <PlaylistAdd /> }
                        onClick={() => createAd?.()}
                      >
                        Create
                      </Button>

                    </>
                  )}

                  {term != AddrZero && !isFinalized && (
                      <Button
                        disabled={ removeAdIsLoading }
                        variant="contained"
                        sx={{
                          height: 40,
                          mr: 5,
                        }}
                        endIcon={ <Delete /> }
                        onClick={() => removeAd?.()}
                      >
                        Remove
                      </Button>
                  )}

                </Stack>

                {term && !isFinalized && (
                  <Stack direction={'row'} sx={{ alignItems:'center' }}>      

                    <Tooltip
                      title='Add Benchmark'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addMarkIsLoading }
                        sx={{width: 20, height: 20, m: 1, ml: 5 }} 
                        onClick={ () => addMark?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>
                    </Tooltip>

                    <TextField 
                      variant='filled'
                      label='ClassOfShare'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setClassOfShare(e.target.value)}
                      value={ classOfShare }              
                    />

                    <TextField 
                      variant='filled'
                      label='Price'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setPrice(e.target.value)}
                      value={ price }
                    />

                    <Tooltip
                      title='Remove Benchmark'
                      placement="top-end"
                      arrow
                    >           
                      <IconButton
                        disabled={ removeMarkIsLoading } 
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
                        disabled={ addObligorIsLoading }
                        sx={{width: 20, height: 20, m: 1, ml: 10,}} 
                        onClick={ () => addObligor?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>

                    </Tooltip>

                    <TextField 
                      variant='filled'
                      label='Obligor'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setObligor(e.target.value)}
                      value={ obligor }              
                    />

                    <Tooltip
                      title='Remove Obligor'
                      placement="top-end"
                      arrow
                    >

                      <IconButton
                        disabled={ removeObligorIsLoading } 
                        sx={{width: 20, height: 20, m: 1, mr: 10}} 
                        onClick={ () => removeObligor?.() }
                        color="primary"
                      >
                        <RemoveCircle/>
                      </IconButton>
                    
                    </Tooltip>

                  </Stack>
                )}
                
                {term && newMarks?.map((v) => (
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
            <Button onClick={()=>setOpen(false)}>Close</Button>
          </DialogActions>

      </Dialog>
  
    </>
  );
} 

