import { useState } from "react";

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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { AddrZero, HexType } from "../../../../../interfaces";

import {
  AddCircle,
  RemoveCircle,
  ListAlt,
} from "@mui/icons-material"

import { readContract } from "@wagmi/core";

import {
  useOptionsGetAllOptions,
  useOptionsCreateOption,
  useOptionsDelOption,
  useOptionsAddObligorIntoOpt,
  useOptionsRemoveObligorFromOpt,
  optionsABI, 
} from "../../../../../generated";

import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Opt } from "./Opt";
import { SetShaTermProps } from "../AntiDilution/AntiDilution";
import { AddTerm } from "../AddTerm";
import { CopyLongStrSpan } from "../../../../common/utils/CopyLongStr";
import { BodyOfOpt, Cond, HeadOfOpt, OptWrap, Option, comOps, condCodifier, defaultBodyOfOpt, defaultCond, defaultHeadOfOpt, logOps, optHeadCodifier, typeOfOpts } from "../../../../../queries/roo";

// ==== HeadOfOpt ====


export async function getObligorsFromTerm(term:HexType, seqOfOpt: number):Promise<number[]>{
  let res = await readContract({
    address: term,
    abi: optionsABI,
    functionName: 'getObligorsOfOption',
    args: [ BigInt(seqOfOpt)],
  })

  let out = res.map(v => Number(v));

  return out;
}

async function refreshList(term: HexType, ls: readonly Option[] ): Promise<OptWrap[]>{

  let out:OptWrap[] = [];
  let len = ls.length;

  while(len > 0) {
    let item:OptWrap = {
      opt: ls[len-1],
      obligors: await getObligorsFromTerm(term, ls[len-1].head.seqOfOpt),
    }
    out.push(item);
    len--;
  }

  return out;
}


export function Options({ sha, term, setTerms, isFinalized }: SetShaTermProps) {

  const [ opts, setOpts ] = useState<readonly OptWrap[]>();

  const [ open, setOpen ] = useState(false);

  const {
    refetch:getAllOpts 
  } = useOptionsGetAllOptions({
    address: term,
    onSuccess(ls) {
      if (ls) 
        refreshList(term, ls).then(
          list => setOpts(list)
        );
    }
  });

  const [ head, setHead ] = useState<HeadOfOpt>(defaultHeadOfOpt);
  const [ cond, setCond ] = useState<Cond>(defaultCond);
  const [ body, setBody ] = useState<BodyOfOpt>(defaultBodyOfOpt);

  const { 
    isLoading: addOptLoading,
    write: addOpt
  } = useOptionsCreateOption({
    address: term,
    args: 
        [ 
          optHeadCodifier(head), 
          condCodifier(cond), 
          BigInt(body.rightholder),
          BigInt(body.paid),
          BigInt(body.par)
        ], 
    onSuccess() {
      getAllOpts();
    }
  });

  const { 
    isLoading: removeOptLoading, 
    write: removeOpt, 
  } = useOptionsDelOption({
    address: term,
    args: head.seqOfOpt ? [ BigInt(head.seqOfOpt) ] : undefined, 
    onSuccess() {
      getAllOpts();
    }
  });

  const [ obligor, setObligor ] = useState<string>('0');

  const { 
    isLoading: addObligorLoading, 
    write: addObligor, 
  } = useOptionsAddObligorIntoOpt({
    address: term,
    args: head.seqOfOpt && obligor
      ? [ BigInt(head.seqOfOpt), BigInt(obligor)] 
      : undefined, 
    onSuccess() {
      getAllOpts();
    }
  });

  const { 
    isLoading: removeObligorLoading, 
    write: removeObligor 
  } = useOptionsRemoveObligorFromOpt({
    address: term,
    args: head.seqOfOpt && obligor 
      ? [ BigInt(head.seqOfOpt), BigInt(obligor)] 
      : undefined, 
    onSuccess() {
      getAllOpts();
    }
  });


  return (
    <>
      <Button
        disabled={ isFinalized && !term }
        variant={term != AddrZero ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Put/Call Options 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >

        <DialogContent>

          <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
            <Box sx={{ width:1380 }}>

              <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'space-between' }}>

                <Stack direction='row' >
                  <Toolbar>
                    <h4>Put/Call Options</h4>
                  </Toolbar>

                  <CopyLongStrSpan title="Addr" size="body1" src={term} />
                </Stack>

                {!isFinalized && (
                  <AddTerm sha={ sha } title={ 5 } setTerms={ setTerms } isCreated={ term != AddrZero }  />
                )}

              </Stack>

              {term !=AddrZero && !isFinalized && (
                <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

                  <Stack direction='column' spacing={1} >

                    <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                      <FormControl variant="outlined" sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="optType-label">TypeOfOption</InputLabel>
                        <Select
                          labelId="optType-label"
                          id="optType-select"
                          label="TypeOfOption"
                          size="small"
                          value={ head.typeOfOpt }
                          onChange={(e) => setHead((v) => ({
                            ...v,
                            typeOfOpt: Number(e.target.value),
                          }))}
                        >
                          {typeOfOpts.map((v, i) => (
                            <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                          ))}
                        </Select>
                      </FormControl>

                      <TextField 
                        variant='outlined'
                        label='ClassOfShare'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setHead((v) => ({
                          ...v,
                          classOfShare: parseInt( e.target.value ?? '0'),
                        }))}
                        value={ head.classOfShare }              
                      />

                      <TextField 
                        variant='outlined'
                        label='Paid'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setBody((v) => ({
                          ...v,
                          paid: BigInt(e.target.value ?? '0'),
                        }))}
                        value={ body.paid.toString() }              
                      />

                      <TextField 
                        variant='outlined'
                        label='Par'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setBody((v) => ({
                          ...v,
                          par: BigInt(e.target.value ?? '0'),
                        }))}
                        value={ body.par.toString() }              
                      />

                      <TextField 
                        variant='outlined'
                        label='Rightholder'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setBody((v) => ({
                          ...v,
                          rightholder: parseInt(e.target.value ?? '0'),
                        }))}
                        value={ body.rightholder }              
                      />

                    </Stack>

                    <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                      <TextField 
                        variant='outlined'
                        label='RateOfOption'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setHead((v) => ({
                          ...v,
                          rate: parseInt( e.target.value ?? '0'),
                        }))}
                        value={ head.rate }              
                      />

                      <DateTimeField
                        label='TriggerDate'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }} 
                        value={ dayjs.unix(head.triggerDate) }
                        onChange={(date) => setHead((v) => ({
                          ...v,
                          triggerDate: date ? date.unix() : 0,
                        }))}
                        format='YYYY-MM-DD HH:mm:ss'
                      />

                      <TextField 
                        variant='outlined'
                        label='ExecDays'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setHead((v) => ({
                          ...v,
                          execDays: parseInt(e.target.value ?? '0'),
                        }))}
                        value={ head.execDays }              
                      />

                      <TextField 
                        variant='outlined'
                        label='ClosingDays'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setHead((v) => ({
                          ...v,
                          closingDays: parseInt(e.target.value ?? '0'),
                        }))}
                        value={ head.closingDays }              
                      />

                      <TextField 
                        variant='outlined'
                        label='Obligor'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setHead((v) => ({
                          ...v,
                          obligor: parseInt(e.target.value ?? '0'),
                        }))}
                        value={ head.obligor }              
                      />

                    </Stack>

                    {head.typeOfOpt > 3 && (

                      <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 128 }}>
                          <InputLabel id="logicOperator-label">LogOpr</InputLabel>
                          <Select
                            labelId="logicOperator-label"
                            id="logicOperator-select"
                            size="small"
                            label="LogOpr"
                            value={ cond.logicOpr }
                            onChange={(e) => setCond((v) => ({
                              ...v,
                              logicOpr: Number(e.target.value),
                            }))}
                          >
                            {logOps.map((v, i) => (
                              <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                            ))}
                          </Select>
                        </FormControl>
                    
                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 128 }}>
                          <InputLabel id="compOpr1-label">CompOpr_1</InputLabel>
                          <Select
                            labelId="compOpr1-label"
                            id="compOpr1-select"
                            size="small"
                            label="CompOpr_1"
                            value={ cond.compOpr1 }
                            onChange={(e) => setCond((v) => ({
                              ...v,
                              compOpr1: Number(e.target.value),
                            }))}
                          >
                            {comOps.map((v, i) => (
                              <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                            ))}
                          </Select>
                        </FormControl>

                        <TextField 
                          variant='outlined'
                          label='Parameter_1'
                          size="small"
                          sx={{
                            m:1,
                            minWidth: 218,
                          }}
                          onChange={(e) => setCond((v) => ({
                            ...v,
                            para1: BigInt(e.target.value ?? '0'),
                          }))}
                          value={ cond.para1.toString() }
                        />
                      
                      {cond.logicOpr > 0 && (<>

                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 128 }}>
                          <InputLabel id="compOpr2-label">CompOpr_2</InputLabel>
                          <Select
                            labelId="compOpr2-label"
                            id="compOpr2-select"
                            size="small"
                            label="CompOpr_2"
                            value={ cond.compOpr2 }
                            onChange={(e) => setCond((v) => ({
                              ...v,
                              compOpr2: Number(e.target.value),
                            }))}
                          >
                            {comOps.map((v, i) => (
                              <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                            ))}
                          </Select>
                        </FormControl>

                        <TextField 
                          variant='outlined'
                          label='Parameter_2'
                          size="small"
                          sx={{
                            m:1,
                            minWidth: 218,
                          }}
                          onChange={(e) => setCond((v) => ({
                            ...v,
                            para2: BigInt(e.target.value ?? '0'),
                          }))}
                          value={ cond.para2.toString() }              
                        />

                      </>)}

                      {cond.logicOpr > 6 && (<>

                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 128 }}>
                          <InputLabel id="compOpr3-label">CompOpr_3</InputLabel>
                          <Select
                            labelId="compOpr3-label"
                            id="compOpr3-select"
                            size="small"
                            label="CompOpr_3"
                            value={ cond.compOpr3 }
                            onChange={(e) => setCond((v) => ({
                              ...v,
                              compOpr3: Number(e.target.value),
                            }))}
                          >
                            {comOps.map((v, i) => (
                              <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                            ))}
                          </Select>
                        </FormControl>

                        <TextField 
                          variant='outlined'
                          label='Parameter_3'
                          size="small"
                          sx={{
                            m:1,
                            minWidth: 218,
                          }}
                          onChange={(e) => setCond((v) => ({
                            ...v,
                            para3: BigInt(e.target.value ?? '0'),
                          }))}
                          value={ cond.para3.toString() }              
                        />

                      </>)}

                      </Stack>

                    )}

                  </Stack>

                  <Divider sx={{ m:1 }} flexItem />

                  <Stack direction={'row'} sx={{ alignItems:'center' }}>      

                    <Tooltip
                      title='Add Option'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addOptLoading }
                        sx={{width: 20, height: 20, m: 1, ml: 5 }} 
                        onClick={ () => addOpt?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>
                    </Tooltip>

                    <TextField 
                      variant='outlined'
                      label='SeqOfOption'
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setHead(v=>({
                        ...v,
                        seqOfOpt: parseInt(e.target.value ?? '0'),
                      }))}
                      value={ head.seqOfOpt }              
                    />

                    <Tooltip
                      title='Remove Option'
                      placement="top-end"
                      arrow
                    >           
                      <IconButton
                        disabled={ removeOptLoading } 
                        sx={{width: 20, height: 20, m: 1, mr: 10, }} 
                        onClick={ () => removeOpt?.() }
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
                        disabled={ addObligorLoading }
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
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setObligor(e.target.value ?? '0')}
                      value={ obligor }              
                    />

                    <Tooltip
                      title='Remove Obligor'
                      placement="top-end"
                      arrow
                    >

                      <IconButton
                        disabled={ removeObligorLoading } 
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

              {term != AddrZero && opts && opts.length > 0 && opts.map(v => (
                <Opt key={ v.opt.head.seqOfOpt } optWrap={ v } />
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

