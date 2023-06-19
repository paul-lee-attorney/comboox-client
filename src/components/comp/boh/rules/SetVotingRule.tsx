
import { useState } from 'react';

import { 
  Stack,
  TextField,
  Paper,
  Toolbar,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
} from '@mui/material';

import { AddRule } from './AddRule';

import { Bytes32Zero, HexType } from '../../../../interfaces';
import { longSnParser, toPercent } from '../../../../scripts/toolsKit';
import { VotingRuleWrap } from './VotingRules';

interface SetVotingRuleProps {
  sha: HexType,
  defaultRule: VotingRuleWrap,
  seq: number,
  finalized: boolean,
}

export interface VotingRule {
  seqOfRule: number;
  qtyOfSubRule: number;
  seqOfSubRule: number;
  authority: number;
  headRatio: number;
  amountRatio: number;
  onlyAttendance: boolean;
  impliedConsent: boolean;
  partyAsConsent: boolean;
  againstShallBuy: boolean;
  shaExecDays: number;
  shaConfirmDays: number;
  reconsiderDays: number;
  votePrepareDays: number;
  votingDays: number;
  execDaysForPutOpt: number;
  vetoers: readonly number[];
  para: number;
}

export function vrParser(hexVr: HexType):VotingRule {
  let rule: VotingRule = {
    seqOfRule: parseInt(hexVr.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(hexVr.substring(6, 8), 16),
    seqOfSubRule: parseInt(hexVr.substring(8, 10), 16),
    authority: parseInt(hexVr.substring(10, 14), 16),
    headRatio: parseInt(hexVr.substring(14, 18), 16),
    amountRatio: parseInt(hexVr.substring(18, 22), 16),
    onlyAttendance: hexVr.substring(22, 24) === '01',
    impliedConsent: hexVr.substring(24, 26) === '01',
    partyAsConsent: hexVr.substring(26, 28) === '01',
    againstShallBuy: hexVr.substring(28, 30) === '01',
    shaExecDays: parseInt(hexVr.substring(30, 32), 16),
    shaConfirmDays: parseInt(hexVr.substring(32, 34), 16),
    reconsiderDays: parseInt(hexVr.substring(34, 36), 16),
    votePrepareDays: parseInt(hexVr.substring(36, 38), 16),
    votingDays: parseInt(hexVr.substring(38, 40), 16),
    execDaysForPutOpt: parseInt(hexVr.substring(40, 42), 16),
    vetoers: [parseInt(hexVr.substring(42, 52), 16), parseInt(hexVr.substring(52, 62), 16)],
    para: 0,    
  }
  return rule;
}

export function vrCodifier(objVr: VotingRule ): HexType {
  let hexVr: HexType = `0x${
    (objVr.seqOfRule.toString(16).padStart(4, '0')) +
    (objVr.qtyOfSubRule.toString(16).padStart(2, '0')) +
    (objVr.seqOfSubRule.toString(16).padStart(2, '0')) +
    (objVr.authority.toString(16).padStart(4, '0')) +
    (objVr.headRatio.toString(16).padStart(4, '0')) +
    (objVr.amountRatio.toString(16).padStart(4, '0')) +
    (objVr.onlyAttendance ? '01' : '00' )+
    (objVr.impliedConsent ? '01' : '00' )+
    (objVr.partyAsConsent ? '01' : '00' )+
    (objVr.againstShallBuy ? '01' : '00' )+
    (objVr.shaExecDays.toString(16).padStart(2, '0')) +
    (objVr.shaConfirmDays.toString(16).padStart(2, '0')) +
    (objVr.reconsiderDays.toString(16).padStart(2, '0')) +
    (objVr.votePrepareDays.toString(16).padStart(2, '0')) +
    (objVr.votingDays.toString(16).padStart(2, '0')) +
    (objVr.execDaysForPutOpt.toString(16).padStart(2, '0')) +
    (objVr.vetoers[0].toString(16).padStart(10, '0')) +
    (objVr.vetoers[1].toString(16).padStart(10, '0')) +
    '0000' 
  }`;
  return hexVr;
}

export const authorities:string[] = ['GeneralMeeting', 'Board'];
  
export function SetVotingRule({ sha, defaultRule, seq, finalized }: SetVotingRuleProps) {

  const defVrWrap: VotingRuleWrap = defaultRule 
        ? defaultRule
        : { subTitle: '- newly Added Rule ',
            votingRule: {
              seqOfRule: seq, 
              qtyOfSubRule: seq, 
              seqOfSubRule: seq,
              authority: 1,
              headRatio: 0,
              amountRatio: 0,
              onlyAttendance: false,
              impliedConsent: false,
              partyAsConsent: true,
              againstShallBuy: false,
              shaExecDays: 15,
              shaConfirmDays: 15,
              reconsiderDays: 0,
              votePrepareDays: 0,
              votingDays: 1,
              execDaysForPutOpt: 0,
              vetoers: [0,0],
              para: 0,
            },
          };

  const [ objVR, setObjVR ] = useState<VotingRule>(defVrWrap.votingRule); 

  let hexVR: HexType = vrCodifier(objVR);

  const [ newHexVR, setNewHexVR ] = useState<HexType>(Bytes32Zero);

  let newVR: VotingRule = vrParser(newHexVR);

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
              <h4>Rule No. { seq.toString() }  { defVrWrap.subTitle } </h4>
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
                defaultValue={ authorities[0] }
                value={ authorities[newVR.authority - 1] }
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
                  seqOfRule: parseInt(e.target.value ?? '0'),
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
                value={ longSnParser(newVR.vetoers[0].toString()) }
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
                value={ longSnParser(newVR.vetoers[1].toString())}
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
                onChange={(e) => setObjVR((v) => {
                  let arr = [...v.vetoers];
                  arr[0] = parseInt(e.target.value ?? '0');
                  return {...v, vetoers:arr};
                })}
                value={ objVR?.vetoers[0]}   
              />

              <TextField 
                variant='filled'
                label='Vetoer_2'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => {
                  let arr = [...v.vetoers];
                  arr[1] = parseInt(e.target.value ?? '0');
                  return {...v, vetoers:arr};
                })}
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

            {newVR?.shaConfirmDays != undefined && (
              <TextField 
                variant='filled'
                label='ShaConfirmDays'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={newVR.shaConfirmDays.toString()}
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
                  shaExecDays: parseInt(e.target.value ?? '0'),
                }))}
                value={ objVR?.shaExecDays}                                        
              />

              <TextField 
                variant='filled'
                label='ShaConfirmDays'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjVR((v) => ({
                  ...v,
                  shaConfirmDays: parseInt(e.target.value ?? '0'),
                }))}
                value={ objVR?.shaConfirmDays}                                        
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
                  reconsiderDays: parseInt(e.target.value ?? '0'),
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
                  votePrepareDays: parseInt(e.target.value ?? '0'),
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
                  votingDays: parseInt(e.target.value ?? '0'),
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
                  execDaysForPutOpt: parseInt(e.target.value ?? '0'),
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
