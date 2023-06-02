
import { useState } from 'react';

import { 
  Stack,
  TextField,
  Paper,
  Toolbar,
  Checkbox,
  FormControlLabel,
  Box,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { AddRule } from './AddRule'

import { Bytes32Zero, FirstRefusalRuleType, HexType } from '../../../../interfaces';

interface SetFirstRefusalRuleProps {
  sha: HexType,
  defaultRule: FirstRefusalRuleType,
  seq: number,
  finalized: boolean,
}

export function SetFirstRefusalRule({ sha, defaultRule, seq, finalized }: SetFirstRefusalRuleProps) {
  const [ objFR, setObjFR ] = useState<FirstRefusalRuleType>(defaultRule); 

  let hexFR: HexType = `0x${
    (objFR?.seqOfRule.toString(16).padStart(4, '0') ?? defaultRule.seqOfRule.toString(16).padStart(4, '0')) +
    (objFR?.qtyOfSubRule.toString(16).padStart(2, '0') ?? defaultRule.qtyOfSubRule.toString(16).padStart(2, '0')) +
    (objFR?.seqOfSubRule.toString(16).padStart(2, '0') ?? defaultRule.seqOfSubRule.toString(16).padStart(2, '0')) +
    (objFR?.typeOfDeal.toString(16).padStart(2, '0') ?? defaultRule.typeOfDeal.toString(16).padStart(2, '0')) +
    (objFR?.membersEqual != undefined ? objFR.membersEqual ? '01' : '00' : defaultRule.membersEqual ? '01': '00') +
    (objFR?.proRata != undefined ? objFR.proRata ? '01' : '00' : defaultRule.proRata ? '01': '00') +
    (objFR?.basedOnPar != undefined ? objFR.basedOnPar ? '01' : '00' : defaultRule.basedOnPar ? '01':'00') +
    (objFR?.rightholder1.toString(16).padStart(10, '0') ?? defaultRule.rightholder1.toString(16).padStart(10, '0')) +
    (objFR?.rightholder2.toString(16).padStart(10, '0') ?? defaultRule.rightholder2.toString(16).padStart(10, '0')) +
    (objFR?.rightholder3.toString(16).padStart(10, '0') ?? defaultRule.rightholder3.toString(16).padStart(10, '0')) +
    (objFR?.rightholder4.toString(16).padStart(10, '0') ?? defaultRule.rightholder4.toString(16).padStart(10, '0')) +
    '0'.padStart(8, '0')
  }`;

  // console.log('objFR: ', objFR);

  const [ newHexFR, setNewHexFR ] = useState<HexType>(Bytes32Zero);

  let newFR: FirstRefusalRuleType = {
    subTitle: defaultRule.subTitle,
    seqOfRule: parseInt(newHexFR.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(newHexFR.substring(6, 8), 16),
    seqOfSubRule: parseInt(newHexFR.substring(8, 10), 16),
    typeOfDeal: parseInt(newHexFR.substring(10, 12), 16),
    membersEqual: newHexFR.substring(12, 14) === '01',
    proRata: newHexFR.substring(14, 16) === '01',
    basedOnPar: newHexFR.substring(16, 18) === '01',
    rightholder1: parseInt(newHexFR.substring(18, 28), 16),
    rightholder2: parseInt(newHexFR.substring(28, 38), 16),
    rightholder3: parseInt(newHexFR.substring(38, 48), 16),
    rightholder4: parseInt(newHexFR.substring(48, 58), 16),
  }; 

  // console.log('newFR: ', newFR);

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
        
        <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >        
          <Box sx={{ minWidth:600 }} >
            <Toolbar>
              <h4>Rule No. { seq.toString() } { defaultRule.subTitle } </h4>
            </Toolbar>
          </Box>

          <AddRule 
            sha={ sha }
            rule={ hexFR }
            setUpdatedRule={ setNewHexFR }
            editable = { editable }
            setEditable={ setEditable }
            finalized={finalized}
          />
        </Stack>

        <Stack 
          direction={'column'} 
          spacing={1} 
        >

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            {newFR?.seqOfRule != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newFR.seqOfRule.toString() }
              />
            )}

            {newFR?.qtyOfSubRule != undefined && (
              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newFR.qtyOfSubRule.toString() }
              />
            )}

            {newFR?.typeOfDeal != undefined && (
              <TextField 
                variant='filled'
                label='TypeOfDeal'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newFR.typeOfDeal.toString() }
              />
            )}

            {newFR?.membersEqual != undefined && (
              <TextField 
                variant='filled'
                label='MembersEqual ?'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newFR.membersEqual ? 'True' : 'False'}
              />
            )}

            {newFR?.proRata != undefined && (
              <TextField 
                variant='filled'
                label='ProRata ?'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newFR.proRata ? 'True' : 'False'}
              />
            )}

            {newFR?.basedOnPar != undefined && (
              <TextField 
                variant='filled'
                label='BasedOnPar ?'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newFR.basedOnPar ? 'True' : 'False'}
              />
            )}

          </Stack>

          <Collapse in={ editable && !finalized } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

              <TextField 
                variant='filled'
                label='SeqOfRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjFR((v) => ({
                  ...v,
                  seqOfRule: parseInt(e.target.value),
                }))}
                value={ objFR?.seqOfRule }              
              />

              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjFR((v) => ({
                  ...v,
                  qtyOfSubRule: parseInt(e.target.value),
                }))}
                value={ objFR?.qtyOfSubRule }              
              />

              <TextField 
                variant='filled'
                label='TypeOfDeal'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjFR((v) => ({
                  ...v,
                  typeOfDeal: parseInt(e.target.value),
                }))}
                value={ objFR?.typeOfDeal }              
              />

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="membersEqual-label">MembersEqual ?</InputLabel>
                <Select
                  labelId="membersEqual-label"
                  id="membersEqual-select"
                  value={ objFR?.membersEqual ? '1' : '0' }
                  onChange={(e) => setObjFR((v) => ({
                    ...v,
                    membersEqual: e.target.value == '01',
                  }))}

                  label="MembersEqual ?"
                >
                  <MenuItem value={'1'}>True</MenuItem>
                  <MenuItem value={'0'}>False</MenuItem>
                </Select>
              </FormControl>


              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="proRata-label">ProRata ?</InputLabel>
                <Select
                  labelId="proRata-label"
                  id="proRata-select"
                  value={ objFR?.proRata ? '1' : '0' }
                  onChange={(e) => setObjFR((v) => ({
                    ...v,
                    proRata: e.target.value == '01',
                  }))}

                  label="ProRata ?"
                >
                  <MenuItem value={'1'}>True</MenuItem>
                  <MenuItem value={'0'}>False</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="basedOnPar-label">BasedOnPar ?</InputLabel>
                <Select
                  labelId="basedOnPar-label"
                  id="basedOnPar-select"
                  value={ objFR?.basedOnPar ? '1' : '0' }
                  onChange={(e) => setObjFR((v) => ({
                    ...v,
                    basedOnPar: e.target.value == '01',
                  }))}

                  label="BasedOnPar ?"
                >
                  <MenuItem value={'1'}>True</MenuItem>
                  <MenuItem value={'0'}>False</MenuItem>
                </Select>
              </FormControl>


            </Stack>
          </Collapse>

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            {newFR?.rightholder1 != undefined && (
              <TextField 
                variant='filled'
                label='Rightholder_1'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newFR.rightholder1.toString() }
              />
            )}

            {newFR?.rightholder2 != undefined && (
              <TextField 
                variant='filled'
                label='Rightholder_2'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newFR.rightholder2.toString() }
              />
            )}

            {newFR?.rightholder3 != undefined && (
              <TextField 
                variant='filled'
                label='Rightholder_3'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newFR.rightholder3.toString() }
              />
            )}

            {newFR?.rightholder4 != undefined && (
              <TextField 
                variant='filled'
                label='Rightholder_4'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newFR.rightholder4.toString() }
              />
            )}

          </Stack>

          <Collapse in={ editable && !finalized } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

              <TextField 
                variant='filled'
                label='Rightholder_1'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjFR((v) => ({
                  ...v,
                  rightholder1: parseInt(e.target.value),
                }))}
                value={ objFR?.rightholder1 }
              />

              <TextField 
                variant='filled'
                label='Rightholder_2'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjFR((v) => ({
                  ...v,
                  rightholder2: parseInt(e.target.value),
                }))}
                value={ objFR?.rightholder2 }
              />

              <TextField 
                variant='filled'
                label='Rightholder_3'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjFR((v) => ({
                  ...v,
                  rightholder3: parseInt(e.target.value),
                }))}
                value={ objFR?.rightholder3 }
              />

              <TextField 
                variant='filled'
                label='Rightholder_4'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjFR((v) => ({
                  ...v,
                  rightholder4: parseInt(e.target.value),
                }))}
                value={ objFR?.rightholder4 }
              />

            </Stack>
          </Collapse>

        </Stack>

      </Paper>
    </> 
  )
}
