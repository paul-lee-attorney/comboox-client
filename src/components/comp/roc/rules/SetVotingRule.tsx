
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
  Button,
  DialogContent,
  DialogActions,
  Dialog,
} from '@mui/material';

import { AddRule } from './AddRule';

import { HexType } from '../../../../scripts/common';
import { longSnParser, toPercent } from '../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { useShareholdersAgreementGetRule } from '../../../../generated';

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
  frExecDays: number;
  dtExecDays: number;
  dtConfirmDays: number;
  invExitDays: number;
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
    authority: parseInt(hexVr.substring(10, 12), 16),
    headRatio: parseInt(hexVr.substring(12, 16), 16),
    amountRatio: parseInt(hexVr.substring(16, 20), 16),
    onlyAttendance: hexVr.substring(20, 22) === '01',
    impliedConsent: hexVr.substring(22, 24) === '01',
    partyAsConsent: hexVr.substring(24, 26) === '01',
    againstShallBuy: hexVr.substring(26, 28) === '01',
    frExecDays: parseInt(hexVr.substring(28, 30), 16),
    dtExecDays: parseInt(hexVr.substring(30, 32), 16),
    dtConfirmDays: parseInt(hexVr.substring(32, 34), 16),
    invExitDays: parseInt(hexVr.substring(34, 36), 16),
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
    (objVr.authority.toString(16).padStart(2, '0')) +
    (objVr.headRatio.toString(16).padStart(4, '0')) +
    (objVr.amountRatio.toString(16).padStart(4, '0')) +
    (objVr.onlyAttendance ? '01' : '00' )+
    (objVr.impliedConsent ? '01' : '00' )+
    (objVr.partyAsConsent ? '01' : '00' )+
    (objVr.againstShallBuy ? '01' : '00' )+
    (objVr.frExecDays.toString(16).padStart(2, '0')) +
    (objVr.dtExecDays.toString(16).padStart(2, '0')) +
    (objVr.dtConfirmDays.toString(16).padStart(2, '0')) +
    (objVr.invExitDays.toString(16).padStart(2, '0')) +
    (objVr.votePrepareDays.toString(16).padStart(2, '0')) +
    (objVr.votingDays.toString(16).padStart(2, '0')) +
    (objVr.execDaysForPutOpt.toString(16).padStart(2, '0')) +
    (objVr.vetoers[0].toString(16).padStart(10, '0')) +
    (objVr.vetoers[1].toString(16).padStart(10, '0')) +
    '0000' 
  }`;
  return hexVr;
}

export const authorities:string[] = ['ShareholdersMeeting', 'Board'];

const subTitles: string[] = [
  '- Issue New Share (i.e. Capital Increase "CI")',
  '- Transfer Share to External Invester (i.e. External Transfer "EXT")',
  '- Transfer Share to Other Shareholders (i.e. Internal Transfer "INT")',
  '- Capital Increase and Internal Transfer (i.e. CI & INT)',
  '- Internal and External Transfer (i.e. EXT & INT)',
  '- Capital Increase, External Transfer and Internal Transfer (i.e. CI & EXT & INT)',
  '- Capital Increase and External Transfer (i.e. CI & EXT) ',
  "- Approve Shareholders' Agreement",
  '- Ordinary resolution of Shareholders Meeting',
  '- Special resolution of Shareholders Meeting',
  '- Ordinary resolution of Board Meeting',
  '- Special resolution of Board Meeting',
  '- Newly added Rule'
]

const defaultRules: VotingRule[] = [
  { seqOfRule: 1, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 1,
    authority: 1,
    headRatio: 0,
    amountRatio: 6667,
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: 15,
    dtExecDays: 8,
    dtConfirmDays: 7,
    invExitDays: 14,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 2, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 2,
    authority: 1,
    headRatio: 0,
    amountRatio: 5000,
    onlyAttendance: false,
    impliedConsent: true,
    partyAsConsent: false,
    againstShallBuy: true,
    frExecDays: 15,
    dtExecDays: 8,
    dtConfirmDays: 7,
    invExitDays: 14,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 3, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 3,
    authority: 1,
    headRatio: 0,
    amountRatio: 0,
    onlyAttendance: false,
    impliedConsent: true,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: 0,
    dtExecDays: 0,
    dtConfirmDays: 1,
    invExitDays: 0,
    votePrepareDays: 0,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0, 0],
    para: 0,
  },
  { seqOfRule: 4, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 4,
    authority: 1,
    headRatio: 0,
    amountRatio: 6667,
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: 15,
    dtExecDays: 8,
    dtConfirmDays: 7,
    invExitDays: 14,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 5, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 5,
    authority: 1,
    headRatio: 0,
    amountRatio: 5000,
    onlyAttendance: false,
    impliedConsent: true,
    partyAsConsent: false,
    againstShallBuy: true,
    frExecDays: 15,
    dtExecDays: 8,
    dtConfirmDays: 7,
    invExitDays: 14,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 6, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 6,
    authority: 1,
    headRatio: 0,
    amountRatio: 6667,
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: 15,
    dtExecDays: 8,
    dtConfirmDays: 7,
    invExitDays: 14,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 7, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 7,
    authority: 1,
    headRatio: 0,
    amountRatio: 6667,
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: 15,
    dtExecDays: 8,
    dtConfirmDays: 7,
    invExitDays: 14,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 8, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 8,
    authority: 1,
    headRatio: 0,
    amountRatio: 6667,
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: 0,
    dtExecDays: 0,
    dtConfirmDays: 0,
    invExitDays: 29,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 9, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 9,
    authority: 1,
    headRatio: 0,
    amountRatio: 5000,
    onlyAttendance: true,
    impliedConsent: false,
    partyAsConsent: false,
    againstShallBuy: false,
    frExecDays: 0,
    dtExecDays: 0,
    dtConfirmDays: 0,
    invExitDays: 29,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 10, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 10,
    authority: 1,
    headRatio: 0,
    amountRatio: 6667,
    onlyAttendance: true,
    impliedConsent: false,
    partyAsConsent: false,
    againstShallBuy: false,
    frExecDays: 0,
    dtExecDays: 0,
    dtConfirmDays: 0,
    invExitDays: 29,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 11, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 11,
    authority: 2,
    headRatio: 5000,
    amountRatio: 0,
    onlyAttendance: true,
    impliedConsent: false,
    partyAsConsent: false,
    againstShallBuy: false,
    frExecDays: 0,
    dtExecDays: 0,
    dtConfirmDays: 0,
    invExitDays: 9,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  },
  { seqOfRule: 12, 
    qtyOfSubRule: 12, 
    seqOfSubRule: 12,
    authority: 2,
    headRatio: 6667,
    amountRatio: 0,
    onlyAttendance: true,
    impliedConsent: false,
    partyAsConsent: false,
    againstShallBuy: false,
    frExecDays: 0,
    dtExecDays: 0,
    dtConfirmDays: 0,
    invExitDays: 9,
    votePrepareDays: 1,
    votingDays: 1,
    execDaysForPutOpt: 0,
    vetoers: [0,0],
    para: 0,
  }
]

export interface SetRuleProps {
  sha: HexType;
  seq: number;
  isFinalized: boolean;
  getRules: ()=>void;
}

export function SetVotingRule({ sha, seq, isFinalized, getRules }: SetRuleProps) {

  const defVR: VotingRule =
      { seqOfRule: seq, 
        qtyOfSubRule: seq, 
        seqOfSubRule: seq,
        authority: 1,
        headRatio: 0,
        amountRatio: 0,
        onlyAttendance: false,
        impliedConsent: false,
        partyAsConsent: true,
        againstShallBuy: false,
        frExecDays: 0,
        dtExecDays: 0,
        dtConfirmDays: 0,
        invExitDays: 0,
        votePrepareDays: 0,
        votingDays: 0,
        execDaysForPutOpt: 0,
        vetoers: [0,0],
        para: 0,
      };

  let subTitle: string = (seq < 13) ? subTitles[seq - 1] : subTitles[12];

  const [ objVR, setObjVR ] = useState<VotingRule>(seq < 13 ? defaultRules[seq - 1] : defVR); 

  const [ newVR, setNewVR ] = useState<VotingRule>(defVR);

  const [ editable, setEditable ] = useState<boolean>(false);
  
  const [ open, setOpen ] = useState(false);


  const {
    refetch: obtainRule
  } = useShareholdersAgreementGetRule({
    address: sha,
    args: [ BigInt(seq) ],
    onSuccess(res) {
      setNewVR(vrParser(res))
    }
  })

  return (
    <>
      <Button
        // disabled={ !newGR }
        variant={ newVR.seqOfRule == seq ? 'contained' : 'outlined' }
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
              <Box sx={{ width:1680 }}>

                <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >        
                  <Box sx={{ minWidth:600 }} >
                    <Toolbar sx={{ textDecoration:'underline' }} >
                      <h4>Rule No. { seq } { subTitle } </h4>
                    </Toolbar>
                  </Box>

                  <AddRule 
                    sha={ sha } 
                    rule={ vrCodifier(objVR) } 
                    refreshRule={ obtainRule } 
                    editable={ editable } 
                    setEditable={ setEditable } 
                    isFinalized={ isFinalized }
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
                      value={ newVR.seqOfRule.toString() }
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
                      value={ newVR.qtyOfSubRule.toString() }
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='Authority'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      placeholder='Authority'
                      value={ authorities[(newVR.authority > 0 ? newVR.authority : 1) - 1] }
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='HeadRatio'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={toPercent(newVR.headRatio)}
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='AmountRatio'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={toPercent(newVR.amountRatio)}
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='ExecDaysForPutOpt'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newVR.execDaysForPutOpt.toString()}
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
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          seqOfRule: parseInt(e.target.value),
                          }))
                        }
                        
                        value={ objVR.seqOfRule }
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='QtyOfSubRule'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          qtyOfSubRule: parseInt(e.target.value),
                        }))}
                        value={ objVR.qtyOfSubRule } 
                      />

                      <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="authority-label">Authority</InputLabel>
                        <Select
                          labelId="authority-label"
                          id="authority-select"
                          label="Authority"
                          value={ objVR.authority }
                          onChange={(e) => setObjVR((v) => ({
                            ...v,
                            authority: parseInt( e.target.value.toString() ),
                          }))}
                        >
                          <MenuItem value={'1'}>ShareholdersMeeting</MenuItem>
                          <MenuItem value={'2'}>BoardMeeting</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='HeadRaio'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          headRatio: parseInt(e.target.value),
                        }))}
                        value={ objVR.headRatio }              
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='AmountRatio'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          amountRatio: parseInt( e.target.value),
                        }))}
                        value={ objVR.amountRatio }
                        
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='ExecDaysForPutOpt'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          execDaysForPutOpt: parseInt(e.target.value),
                        }))}
                        value={ objVR.execDaysForPutOpt}                                        
                      />


                    </Stack>
                  </Collapse>

                  <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='OnlyAttendance ?'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ newVR.onlyAttendance ? 'True' : 'False' }
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='ImpliedConsent ?'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ newVR.impliedConsent ? 'True' : 'False' }
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='PartyAsConsent ?'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ newVR.partyAsConsent ? 'True' : 'False' }
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='AgainstShallBuy ?'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newVR.againstShallBuy ? 'True' : 'False'}
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='Vetoer_1'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ longSnParser(newVR.vetoers[0].toString() ?? '0') }
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='Vetoer_2'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ longSnParser(newVR.vetoers[1].toString() ?? '0')}
                    />

                  </Stack>

                  <Collapse in={ editable && !isFinalized } >
                    <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                      <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="onlyAttendance-label">OnlyAttendance ?</InputLabel>
                        <Select
                          labelId="onlyAttendance-label"
                          id="onlyAttendance-select"
                          label="OnlyAttendance ?"
                          value={ objVR.onlyAttendance ? '1' : '0' }
                          onChange={(e) => setObjVR((v) => ({
                            ...v,
                            onlyAttendance: e.target.value == '1',
                          }))}
                        >
                          <MenuItem value={ '1' } > True </MenuItem>
                          <MenuItem value={ '0' } > False </MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="impliedConsent-label">ImpliedConsent ?</InputLabel>
                        <Select
                          labelId="impliedConsent-label"
                          id="impliedConsent-select"
                          label="ImpliedConsent ?"
                          value={ objVR.impliedConsent ? '1' : '0' }
                          onChange={(e) => setObjVR((v) => ({
                            ...v,
                            impliedConsent: e.target.value == '1',
                          }))}
                        >
                          <MenuItem value={ '1' } > True </MenuItem>
                          <MenuItem value={ '0' } > False </MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="partyAsConsent-label">PartyAsConsent ?</InputLabel>
                        <Select
                          labelId="partyAsConsent-label"
                          id="partyAsConsent-select"
                          label="PartyAsConsent ?"
                          value={ objVR.partyAsConsent ? '1' : '0' }
                          onChange={(e) => setObjVR((v) => ({
                            ...v,
                            partyAsConsent: e.target.value == '1',
                          }))}
                        >
                          <MenuItem value={ '1' } > True </MenuItem>
                          <MenuItem value={ '0' } > False </MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="againstShallBuy-label">AgainstShallBuy ?</InputLabel>
                        <Select
                          labelId="againstShallBuy-label"
                          id="againstShallBuy-select"
                          label="AgainstShallBuy ?"
                          value={ objVR.againstShallBuy ? '1' : '0' }
                          onChange={(e) => setObjVR((v) => ({
                            ...v,
                            againstShallBuy: e.target.value == '1',
                          }))}
                        >
                          <MenuItem value={ '1' } > True </MenuItem>
                          <MenuItem value={ '0' } > False </MenuItem>
                        </Select>
                      </FormControl>

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='Vetoer_1'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => {
                          let arr = [...v.vetoers];
                          arr[0] = parseInt(e.target.value);
                          return {...v, vetoers:arr};
                        })}
                        value={ objVR.vetoers[0]}   
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='Vetoer_2'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => {
                          let arr = [...v.vetoers];
                          arr[1] = parseInt(e.target.value);
                          return {...v, vetoers:arr};
                        })}
                        value={ objVR.vetoers[1]}
                      />

                    </Stack>
                  </Collapse>

                  <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='FRExecDays'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newVR.frExecDays.toString()}
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='DTExecDays'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newVR.dtExecDays.toString()}
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='DTConfirmDays'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newVR.dtConfirmDays.toString()}
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='InvExitDays'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newVR.invExitDays.toString()}
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='VotePrepareDays'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newVR.votePrepareDays.toString()}
                    />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='VotingDays'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newVR.votingDays.toString()}
                    />

                  </Stack>

                  <Collapse in={ editable && !isFinalized } >
                    <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='FRExecDays'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          frExecDays: parseInt(e.target.value),
                        }))}
                        value={ objVR.frExecDays}                                        
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='DTExecDays'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          dtExecDays: parseInt(e.target.value),
                        }))}
                        value={ objVR.dtExecDays}                                        
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='DTConfirmDays'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          dtConfirmDays: parseInt(e.target.value),
                        }))}
                        value={ objVR.dtConfirmDays}                                        
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='InvExitDays'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          invExitDays: parseInt(e.target.value),
                        }))}
                        value={ objVR.invExitDays}                                        
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='VotePrepareDays'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          votePrepareDays: parseInt(e.target.value),
                        }))}
                        value={ objVR.votePrepareDays}                                        
                      />

                      <TextField 
                        variant='outlined'
                        size='small'
                        label='VotingDays'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjVR((v) => ({
                          ...v,
                          votingDays: parseInt(e.target.value),
                        }))}
                        value={ objVR.votingDays}                                        
                      />

                    </Stack>
                  </Collapse>

                </Stack>
            
              </Box>
            </Paper>

        </DialogContent>

        <DialogActions>
          <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>
    </>
  );
}
