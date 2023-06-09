
import { useState } from 'react';

import { 
  Stack,
  Divider,
  TextField,
  Paper,
  Toolbar,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
} from '@mui/material';

import { AddRule } from './AddRule';

import { Bytes32Zero, HexType } from '../../../../interfaces';
import { BigNumber } from 'ethers';
import { dateParser, toBasePoint, toPercent } from '../../../../scripts/toolsKit';
import { VotingRule, VotingRuleWrap } from './VotingRules';

interface SetVotingRuleProps {
  sha: HexType,
  defaultRule: VotingRuleWrap,
  seq: number,
  finalized: boolean,
}

export function SetVotingRule({ sha, defaultRule, seq, finalized }: SetVotingRuleProps) {
  const [ objVR, setObjVR ] = useState<VotingRule>(defaultRule.votingRule); 

  let hexVR: HexType = `0x${
    (objVR.seqOfRule.toString(16).padStart(4, '0')) +
    (objVR.qtyOfSubRule.toString(16).padStart(2, '0')) +
    (objVR.seqOfSubRule.toString(16).padStart(2, '0')) +
    (objVR.authority.toString(16).padStart(4, '0')) +
    (objVR.headRatio.toString(16).padStart(4, '0')) +
    (objVR.amountRatio.toString(16).padStart(4, '0')) +
    (objVR.onlyAttendance ? '01' : '00' )+
    (objVR.impliedConsent ? '01' : '00' )+
    (objVR.partyAsConsent ? '01' : '00' )+
    (objVR.againstShallBuy ? '01' : '00' )+
    (objVR.shaExecDays.toString(16).padStart(2, '0')) +
    (objVR.reviewDays.toString(16).padStart(2, '0')) +
    (objVR.reconsiderDays.toString(16).padStart(2, '0')) +
    (objVR.votePrepareDays.toString(16).padStart(2, '0')) +
    (objVR.votingDays.toString(16).padStart(2, '0')) +
    (objVR.execDaysForPutOpt.toString(16).padStart(2, '0')) +
    (objVR.vetoers[0].toString(16).padStart(10, '0')) +
    (objVR.vetoers[1].toString(16).padStart(10, '0')) +
    '0000' 
  }`;

  const authorities:string[] = ['Null', 'GeneralMeeting', 'Board', 'Board & GeneralMeeting'];

  const [ newHexVR, setNewHexVR ] = useState<HexType>(Bytes32Zero);

  let newVR: VotingRule = {
    seqOfRule: parseInt(newHexVR.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(newHexVR.substring(6, 8), 16),
    seqOfSubRule: parseInt(newHexVR.substring(8, 10), 16),
    authority: parseInt(newHexVR.substring(10, 14), 16),
    headRatio: parseInt(newHexVR.substring(14, 18), 16),
    amountRatio: parseInt(newHexVR.substring(18, 22), 16),
    onlyAttendance: newHexVR.substring(22, 24) === '01',
    impliedConsent: newHexVR.substring(24, 26) === '01',
    partyAsConsent: newHexVR.substring(26, 28) === '01',
    againstShallBuy: newHexVR.substring(28, 30) === '01',
    shaExecDays: parseInt(newHexVR.substring(30, 32), 16),
    reviewDays: parseInt(newHexVR.substring(32, 34), 16),
    reconsiderDays: parseInt(newHexVR.substring(34, 36), 16),
    votePrepareDays: parseInt(newHexVR.substring(36, 38), 16),
    votingDays: parseInt(newHexVR.substring(38, 40), 16),
    execDaysForPutOpt: parseInt(newHexVR.substring(40, 42), 16),
    vetoers: [parseInt(newHexVR.substring(42, 52), 16), parseInt(newHexVR.substring(52, 62), 16)],
    para: 0,
  } 

  // console.log('newVR: ', newVR);

  const [ editable, setEditable ] = useState<boolean>(false); 

  return (
    <Paper sx={{
      alignContent:'center', 
      justifyContent:'center', 
      p:1, m:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
      <Box sx={{ width:1680 }}>

        <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >        
          <Box sx={{ minWidth:600 }} >
            <Toolbar>
              <h4>Rule No. { seq.toString() }  { defaultRule.subTitle } </h4>
            </Toolbar>
          </Box>

          <AddRule 
            sha={ sha } 
            rule={ hexVR } 
            setUpdatedRule={ setNewHexVR } 
            editable={ editable } 
            setEditable={ setEditable } 
            finalized={ finalized }
          />
          
        </Stack>

        <Stack 
          direction={'column'} 
          spacing={1} 
        >

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >
            {newVR?.seqOfRule != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newVR.seqOfRule.toString() }
              />
            )}

            {newVR?.qtyOfSubRule != undefined && (
              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newVR.qtyOfSubRule.toString() }
              />
            )}

            {newVR?.authority != undefined && (
              <TextField 
                variant='filled'
                label='Authority'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ authorities[newVR.authority] }
              />
            )}

            <TextField 
              variant='filled'
              label='HeadRatio'
              inputProps={{readOnly: true}}
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={toPercent(newVR?.headRatio ?? 0)}
            />

            <TextField 
              variant='filled'
              label='AmountRatio'
              inputProps={{readOnly: true}}
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={toPercent(newVR?.amountRatio ?? 0)}
            />

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
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  seqOfRule: parseInt(e.target.value),
                  }))
                }
                
                value={ objVR?.seqOfRule }
              />

              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  qtyOfSubRule: parseInt(e.target.value),
                }))}
                value={ objVR?.qtyOfSubRule } 
              />

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="authority-label">Authority</InputLabel>
                <Select
                  labelId="authority-label"
                  id="authority-select"
                  value={ objVR?.authority }
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    authority: parseInt(e.target.value.toString()),
                  }))}
                  label="Authority"
                >
                  <MenuItem value={1}>GeneralMeeting</MenuItem>
                  <MenuItem value={2}>Board</MenuItem>
                  <MenuItem value={3}>Board & GeneralMeeting</MenuItem>
                </Select>
              </FormControl>

              <TextField 
                variant='filled'
                label='HeadRaio'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  headRatio: parseInt(e.target.value),
                }))}
                value={ objVR?.headRatio }              
              />

              <TextField 
                variant='filled'
                label='AmountRatio'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  amountRatio: parseInt(e.target.value),
                }))}
                value={ objVR?.amountRatio }
              />

            </Stack>
          </Collapse>

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            {newVR?.onlyAttendance != undefined && (
              <TextField 
                variant='filled'
                label='OnlyAttendance ?'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.onlyAttendance ? 'True' : 'False'}
              />
            )}

            {newVR?.impliedConsent != undefined && (
              <TextField 
                variant='filled'
                label='ImpliedConsent ?'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.impliedConsent ? 'True' : 'False'}
              />
            )}

            {newVR?.partyAsConsent != undefined && (
              <TextField 
                variant='filled'
                label='PartyAsConsent ?'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.partyAsConsent ? 'True' : 'False'}
              />
            )}

            {newVR?.againstShallBuy != undefined && (
              <TextField 
                variant='filled'
                label='AgainstShallBuy ?'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.againstShallBuy ? 'True' : 'False'}
              />
            )}

            {newVR?.vetoers[0] != undefined && (
              <TextField 
                variant='filled'
                label='Vetoer_1'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.vetoers[0].toString()}
              />
            )}

            {newVR?.vetoers[1] != undefined && (
              <TextField 
                variant='filled'
                label='Vetoer_2'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.vetoers[1].toString()}
              />
            )}

          </Stack>

          <Collapse in={ editable && !finalized } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="onlyAttendance-label">OnlyAttendance ?</InputLabel>
                <Select
                  labelId="onlyAttendance-label"
                  id="onlyAttendance-select"
                  value={ objVR?.onlyAttendance ? '1' : '0' }
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    onlyAttendance: e.target.value == '1',
                  }))}

                  label="OnlyAttendance ?"
                >
                  <MenuItem value={ '1' } > True </MenuItem>
                  <MenuItem value={ '0' } > False </MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="impliedConsent-label">ImpliedConsent ?</InputLabel>
                <Select
                  labelId="impliedConsent-label"
                  id="impliedConsent-select"
                  value={ objVR?.impliedConsent ? '1' : '0' }
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    impliedConsent: e.target.value == '1',
                  }))}

                  label="ImpliedConsent ?"
                >
                  <MenuItem value={ '1' } > True </MenuItem>
                  <MenuItem value={ '0' } > False </MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="partyAsConsent-label">PartyAsConsent ?</InputLabel>
                <Select
                  labelId="partyAsConsent-label"
                  id="partyAsConsent-select"
                  value={ objVR?.partyAsConsent ? '1' : '0' }
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    partyAsConsent: e.target.value == '1',
                  }))}

                  label="PartyAsConsent ?"
                >
                  <MenuItem value={ '1' } > True </MenuItem>
                  <MenuItem value={ '0' } > False </MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="againstShallBuy-label">AgainstShallBuy ?</InputLabel>
                <Select
                  labelId="againstShallBuy-label"
                  id="againstShallBuy-select"
                  value={ objVR?.againstShallBuy ? '1' : '0' }
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    againstShallBuy: e.target.value == '1',
                  }))}

                  label="AgainstShallBuy ?"
                >
                  <MenuItem value={ '1' } > True </MenuItem>
                  <MenuItem value={ '0' } > False </MenuItem>
                </Select>
              </FormControl>

              <TextField 
                variant='filled'
                label='Vetoer_1'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  vetoers1: parseInt(e.target.value),
                }))}
                value={ objVR?.vetoers[0]}   
              />

              <TextField 
                variant='filled'
                label='Vetoer_2'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  vetoers2: parseInt(e.target.value),
                }))}
                value={ objVR?.vetoers[1]}
              />

            </Stack>
          </Collapse>

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >



            {newVR?.shaExecDays != undefined && (
              <TextField 
                variant='filled'
                label='ShaExecDays'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.shaExecDays.toString()}
              />
            )}

            {newVR?.reviewDays != undefined && (
              <TextField 
                variant='filled'
                label='ReviewDays'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.reviewDays.toString()}
              />
            )}

            {newVR?.reconsiderDays != undefined && (
              <TextField 
                variant='filled'
                label='ReconsiderDays'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.reconsiderDays.toString()}
              />
            )}

            {newVR?.votePrepareDays != undefined && (
              <TextField 
                variant='filled'
                label='VotePrepareDays'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.votePrepareDays.toString()}
              />
            )}

            {newVR?.votingDays != undefined && (
              <TextField 
                variant='filled'
                label='VotingDays'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.votingDays.toString()}
              />
            )}


            {newVR?.execDaysForPutOpt != undefined && (
              <TextField 
                variant='filled'
                label='ExecDaysForPutOpt'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.execDaysForPutOpt.toString()}
              />
            )}


          </Stack>

          <Collapse in={ editable && !finalized } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

              <TextField 
                variant='filled'
                label='ShaExecDays'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  shaExecDays: parseInt(e.target.value),
                }))}
                value={ objVR?.shaExecDays}                                        
              />

              <TextField 
                variant='filled'
                label='ReviewDays'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  reviewDays: parseInt(e.target.value),
                }))}
                value={ objVR?.reviewDays}                                        
              />

              <TextField 
                variant='filled'
                label='ReconsiderDays'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  reconsiderDays: parseInt(e.target.value),
                }))}
                value={ objVR?.reconsiderDays}                                        
              />

              <TextField 
                variant='filled'
                label='VotePrepareDays'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  votePrepareDays: parseInt(e.target.value),
                }))}
                value={ objVR?.votePrepareDays}                                        
              />

              <TextField 
                variant='filled'
                label='VotingDays'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  votingDays: parseInt(e.target.value),
                }))}
                value={ objVR?.votingDays}                                        
              />

              <TextField 
                variant='filled'
                label='ExecDaysForPutOpt'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  execDaysForPutOpt: parseInt(e.target.value),
                }))}
                value={ objVR?.execDaysForPutOpt}                                        
              />

            </Stack>
          </Collapse>


        </Stack>
    
      </Box>
    </Paper>
  )
}
