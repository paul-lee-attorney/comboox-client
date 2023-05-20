
import { useState } from 'react';

import { 
  Stack,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Toolbar,
} from '@mui/material';


import { AddRule } from './AddRule';

import { Bytes32Zero, HexType, SetShaRuleProps } from '../../../../interfaces';
import { dateParser } from '../../../../scripts/toolsKit';

interface PosAllocateRuleType {
  seqOfRule?: number | undefined;
  qtyOfSubRule?: number | undefined;
  seqOfSubRule?: number | undefined;
  removePos?: boolean | undefined;
  seqOfPos?: number | undefined;
  titleOfPos?: number | undefined;
  nominator?: number | undefined;
  titleOfNominator?: number | undefined;
  seqOfVR?: number | undefined;
  endDate?: number | undefined;
}

const titleOfPositions: string[] = ['ZeroPoint', 'Chairman', 'ViceChairman', 'ManagintDirector', 'Director', 'CEO', 'CFO', 'COO', 'CTO', 'President', 'VicePresident', 'Supervisor', 'SeniorManager', 'Manager', 'ViceManager'];

const titleOfNominator: string[] = ['ZeroPoint', 'Shareholder', 'Chairman', 'ManagintDirector', 'Director', 'CEO', 'CFO', 'COO', 'CTO', 'President', 'VicePresident', 'Supervisor', 'SeniorManager', 'Manager', 'ViceManager']

export function SetPositionAllocateRule({ sha, qty, seq }: SetShaRuleProps) {
  const [ objPR, setObjPR ] = useState<PosAllocateRuleType>(); 

  let hexPR: HexType = `0x${
    (objPR?.seqOfRule?.toString(16).padStart(4, '0') ?? seq.toString(16).padStart(4, '0')) +
    (objPR?.qtyOfSubRule?.toString(16).padStart(2, '0') ?? qty.toString(16).padStart(2, '0')) +
    (objPR?.seqOfSubRule?.toString(16).padStart(2, '0') ?? (seq - 255).toString(16).padStart(2, '0')) +
    (objPR?.removePos ? '01' : '00') +
    (objPR?.seqOfPos?.toString(16).padStart(4, '0') ?? '0000') +
    (objPR?.titleOfPos?.toString(16).padStart(4, '0') ?? '0000') +
    (objPR?.nominator?.toString(16).padStart(10, '0') ?? '0'.padStart(10, '0')) +
    (objPR?.titleOfNominator?.toString(16).padStart(4, '0') ?? '0000') +                  
    (objPR?.seqOfVR?.toString(16).padStart(4, '0') ?? '0000') +
    (objPR?.endDate?.toString(16).padStart(12, '0') ?? '0'.padStart(12,'0')) +
    '0'.padStart(16, '0')
  }`;

  console.log('objPR: ', objPR);

  const [ newHexPR, setNewHexPr ] = useState<HexType>(Bytes32Zero);

  let newPR: PosAllocateRuleType = {
    seqOfRule: parseInt(newHexPR.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(newHexPR.substring(6, 8), 16),
    seqOfSubRule: parseInt(newHexPR.substring(8, 10), 16),
    removePos: newHexPR.substring(10, 12) === '01',
    seqOfPos: parseInt(newHexPR.substring(12, 16), 16),
    titleOfPos: parseInt(newHexPR.substring(16, 20), 16),
    nominator: parseInt(newHexPR.substring(20, 30), 16),
    titleOfNominator: parseInt(newHexPR.substring(30, 34), 16),
    seqOfVR: parseInt(newHexPR.substring(34, 38), 16),
    endDate: parseInt(newHexPR.substring(38, 50), 16),
  } 

  console.log('newPR: ', newPR);

  const [ editable, setEditable ] = useState<boolean>(false); 

  return (
    <>
      <Paper sx={{
        alignContent:'center', 
        justifyContent:'center', 
        p:1, m:1, 
        border: 1, 
        borderColor:'divider' 
        }} 
      >
        <Stack direction={'row'} sx={{ justifyContent: 'flex-start', alignItems: 'center' }} >        
          <Toolbar>
            <h4>Rule No. { seq.toString() } </h4>
          </Toolbar>

          <AddRule 
            sha={ sha } 
            rule={ hexPR } 
            setUpdatedRule={setNewHexPr} 
            editable={editable} 
            setEditable={setEditable} 
          />
        </Stack>

        <Stack 
          direction={'column'} 
          spacing={1} 
        >

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >
            {/* <h6>System Record</h6> */}
            {newPR?.seqOfRule != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newPR.seqOfRule.toString() }
              />
            )}

            {newPR?.qtyOfSubRule != undefined && (
              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newPR.qtyOfSubRule.toString() }
              />
            )}

            {newPR?.seqOfSubRule != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfSubRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newPR.seqOfSubRule.toString() }
              />
            )}

            {newPR?.removePos != undefined && (
              <TextField 
                variant='filled'
                label='RemovePos'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newPR.removePos ? 'True' : 'False'}
              />
            )}

            {newPR?.seqOfPos != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfPosition'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newPR.seqOfPos.toString() }
              />
            )}

          </Stack>

          <Collapse in={ editable } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >
              {/* <Collapse in={ false } >   */}            

              <TextField 
                variant='filled'
                label='SeqOfRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjPR((v) => ({
                  ...v,
                  seqOfRule: parseInt(e.target.value),
                }))}
                value={ objPR?.seqOfRule }              
              />

              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjPR((v) => ({
                  ...v,
                  qtyOfSubRule: parseInt(e.target.value),
                }))}
                value={ objPR?.qtyOfSubRule }              
              />

              <TextField 
                variant='filled'
                label='SeqOfSubRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjPR((v) => ({
                  ...v,
                  seqOfSubRule: parseInt(e.target.value),
                }))}
                value={ objPR?.seqOfSubRule }              
              />

              <Box sx={{ minWidth: 218, m: 1 }} >
                <FormControlLabel 
                  label='RemovePos'
                  control={
                    <Checkbox 
                      sx={{
                        m: 1,
                        height: 64,
                      }}
                      onChange={e => setObjPR(v => ({
                        ...v,
                        removePos: e.target.checked,
                      }))}
                      checked={ objPR?.removePos }
                    />
                  }
                />
              </Box>

              <TextField 
                variant='filled'
                label='SeqOfPos'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjPR((v) => ({
                  ...v,
                  seqOfPos: parseInt(e.target.value),
                }))}
                value={ objPR?.seqOfPos }              
              />

            </Stack>
          </Collapse>

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            {newPR?.titleOfPos != undefined && (
              <TextField 
                variant='filled'
                label='TitleOfPos'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ titleOfPositions[newPR.titleOfPos] }
              />
            )}

            {newPR?.nominator != undefined && (
              <TextField 
                variant='filled'
                label='Nominator'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newPR.nominator.toString()}
              />
            )}

            {newPR?.titleOfNominator != undefined && (
              <TextField 
                variant='filled'
                label='titleOfNominator'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newPR.titleOfNominator.toString()}
              />
            )}

            {newPR?.seqOfVR != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfVR'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newPR.seqOfVR.toString()}
              />
            )}

            {newPR?.endDate != undefined && (
              <TextField 
                variant='filled'
                label='EndDate'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ dateParser(newPR.endDate) }
              />
            )}

          </Stack>

          <Collapse in={ editable } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="titleOfPos-label">TitleOfPos</InputLabel>
                <Select
                  labelId="titleOfPos-label"
                  id="titleOfPos-select"
                  value={ objPR?.titleOfPos == undefined ? '' : objPR?.titleOfPos }
                  onChange={(e) => setObjPR((v) => ({
                    ...v,
                    titleOfPos: parseInt(e.target.value.toString()),
                  }))}

                  label="TitleOfPos"
                >
                  { titleOfPositions.map( (v, i) => (
                    <MenuItem key={v} value={i}> { v } </MenuItem>
                  ))}

                </Select>
              </FormControl>

              <TextField 
                variant='filled'
                label='Nominator'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjPR((v) => ({
                  ...v,
                  nominator: parseInt(e.target.value),
                }))}
                value={ objPR?.nominator}                                        
              />


              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="titleOfNominator-label">TitleOfNominator</InputLabel>
                <Select
                  labelId="titleOfNominator-label"
                  id="titleOfNominator-select"
                  value={ objPR?.titleOfNominator == undefined ? '' : objPR?.titleOfNominator }
                  onChange={(e) => setObjPR((v) => ({
                    ...v,
                    titleOfNominator: parseInt(e.target.value.toString()),
                  }))}

                  label="TitleOfNominator"
                >
                  { titleOfNominator.map( (v, i) => (
                    <MenuItem key={v} value={i}> { v } </MenuItem>
                  ))}

                </Select>
              </FormControl>

              <TextField 
                variant='filled'
                label='seqOfVR'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjPR((v) => ({
                  ...v,
                  seqOfVR: parseInt(e.target.value),
                }))}
                value={ objPR?.seqOfVR}                                        
              />

              <TextField 
                variant='filled'
                label='EndDate'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjPR((v) => ({
                  ...v,
                  endDate: parseInt(e.target.value),
                }))}
                value={ objPR?.endDate}                                        
              />

            </Stack>
          </Collapse>

        </Stack>
      </Paper>
    </> 
  )
}
