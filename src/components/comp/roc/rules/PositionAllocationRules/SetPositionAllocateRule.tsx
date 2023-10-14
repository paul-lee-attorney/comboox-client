
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers';
import { 
  Stack,
  TextField,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AddRule } from './../AddRule';
import { dateParser, longSnParser, onlyNum } from '../../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { HexType } from '../../../../../scripts/common';
import { RulesEditProps } from '../GovernanceRules/SetGovernanceRule';
import { getRule } from '../../../../../scripts/comp/sha';

// ==== Str Interface ====

export interface StrPosAllocateRule {
  seqOfRule: string ;
  qtyOfSubRule: string ;
  seqOfSubRule: string ;
  removePos: boolean ;
  seqOfPos: string ;
  titleOfPos: string ;
  nominator: string ;
  titleOfNominator: string ;
  seqOfVR: string ;
  endDate: string;
  para: string;
  argu: string;
  data: string; 
}

export function strPRCodifier(rule: StrPosAllocateRule): HexType {
  let hexRule: HexType = `0x${
    (Number(rule.seqOfRule).toString(16).padStart(4, '0')) +
    (Number(rule.qtyOfSubRule).toString(16).padStart(2, '0')) +
    (Number(rule.seqOfSubRule).toString(16).padStart(2, '0')) +
    (rule.removePos ? '01' : '00' ) +
    (Number(rule.seqOfPos).toString(16).padStart(4, '0')) +
    (Number(rule.titleOfPos).toString(16).padStart(4, '0')) +
    (Number(rule.nominator).toString(16).padStart(10, '0')) +
    (Number(rule.titleOfNominator).toString(16).padStart(4, '0')) +                  
    (Number(rule.seqOfVR).toString(16).padStart(4, '0')) +
    (Number(rule.endDate).toString(16).padStart(12, '0')) +
    '0'.padStart(16, '0')
  }`;
  return hexRule;
} 

export function strPRParser(hexRule: HexType): StrPosAllocateRule {
  let rule: StrPosAllocateRule = {
    seqOfRule: parseInt(hexRule.substring(2, 6), 16).toString(), 
    qtyOfSubRule: parseInt(hexRule.substring(6, 8), 16).toString(),
    seqOfSubRule: parseInt(hexRule.substring(8, 10), 16).toString(),
    removePos: hexRule.substring(10, 12) === '01',
    seqOfPos: parseInt(hexRule.substring(12, 16), 16).toString(),
    titleOfPos: parseInt(hexRule.substring(16, 20), 16).toString(),
    nominator: parseInt(hexRule.substring(20, 30), 16).toString(),
    titleOfNominator: parseInt(hexRule.substring(30, 34), 16).toString(),
    seqOfVR: parseInt(hexRule.substring(34, 38), 16).toString(),
    endDate: parseInt(hexRule.substring(38, 50), 16).toString(),
    para: parseInt(hexRule.substring(50, 54), 16).toString(),
    argu: parseInt(hexRule.substring(54, 58), 16).toString(),
    data: parseInt(hexRule.substring(58, 66), 16).toString(),
  };

  return rule;
}

// ==== Num Interface ====

export interface PosAllocateRule {
  seqOfRule: number ;
  qtyOfSubRule: number ;
  seqOfSubRule: number ;
  removePos: boolean ;
  seqOfPos: number ;
  titleOfPos: number ;
  nominator: number ;
  titleOfNominator: number ;
  seqOfVR: number ;
  endDate: number;
  para: number;
  argu: number;
  data: number; 
}

export const titleOfPositions: string[] = [
  'Shareholder', 'Chairman', 'ViceChairman', 'ManagintDirector', 'Director', 
  'CEO', 'CFO', 'COO', 'CTO', 'President', 'VicePresident', 'Supervisor', 
  'SeniorManager', 'Manager', 'ViceManager'
];

export function prCodifier(rule: PosAllocateRule): HexType {
  let hexRule: HexType = `0x${
    (rule.seqOfRule.toString(16).padStart(4, '0')) +
    (rule.qtyOfSubRule.toString(16).padStart(2, '0')) +
    (rule.seqOfSubRule.toString(16).padStart(2, '0')) +
    (rule.removePos ? '01' : '00' ) +
    (rule.seqOfPos.toString(16).padStart(4, '0')) +
    (rule.titleOfPos.toString(16).padStart(4, '0')) +
    (rule.nominator.toString(16).padStart(10, '0')) +
    (rule.titleOfNominator.toString(16).padStart(4, '0')) +                  
    (rule.seqOfVR.toString(16).padStart(4, '0')) +
    (rule.endDate.toString(16).padStart(12, '0')) +
    '0'.padStart(16, '0')
  }`;
  return hexRule;
} 

export function prParser(hexRule: HexType): PosAllocateRule {
  let rule: PosAllocateRule = {
    seqOfRule: parseInt(hexRule.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(hexRule.substring(6, 8), 16),
    seqOfSubRule: parseInt(hexRule.substring(8, 10), 16),
    removePos: hexRule.substring(10, 12) === '01',
    seqOfPos: parseInt(hexRule.substring(12, 16), 16),
    titleOfPos: parseInt(hexRule.substring(16, 20), 16),
    nominator: parseInt(hexRule.substring(20, 30), 16),
    titleOfNominator: parseInt(hexRule.substring(30, 34), 16),
    seqOfVR: parseInt(hexRule.substring(34, 38), 16),
    endDate: parseInt(hexRule.substring(38, 50), 16),
    para: parseInt(hexRule.substring(50, 54), 16),
    argu: parseInt(hexRule.substring(54, 58), 16),
    data: parseInt(hexRule.substring(58, 66), 16),
  };

  return rule;
}

export function SetPositionAllocateRule({ sha, seq, isFinalized, time, refresh }: RulesEditProps ) {

  const strDefaultRule: StrPosAllocateRule = {
    seqOfRule: seq.toString(), 
    qtyOfSubRule: (seq - 255).toString(),
    seqOfSubRule: (seq - 255).toString(),
    removePos: false,
    seqOfPos: '0',
    titleOfPos: '5',
    nominator: '0',
    titleOfNominator: '1',
    seqOfVR: '9',
    endDate: '0',
    para: '0',
    argu: '0',
    data: '0',
  };

  // const defaultRule: PosAllocateRule = {
  //   seqOfRule: seq, 
  //   qtyOfSubRule: seq - 255,
  //   seqOfSubRule: seq - 255,
  //   removePos: false,
  //   seqOfPos: 0,
  //   titleOfPos: 5,
  //   nominator: 0,
  //   titleOfNominator: 1,
  //   seqOfVR: 9,
  //   endDate: 0,
  //   para: 0,
  //   argu: 0,
  //   data: 0,
  // };
  
  const [ objPR, setObjPR ] = useState<StrPosAllocateRule>(strDefaultRule); 
  const [ valid, setValid ] = useState(true);
  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    getRule(sha, seq).then(
      res => setObjPR(strPRParser(res))
    );
  }, [sha, seq, time]);  

  return (
    <>
      <Button
        variant={objPR && Number(objPR.seqOfPos) > 0 ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        fullWidth={true}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Rule No. { seq } 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >

        <DialogContent>

          <Paper elevation={3} sx={{
            alignContent:'center', 
            justifyContent:'center', 
            p:1, m:1, 
            border: 1, 
            borderColor:'divider' 
            }} 
          >
            <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >        

              <Box sx={{ minWidth:600 }} >
                <Toolbar sx={{ textDecoration:'underline' }} >
                  <h4>Rule No. { seq.toString() } - { titleOfPositions[Number(objPR.titleOfPos) - 1] } </h4>
                </Toolbar>
              </Box>

              <AddRule 
                sha={ sha } 
                rule={ strPRCodifier(objPR) } 
                isFinalized={isFinalized}
                valid={valid}
                refresh={refresh}
                setOpen={setOpen}
              />
            </Stack>

            <Stack 
              direction={'column'} 
              spacing={1} 
            >

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  size='small'
                  label='QtyOfSubRule'
                  error={ onlyNum(objPR.qtyOfSubRule, BigInt(2**8-1), setValid).error }
                  helperText={ onlyNum(objPR.qtyOfSubRule, BigInt(2**8-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}                  
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjPR((v) => ({
                    ...v,
                    qtyOfSubRule: e.target.value,
                  }))}
                  value={ objPR.qtyOfSubRule }
                />

                {!isFinalized && (
                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="removePos-label">RemovePos ?</InputLabel>
                    <Select
                      labelId="removePos-label"
                      id="removePos-select"
                      label="RemovePos ?"
                      value={ objPR.removePos ? '1' : '0' }
                      onChange={(e) => setObjPR((v) => ({
                        ...v,
                        removePos: e.target.value == '1',
                      }))}
                    >
                      <MenuItem value={ '1' } > True </MenuItem>
                      <MenuItem value={ '0' } > False </MenuItem>
                    </Select>
                  </FormControl>
                )}
                  
                {isFinalized && (
                  <TextField 
                    variant='outlined'
                    size='small'
                    label='RemovePos ?'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={objPR.removePos ? 'True' : 'False'}
                  />
                )}

                <TextField 
                  variant='outlined'
                  size='small'
                  label='SeqOfPos'
                  error={ onlyNum(objPR.seqOfPos, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objPR.seqOfPos, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}           
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjPR((v) => ({
                    ...v,
                    seqOfPos: e.target.value,
                  }))}
                  value={ objPR.seqOfPos }              
                />

                {!isFinalized && (
                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="titleOfPos-label">TitleOfPos</InputLabel>
                    <Select
                      labelId="titleOfPos-label"
                      id="titleOfPos-select"
                      label="TitleOfPos"
                      value={ objPR.titleOfPos }
                      onChange={(e) => setObjPR((v) => ({
                        ...v,
                        titleOfPos: e.target.value,
                      }))}
                    >
                      { titleOfPositions.map( (v, i) => (
                        <MenuItem key={v} value={i+1}> { v } </MenuItem>
                      ))}

                    </Select>
                  </FormControl>
                )}
                {isFinalized && (
                  <TextField 
                    variant='outlined'
                    size='small'
                    label='TitleOfPos'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ titleOfPositions[Number(objPR.titleOfPos) - 1] ?? 'Director' }
                  />
                )}

              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  size='small'
                  label='Nominator'
                  error={ onlyNum(objPR.nominator, BigInt(2**40-1), setValid).error }
                  helperText={ onlyNum(objPR.nominator, BigInt(2**40-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}           
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjPR((v) => ({
                    ...v,
                    nominator: e.target.value,
                  }))}
                  value={ isFinalized ? longSnParser(objPR.nominator) : objPR.nominator }                                        
                />

                {!isFinalized && (
                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="titleOfNominator-label">TitleOfNominator</InputLabel>
                    <Select
                      labelId="titleOfNominator-label"
                      id="titleOfNominator-select"
                      label="TitleOfNominator"
                      value={ !objPR ? '1' : objPR.titleOfNominator }
                      onChange={(e) => setObjPR((v) => ({
                        ...v,
                        titleOfNominator: e.target.value,
                      }))}
                    >
                      { titleOfPositions.map( (v, i) => (
                        <MenuItem key={v} value={i+1}> { v } </MenuItem>
                      ))}

                    </Select>
                  </FormControl>
                )}
                {isFinalized && (
                  <TextField 
                    variant='outlined'
                    size='small'
                    label='TitleOfNominator'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ titleOfPositions[Number(objPR.titleOfNominator) - 1] ?? 'Shareholder'}
                  />
                )}

                <TextField 
                  variant='outlined'
                  size='small'
                  label='seqOfVR'
                  error={ onlyNum(objPR.seqOfVR, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objPR.seqOfVR, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}           
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjPR((v) => ({
                    ...v,
                    seqOfVR: e.target.value,
                  }))}
                  value={ objPR.seqOfVR }                                        
                />
                {!isFinalized && (
                  <DateTimeField
                    label='EndDate'
                    size='small'
                    readOnly={isFinalized}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }} 
                    value={ dayjs.unix(Number(objPR.endDate)) }
                    onChange={(date) => setObjPR((v) => ({
                      ...v,
                      endDate: date ? date.unix().toString() : '0',
                    }))}
                    format='YYYY-MM-DD HH:mm:ss'
                  />
                )}
                {isFinalized && (
                  <TextField 
                    variant='outlined'
                    label='EndDate'
                    inputProps={{readOnly: true}}
                    size='small'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser(objPR.endDate.toString()) }
                  />                  
                )}

              </Stack>

            </Stack>
          </Paper>

        </DialogContent>

        <DialogActions>
          <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>
    </> 
  )
}
