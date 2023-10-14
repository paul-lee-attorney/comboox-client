
import { useEffect, useState } from 'react';
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
  Button,
  DialogContent,
  DialogActions,
  Dialog,
} from '@mui/material';
import { AddRule } from '../AddRule';
import { HexType } from '../../../../../scripts/common';
import { longSnParser, onlyNum, toPercent } from '../../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { RulesEditProps } from '../GovernanceRules/SetGovernanceRule';
import { getRule } from '../../../../../scripts/comp/sha';

// ==== Str Interface ====

export interface StrVotingRule {
  seqOfRule: string;
  qtyOfSubRule: string;
  seqOfSubRule: string;
  authority: string;
  headRatio: string;
  amountRatio: string;
  onlyAttendance: boolean;
  impliedConsent: boolean;
  partyAsConsent: boolean;
  againstShallBuy: boolean;
  frExecDays: string;
  dtExecDays: string;
  dtConfirmDays: string;
  invExitDays: string;
  votePrepareDays: string;
  votingDays: string;
  execDaysForPutOpt: string;
  vetoers: readonly string[];
  para: string;
}

export function strVRParser(hexVr: HexType):StrVotingRule {
  let rule: StrVotingRule = {
    seqOfRule: parseInt(hexVr.substring(2, 6), 16).toString(), 
    qtyOfSubRule: parseInt(hexVr.substring(6, 8), 16).toString(),
    seqOfSubRule: parseInt(hexVr.substring(8, 10), 16).toString(),
    authority: parseInt(hexVr.substring(10, 12), 16).toString(),
    headRatio: parseInt(hexVr.substring(12, 16), 16).toString(),
    amountRatio: parseInt(hexVr.substring(16, 20), 16).toString(),
    onlyAttendance: hexVr.substring(20, 22) === '01',
    impliedConsent: hexVr.substring(22, 24) === '01',
    partyAsConsent: hexVr.substring(24, 26) === '01',
    againstShallBuy: hexVr.substring(26, 28) === '01',
    frExecDays: parseInt(hexVr.substring(28, 30), 16).toString(),
    dtExecDays: parseInt(hexVr.substring(30, 32), 16).toString(),
    dtConfirmDays: parseInt(hexVr.substring(32, 34), 16).toString(),
    invExitDays: parseInt(hexVr.substring(34, 36), 16).toString(),
    votePrepareDays: parseInt(hexVr.substring(36, 38), 16).toString(),
    votingDays: parseInt(hexVr.substring(38, 40), 16).toString(),
    execDaysForPutOpt: parseInt(hexVr.substring(40, 42), 16).toString(),
    vetoers: [parseInt(hexVr.substring(42, 52), 16).toString(), parseInt(hexVr.substring(52, 62), 16).toString()],
    para: '0',    
  }
  return rule;
}

export function strVRCodifier(objVr: StrVotingRule ): HexType {
  let hexVr: HexType = `0x${
    (Number(objVr.seqOfRule).toString(16).padStart(4, '0')) +
    (Number(objVr.qtyOfSubRule).toString(16).padStart(2, '0')) +
    (Number(objVr.seqOfSubRule).toString(16).padStart(2, '0')) +
    (Number(objVr.authority).toString(16).padStart(2, '0')) +
    (Number(objVr.headRatio).toString(16).padStart(4, '0')) +
    (Number(objVr.amountRatio).toString(16).padStart(4, '0')) +
    (objVr.onlyAttendance ? '01' : '00' )+
    (objVr.impliedConsent ? '01' : '00' )+
    (objVr.partyAsConsent ? '01' : '00' )+
    (objVr.againstShallBuy ? '01' : '00' )+
    (Number(objVr.frExecDays).toString(16).padStart(2, '0')) +
    (Number(objVr.dtExecDays).toString(16).padStart(2, '0')) +
    (Number(objVr.dtConfirmDays).toString(16).padStart(2, '0')) +
    (Number(objVr.invExitDays).toString(16).padStart(2, '0')) +
    (Number(objVr.votePrepareDays).toString(16).padStart(2, '0')) +
    (Number(objVr.votingDays).toString(16).padStart(2, '0')) +
    (Number(objVr.execDaysForPutOpt).toString(16).padStart(2, '0')) +
    (Number(objVr.vetoers[0]).toString(16).padStart(10, '0')) +
    (Number(objVr.vetoers[1]).toString(16).padStart(10, '0')) +
    '0000' 
  }`;
  return hexVr;
}

const strDefaultRules: StrVotingRule[] = [
  { seqOfRule: '1',
    qtyOfSubRule: '12', 
    seqOfSubRule: '1',
    authority: '1',
    headRatio: '0',
    amountRatio: '6667',
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: '15',
    dtExecDays: '8',
    dtConfirmDays: '7',
    invExitDays: '14',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '2', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '2',
    authority: '1',
    headRatio: '0',
    amountRatio: '5000',
    onlyAttendance: false,
    impliedConsent: true,
    partyAsConsent: false,
    againstShallBuy: true,
    frExecDays: '15',
    dtExecDays: '8',
    dtConfirmDays: '7',
    invExitDays: '14',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '3', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '3',
    authority: '1',
    headRatio: '0',
    amountRatio: '0',
    onlyAttendance: false,
    impliedConsent: true,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: '0',
    dtExecDays: '0',
    dtConfirmDays: '1',
    invExitDays: '0',
    votePrepareDays: '0',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0',' 0'],
    para: '0',
  },
  { seqOfRule: '4', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '4',
    authority: '1',
    headRatio: '0',
    amountRatio: '6667',
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: '15',
    dtExecDays: '8',
    dtConfirmDays: '7',
    invExitDays: '14',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '5', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '5',
    authority: '1',
    headRatio: '0',
    amountRatio: '5000',
    onlyAttendance: false,
    impliedConsent: true,
    partyAsConsent: false,
    againstShallBuy: true,
    frExecDays: '15',
    dtExecDays: '8',
    dtConfirmDays: '7',
    invExitDays: '14',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '6', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '6',
    authority: '1',
    headRatio: '0',
    amountRatio: '6667',
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: '15',
    dtExecDays: '8',
    dtConfirmDays: '7',
    invExitDays: '14',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '7', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '7',
    authority: '1',
    headRatio: '0',
    amountRatio: '6667',
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: '15',
    dtExecDays: '8',
    dtConfirmDays: '7',
    invExitDays: '14',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '8', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '8',
    authority: '1',
    headRatio: '0',
    amountRatio: '6667',
    onlyAttendance: false,
    impliedConsent: false,
    partyAsConsent: true,
    againstShallBuy: false,
    frExecDays: '0',
    dtExecDays: '0',
    dtConfirmDays: '0',
    invExitDays: '29',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '9', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '9',
    authority: '1',
    headRatio: '0',
    amountRatio: '5000',
    onlyAttendance: true,
    impliedConsent: false,
    partyAsConsent: false,
    againstShallBuy: false,
    frExecDays: '0',
    dtExecDays: '0',
    dtConfirmDays: '0',
    invExitDays: '29',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '10', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '10',
    authority: '1',
    headRatio: '0',
    amountRatio: '6667',
    onlyAttendance: true,
    impliedConsent: false,
    partyAsConsent: false,
    againstShallBuy: false,
    frExecDays: '0',
    dtExecDays: '0',
    dtConfirmDays: '0',
    invExitDays: '29',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '11', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '11',
    authority: '2',
    headRatio: '5000',
    amountRatio: '0',
    onlyAttendance: true,
    impliedConsent: false,
    partyAsConsent: false,
    againstShallBuy: false,
    frExecDays: '0',
    dtExecDays: '0',
    dtConfirmDays: '0',
    invExitDays: '9',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  },
  { seqOfRule: '12', 
    qtyOfSubRule: '12', 
    seqOfSubRule: '12',
    authority: '2',
    headRatio: '6667',
    amountRatio: '0',
    onlyAttendance: true,
    impliedConsent: false,
    partyAsConsent: false,
    againstShallBuy: false,
    frExecDays: '0',
    dtExecDays: '0',
    dtConfirmDays: '0',
    invExitDays: '9',
    votePrepareDays: '1',
    votingDays: '1',
    execDaysForPutOpt: '0',
    vetoers: ['0','0'],
    para: '0',
  }
]

// ==== Num Interface ====

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

export function SetVotingRule({ sha, seq, isFinalized, time, refresh }: RulesEditProps) {

  const strDefVR: StrVotingRule =
      { seqOfRule: seq.toString(), 
        qtyOfSubRule: seq.toString(), 
        seqOfSubRule: seq.toString(),
        authority: '1',
        headRatio: '0',
        amountRatio: '0',
        onlyAttendance: false,
        impliedConsent: false,
        partyAsConsent: true,
        againstShallBuy: false,
        frExecDays: '0',
        dtExecDays: '0',
        dtConfirmDays: '0',
        invExitDays: '0',
        votePrepareDays: '0',
        votingDays: '0',
        execDaysForPutOpt: '0',
        vetoers: ['0','0'],
        para: '0',
      };

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

  const [ objVR, setObjVR ] = useState<StrVotingRule>(seq < 13 ? strDefaultRules[seq - 1] : strDefVR);   
  const [ valid, setValid ] = useState(true);
  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    getRule(sha, seq).then(
      res => setObjVR(strVRParser(res))
    );
  }, [sha, seq, time])

  return (
    <>
      <Button
        variant={ Number(objVR.seqOfRule) == seq ? 'contained' : 'outlined' }
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
                  <h4>Rule No. { seq } { subTitle } </h4>
                </Toolbar>
              </Box>

              <AddRule 
                sha={ sha } 
                rule={ strVRCodifier(objVR) } 
                isFinalized={ isFinalized }
                valid={valid}
                refresh={ refresh }
                setOpen={ setOpen }
              />
              
            </Stack>

            <Stack 
              direction={'column'} 
              spacing={1} 
            >

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                {!isFinalized && (
                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="authority-label">Authority</InputLabel>
                    <Select
                      labelId="authority-label"
                      id="authority-select"
                      label="Authority"
                      value={ objVR.authority }
                      onChange={(e) => setObjVR((v) => ({
                        ...v,
                        authority: e.target.value,
                      }))}
                    >
                      <MenuItem value={'1'}>ShareholdersMeeting</MenuItem>
                      <MenuItem value={'2'}>BoardMeeting</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {isFinalized && (
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
                    value={ authorities[(Number(objVR.authority) > 0 ? Number(objVR.authority) : 1) - 1] }
                  />
                )}

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'HeadRatio ' + (isFinalized ? '(%)' : 'BP')}
                  error={ onlyNum(objVR.headRatio, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objVR.headRatio, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    headRatio: e.target.value,
                  }))}
                  value={ isFinalized ? toPercent(objVR.headRatio) : objVR.headRatio }              
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'AmountRatio ' + (isFinalized ? '(%)' : 'BP')}
                  error={ onlyNum(objVR.amountRatio, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objVR.amountRatio, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    amountRatio: e.target.value,
                  }))}
                  value={ isFinalized ? toPercent(objVR.amountRatio) : objVR.amountRatio }                               
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='ExecDaysForPutOpt'
                  error={ onlyNum(objVR.execDaysForPutOpt, BigInt(2**8-1), setValid).error }
                  helperText={ onlyNum(objVR.execDaysForPutOpt, BigInt(2**8-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    execDaysForPutOpt: e.target.value,
                  }))}
                  value={ objVR.execDaysForPutOpt}                                        
                />

              </Stack>

              {isFinalized && (
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
                    value={ objVR.onlyAttendance ? 'True' : 'False' }
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
                    value={ objVR.impliedConsent ? 'True' : 'False' }
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
                    value={ objVR.partyAsConsent ? 'True' : 'False' }
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
                    value={objVR.againstShallBuy ? 'True' : 'False'}
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
                    value={ longSnParser(objVR.vetoers[0]) }
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
                    value={ longSnParser(objVR.vetoers[1])}
                  />

                </Stack>
              )}

              {!isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

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
                    error={ onlyNum(objVR.vetoers[0], BigInt(2**40-1), setValid).error }
                    helperText={ onlyNum(objVR.vetoers[0], BigInt(2**40-1), setValid).helpTx }
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjVR((v) => {
                      let arr = [...v.vetoers];
                      arr[0] = e.target.value;
                      return {...v, vetoers:arr};
                    })}
                    value={ objVR.vetoers[0]}   
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='Vetoer_2'
                    error={ onlyNum(objVR.vetoers[1], BigInt(2**40-1), setValid).error }
                    helperText={ onlyNum(objVR.vetoers[1], BigInt(2**40-1), setValid).helpTx }
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjVR((v) => {
                      let arr = [...v.vetoers];
                      arr[1] = e.target.value;
                      return {...v, vetoers:arr};
                    })}
                    value={ objVR.vetoers[1]}
                  />

                </Stack>
              )}

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  size='small'
                  label='FRExecDays'
                  error={ onlyNum(objVR.frExecDays, BigInt(2**8-1), setValid).error }
                  helperText={ onlyNum(objVR.frExecDays, BigInt(2**8-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    frExecDays: e.target.value,
                  }))}
                  value={ objVR.frExecDays}                                        
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='DTExecDays'
                  error={ onlyNum(objVR.dtExecDays, BigInt(2**8-1), setValid).error }
                  helperText={ onlyNum(objVR.dtExecDays, BigInt(2**8-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    dtExecDays: e.target.value,
                  }))}
                  value={ objVR.dtExecDays}                                        
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='DTConfirmDays'
                  error={ onlyNum(objVR.dtConfirmDays, BigInt(2**8-1), setValid).error }
                  helperText={ onlyNum(objVR.dtConfirmDays, BigInt(2**8-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    dtConfirmDays: e.target.value,
                  }))}
                  value={ objVR.dtConfirmDays}                                        
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='InvExitDays'
                  error={ onlyNum(objVR.invExitDays, BigInt(2**8-1), setValid).error }
                  helperText={ onlyNum(objVR.invExitDays, BigInt(2**8-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    invExitDays: e.target.value,
                  }))}
                  value={ objVR.invExitDays}                                        
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='VotePrepareDays'
                  error={ onlyNum(objVR.votePrepareDays, BigInt(2**8-1), setValid).error }
                  helperText={ onlyNum(objVR.votePrepareDays, BigInt(2**8-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    votePrepareDays: e.target.value,
                  }))}
                  value={ objVR.votePrepareDays}                                        
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='VotingDays'
                  error={ onlyNum(objVR.votingDays, BigInt(2**8-1), setValid).error }
                  helperText={ onlyNum(objVR.votingDays, BigInt(2**8-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjVR((v) => ({
                    ...v,
                    votingDays: e.target.value,
                  }))}
                  value={ objVR.votingDays}                                        
                />

              </Stack>

            </Stack>
          
          </Paper>

        </DialogContent>

        <DialogActions>
          <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>
    </>
  );
}
