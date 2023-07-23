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
  PlaylistAdd,
  Delete,
  ListAlt,
  EnhancedEncryption,
} from "@mui/icons-material"

import { readContract } from "@wagmi/core";

import {
  useShareholdersAgreementCreateTerm,
  useShareholdersAgreementRemoveTerm,
  useOptionsGetAllOptions,
  useOptionsCreateOption,
  useOptionsDelOption,
  useOptionsAddObligorIntoOpt,
  useOptionsRemoveObligorFromOpt,
  optionsABI, 
} from "../../../../../generated";


import { getDocAddr } from "../../../../../queries/rc";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Opt } from "./Opt";
import { SetShaTermProps } from "../AntiDilution/AntiDilution";
import { AddTerm } from "../AddTerm";

// ==== HeadOfOpt ====

export interface HeadOfOpt{
  seqOfOpt: number;
  typeOfOpt: number;
  classOfShare: number;
  rate: number;
  issueDate: number;
  triggerDate: number;
  execDays: number;
  closingDays: number;
  obligor: number;
}

export const defaultHeadOfOpt: HeadOfOpt = {
  seqOfOpt: 0,
  typeOfOpt: 0,
  classOfShare: 0,
  rate: 0,
  issueDate: 0,
  triggerDate: 0,
  execDays: 0,
  closingDays: 0,
  obligor: 0,
}

export function optSnParser(sn: HexType): HeadOfOpt {
  let out: HeadOfOpt = {
    seqOfOpt: parseInt(sn.substring(2, 10), 16),
    typeOfOpt: parseInt(sn.substring(10, 12), 16),
    classOfShare: parseInt(sn.substring(12, 16), 16),
    rate: parseInt(sn.substring(16, 24), 16),
    issueDate: parseInt(sn.substring(24, 36), 16),
    triggerDate: parseInt(sn.substring(36, 48), 16),
    execDays: parseInt(sn.substring(48, 52), 16),
    closingDays: parseInt(sn.substring(52, 56), 16),
    obligor: parseInt(sn.substring(56, 66), 16),
  }
  return out;
}

export function optHeadCodifier(head: HeadOfOpt): HexType {
  let out: HexType = `0x${
    head.seqOfOpt.toString(16).padStart(8, '0') +
    head.typeOfOpt.toString(16).padStart(2, '0') +
    head.classOfShare.toString(16).padStart(4, '0') +
    head.rate.toString(16).padStart(8, '0') +
    head.issueDate.toString(16).padStart(12, '0') +
    head.triggerDate.toString(16).padStart(12, '0') +
    head.execDays.toString(16).padStart(4, '0') +
    head.closingDays.toString(16).padStart(4, '0') +
    head.obligor.toString(16).padStart(10, '0')
  }`;
  return out;
}

// ==== BodyOfOpt ====

export interface BodyOfOpt{
  closingDeadline: number;
  rightholder: number;
  paid: bigint;
  par: bigint;
  state: number;
  para: number;
  argu: number;
}

export const defaultBodyOfOpt: BodyOfOpt = {
  closingDeadline: 0,
  rightholder: 0,
  paid: BigInt(0),
  par: BigInt(0),
  state: 0,
  para: 0,
  argu: 0,
}

// ==== Cond ====

export interface Cond {
  seqOfCond: number;
  logicOpr: number;    
  compOpr1: number;    
  para1: bigint;           
  compOpr2: number;    
  para2: bigint;           
  compOpr3: number;    
  para3: bigint;                               
}

export const defaultCond: Cond = {
  seqOfCond: 0,
  logicOpr: 0,    
  compOpr1: 0,    
  para1: BigInt(0),           
  compOpr2: 0,    
  para2: BigInt(0),           
  compOpr3: 0,    
  para3: BigInt(0),                               
}

export function condSnParser(sn: HexType): Cond {
  let out: Cond = {
    seqOfCond: parseInt(sn.substring(2, 10), 16),
    logicOpr: parseInt(sn.substring(10, 12), 16),    
    compOpr1: parseInt(sn.substring(12, 14), 16),    
    para1: BigInt(parseInt(sn.substring(14, 30), 16)),           
    compOpr2: parseInt(sn.substring(30, 32), 16),    
    para2: BigInt(parseInt(sn.substring(32, 48), 16)),           
    compOpr3: parseInt(sn.substring(48, 50), 16),    
    para3: BigInt(parseInt(sn.substring(50, 66), 16)),                               
  }
  return out;
}

export function condCodifier(cond: Cond): HexType {
  let out: HexType = `0x${
    cond.seqOfCond.toString(16).padStart(8, '0') +
    cond.logicOpr.toString(16).padStart(2, '0') +
    cond.compOpr1.toString(16).padStart(2, '0') +
    cond.para1.toString(16).padStart(16, '0') +
    cond.compOpr2.toString(16).padStart(2, '0') +
    cond.para2.toString(16).padStart(16, '0') +
    cond.compOpr3.toString(16).padStart(2, '0') +
    cond.para3.toString(16).padStart(16, '0')
  }`;
  return out;
}

// ==== Option ====

export interface Option {
  head: HeadOfOpt;
  cond: Cond;
  body: BodyOfOpt;
  obligors: number[];
}

export const defaultOpt: Option = {
  head: defaultHeadOfOpt,
  cond: defaultCond,
  body: defaultBodyOfOpt,
  obligors: [],
}

export async function getObligors(term:HexType, seqOfOpt: number):Promise<number[]>{
  let res = await readContract({
    address: term,
    abi: optionsABI,
    functionName: 'getObligorsOfOption',
    args: [ BigInt(seqOfOpt)],
  })

  let out = res.map(v => Number(v));

  return out;
}

export const typeOfOpts = [
  'Call @ Price', 'Put @ Price', 'Call @ ROE', 'Put @ ROE', 
  'Call @ Price & Cnds', 'Put @ Price & Cnds', 'Call @ ROE & Cnds', 'Put @ ROE & Cnds'
]

export const logOps = [
  '(SoleCond)', '&& (And)', '|| (Or)', '&&_||', '||_&&', '== (Equal)', '!= (NotEqual)',
  '&&_&&_&&', '||_||_||', '&&_||_||', '||_&&_||', 
  '||_||_&&', '&&_&&_||', '&&_||_&&', '||_&&_&&',
  '==_==', '==_!=', '!=_==', '!=_!='
]

export const comOps = [
  'None', '==', '!=', '>', '<', '>=', '<=' 
]

async function refreshList(term: HexType, ls: readonly Omit<Option, 'obligors'>[] ): Promise<Option[]>{

  let out:Option[] = [];
  let len = ls.length;

  while(len > 0) {
    let item:Option = {
      head: ls[len-1].head,
      cond: ls[len-1].cond,
      body: ls[len-1].body,
      obligors: await getObligors(term, ls[len-1].head.seqOfOpt),
    }
    out.push(item);
    len--;
  }

  return out;
}


export function Options({ sha, term, setTerms, isFinalized }: SetShaTermProps) {

  const [ opts, setOpts ] = useState<readonly Option[]>();

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
                <Toolbar>
                  <h4>Put/Call Options (Addr: { term == AddrZero ? '-' : term } )</h4>
                </Toolbar>

                  {!isFinalized && (
                    <AddTerm sha={ sha } typeOfDoc={ 27 } setTerms={ setTerms } isCreated={ term != AddrZero }  />
                  )}


              </Stack>

              {term !=AddrZero && !isFinalized && (
                <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

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

                    <Divider flexItem />

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

                </Paper>
              )}

              {term != AddrZero && opts && opts.length > 0 && opts.map(v => (
                <Opt key={ v.head.seqOfOpt } opt={ v } />
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

