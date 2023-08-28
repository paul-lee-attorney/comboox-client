
import { useState } from 'react';

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
  Collapse,
  Toolbar,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { AddRule } from './AddRule';

import { dateParser, longSnParser } from '../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { SetRuleProps } from './SetVotingRule';
import { useShareholdersAgreementGetRule } from '../../../../generated';
import { HexType } from '../../../../scripts/common';

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

export function SetPositionAllocateRule({ sha, seq, isFinalized, getRules }: SetRuleProps ) {

  const defaultRule: PosAllocateRule = {
    seqOfRule: seq, 
    qtyOfSubRule: seq - 255,
    seqOfSubRule: seq - 255,
    removePos: false,
    seqOfPos: 0,
    titleOfPos: 5,
    nominator: 0,
    titleOfNominator: 1,
    seqOfVR: 9,
    endDate: 0,
    para: 0,
    argu: 0,
    data: 0,
  };
  
  const [ objPR, setObjPR ] = useState<PosAllocateRule>(defaultRule); 

  const [ newPR, setNewPR ] = useState<PosAllocateRule>(defaultRule);

  const [ editable, setEditable ] = useState<boolean>(false); 
  const [ open, setOpen ] = useState(false);

  const {
    refetch: obtainRule
  } = useShareholdersAgreementGetRule({
    address: sha,
    args: [ BigInt(seq) ],
    onSuccess(res) {
      setNewPR(prParser(res))
    }
  })

  return (
    <>
      <Button
        // disabled={ !newGR }
        variant={newPR && newPR.seqOfPos > 0 ? 'contained' : 'outlined'}
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
                  <h4>Rule No. { seq.toString() } - { titleOfPositions[newPR.titleOfPos - 1] } </h4>
                </Toolbar>
              </Box>

              <AddRule 
                sha={ sha } 
                rule={ prCodifier(objPR) } 
                refreshRule={obtainRule} 
                editable={editable} 
                setEditable={setEditable} 
                isFinalized={isFinalized}
                getRules={ getRules }
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
                  label='SeqOfRule'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newPR.seqOfRule.toString() }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='QtyOfSubRule'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newPR.qtyOfSubRule.toString() }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='RemovePos ?'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={newPR.removePos ? 'True' : 'False'}
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='SeqOfPosition'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newPR.seqOfPos.toString() }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='TitleOfPos'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ titleOfPositions[newPR.titleOfPos - 1] ?? 'Director' }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='EndDate'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ dateParser(newPR.endDate) }
                />

              </Stack>

              <Collapse in={ editable && !isFinalized } >
                <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='SeqOfRule'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjPR((v) => ({
                      ...v,
                      seqOfRule: parseInt( e.target.value ),
                    }))}
                    value={ objPR.seqOfRule }              
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='QtyOfSubRule'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjPR((v) => ({
                      ...v,
                      qtyOfSubRule: parseInt(e.target.value),
                    }))}
                    value={ objPR.qtyOfSubRule }              
                  />

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

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='SeqOfPos'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjPR((v) => ({
                      ...v,
                      seqOfPos: parseInt(e.target.value),
                    }))}
                    value={ objPR.seqOfPos }              
                  />

                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="titleOfPos-label">TitleOfPos</InputLabel>
                    <Select
                      labelId="titleOfPos-label"
                      id="titleOfPos-select"
                      label="TitleOfPos"
                      value={ objPR.titleOfPos }
                      onChange={(e) => setObjPR((v) => ({
                        ...v,
                        titleOfPos: parseInt(e.target.value.toString()),
                      }))}
                    >
                      { titleOfPositions.map( (v, i) => (
                        <MenuItem key={v} value={i+1}> { v } </MenuItem>
                      ))}

                    </Select>
                  </FormControl>

                  <DateTimeField
                    label='EndDate'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }} 
                    value={ dayjs.unix(objPR.endDate) }
                    onChange={(date) => setObjPR((v) => ({
                      ...v,
                      endDate: date ? date.unix() : 0,
                    }))}
                    format='YYYY-MM-DD HH:mm:ss'
                  />

                </Stack>
              </Collapse>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  size='small'
                  label='Nominator'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longSnParser(newPR.nominator.toString())}
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='TitleOfNominator'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ titleOfPositions[newPR.titleOfNominator - 1] ?? 'Shareholder'}
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='SeqOfVR'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={newPR.seqOfVR.toString()}
                />

              </Stack>

              <Collapse in={ editable && !isFinalized } >
                <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='Nominator'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjPR((v) => ({
                      ...v,
                      nominator: parseInt(e.target.value),
                    }))}
                    value={ objPR.nominator }                                        
                  />

                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="titleOfNominator-label">TitleOfNominator</InputLabel>
                    <Select
                      labelId="titleOfNominator-label"
                      id="titleOfNominator-select"
                      label="TitleOfNominator"
                      value={ !objPR ? '1' : objPR.titleOfNominator }
                      onChange={(e) => setObjPR((v) => ({
                        ...v,
                        titleOfNominator: parseInt(e.target.value.toString()),
                      }))}
                    >
                      { titleOfPositions.map( (v, i) => (
                        <MenuItem key={v} value={i+1}> { v } </MenuItem>
                      ))}

                    </Select>
                  </FormControl>

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='seqOfVR'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjPR((v) => ({
                      ...v,
                      seqOfVR: parseInt(e.target.value),
                    }))}
                    value={ objPR.seqOfVR }                                        
                  />

                </Stack>
              </Collapse>

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
