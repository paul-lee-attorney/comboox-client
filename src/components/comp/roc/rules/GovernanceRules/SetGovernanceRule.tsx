import { useEffect, useState, } from 'react';
import dayjs from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers';
import {
  Box, 
  Stack,
  TextField,
  Paper,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AddRule } from '../AddRule';
import { HexType, MaxRatio, MaxSeqNo } from '../../../../../scripts/common';
import { FormResults, dateParser, defFormResults, longDataParser, onlyNum, toPercent } from '../../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { getRule } from '../../../../../scripts/comp/sha';

export interface GovernanceRule {
  fundApprovalThreshold: string;
  basedOnPar: boolean ;
  proposeWeightRatioOfGM: string ;
  proposeHeadRatioOfMembers: string ;
  proposeHeadRatioOfDirectorsInGM: string ;
  proposeHeadRatioOfDirectorsInBoard: string ;
  maxQtyOfMembers: string ;
  quorumOfGM: string ;
  maxNumOfDirectors: string ;
  tenureMonOfBoard: string ;
  quorumOfBoardMeeting: string ;
  establishedDate: string ;
  businessTermInYears: string ;
  typeOfComp: string ; 
  minVoteRatioOnChain: string;
}

const defGR: GovernanceRule = {
  fundApprovalThreshold: '0',
  basedOnPar: false,
  proposeWeightRatioOfGM: '1000',
  proposeHeadRatioOfMembers: '0',
  proposeHeadRatioOfDirectorsInGM: '3333',
  proposeHeadRatioOfDirectorsInBoard: '1000',
  maxQtyOfMembers: '50',
  quorumOfGM: '5000',
  maxNumOfDirectors: '5',
  tenureMonOfBoard: '36',
  quorumOfBoardMeeting: '5000',
  establishedDate: '0',
  businessTermInYears: '20',
  typeOfComp: '1',
  minVoteRatioOnChain: '500',   
}

export function strGRParser(hexRule: HexType): GovernanceRule {
  let rule: GovernanceRule = {
    fundApprovalThreshold: parseInt(hexRule.substring(2, 10), 16).toString(),
    basedOnPar: hexRule.substring(10, 12) === '01',
    proposeWeightRatioOfGM: parseInt(hexRule.substring(12,16), 16).toString(),
    proposeHeadRatioOfMembers: parseInt(hexRule.substring(16, 20), 16).toString(),
    proposeHeadRatioOfDirectorsInGM: parseInt(hexRule.substring(20, 24), 16).toString(),
    proposeHeadRatioOfDirectorsInBoard: parseInt(hexRule.substring(24, 28), 16).toString(),
    maxQtyOfMembers: parseInt(hexRule.substring(28, 32), 16).toString(),
    quorumOfGM: parseInt(hexRule.substring(32, 36), 16).toString(),
    maxNumOfDirectors: parseInt(hexRule.substring(36, 38), 16).toString(),
    tenureMonOfBoard: parseInt(hexRule.substring(38, 42), 16).toString(),
    quorumOfBoardMeeting: parseInt(hexRule.substring(42, 46), 16).toString(),
    establishedDate: parseInt(hexRule.substring(46, 58), 16).toString(),
    businessTermInYears: parseInt(hexRule.substring(58, 60), 16).toString(),
    typeOfComp: parseInt(hexRule.substring(60, 62), 16).toString(),
    minVoteRatioOnChain: parseInt(hexRule.substring(62, 66), 16).toString(),    
  };

  return rule;
}

export function strGRCodifier(rule: GovernanceRule): HexType {
  let hexGR: HexType = `0x${
    Number(rule.fundApprovalThreshold).toString(16).padStart(8, '0') +
    (rule.basedOnPar ? '01' : '00') +
    Number(rule.proposeWeightRatioOfGM).toString(16).padStart(4, '0') +
    Number(rule.proposeHeadRatioOfMembers).toString(16).padStart(4, '0') + 
    Number(rule.proposeHeadRatioOfDirectorsInGM).toString(16).padStart(4, '0') + 
    Number(rule.proposeHeadRatioOfDirectorsInBoard).toString(16).padStart(4, '0') + 
    Number(rule.maxQtyOfMembers).toString(16).padStart(4, '0') +       
    Number(rule.quorumOfGM).toString(16).padStart(4, '0') +       
    Number(rule.maxNumOfDirectors).toString(16).padStart(2, '0') +       
    Number(rule.tenureMonOfBoard).toString(16).padStart(4, '0') +       
    Number(rule.quorumOfBoardMeeting).toString(16).padStart(4, '0') +       
    Number(rule.establishedDate).toString(16).padStart(12, '0') + 
    Number(rule.businessTermInYears).toString(16).padStart(2, '0') +                 
    Number(rule.typeOfComp).toString(16).padStart(2, '0')+                 
    Number(rule.minVoteRatioOnChain).toString(16).padStart(4, '0')                 
  }`;

  return hexGR;
}

// export interface GovernanceRule {
//   fundApprovalThreshold: number;
//   basedOnPar: boolean ;
//   proposeWeightRatioOfGM: number ;
//   proposeHeadRatioOfMembers: number ;
//   proposeHeadRatioOfDirectorsInGM: number ;
//   proposeHeadRatioOfDirectorsInBoard: number ;
//   maxQtyOfMembers: number ;
//   quorumOfGM: number ;
//   maxNumOfDirectors: number ;
//   tenureMonOfBoard: number ;
//   quorumOfBoardMeeting: number ;
//   establishedDate: number ;
//   businessTermInYears: number ;
//   typeOfComp: number ; 
//   minVoteRatioOnChain: number;
// }

// const defaultGR: GovernanceRule = {
//   fundApprovalThreshold: 0,
//   basedOnPar: false,
//   proposeWeightRatioOfGM: 1000,
//   proposeHeadRatioOfMembers: 0,
//   proposeHeadRatioOfDirectorsInGM: 3333,
//   proposeHeadRatioOfDirectorsInBoard: 1000,
//   maxQtyOfMembers: 50,
//   quorumOfGM: 5000,
//   maxNumOfDirectors: 5,
//   tenureMonOfBoard: 36,
//   quorumOfBoardMeeting: 5000,
//   establishedDate: 0,
//   businessTermInYears: 20,
//   typeOfComp: 1,
//   minVoteRatioOnChain: 500,   
// }

// export function grCodifier(rule: GovernanceRule): HexType {
//   let hexGR: HexType = `0x${
//     rule.fundApprovalThreshold.toString(16).padStart(8, '0') +
//     (rule.basedOnPar ? '01' : '00') +
//     rule.proposeWeightRatioOfGM.toString(16).padStart(4, '0') +
//     rule.proposeHeadRatioOfMembers.toString(16).padStart(4, '0') + 
//     rule.proposeHeadRatioOfDirectorsInGM.toString(16).padStart(4, '0') + 
//     rule.proposeHeadRatioOfDirectorsInBoard.toString(16).padStart(4, '0') + 
//     rule.maxQtyOfMembers.toString(16).padStart(4, '0') +       
//     rule.quorumOfGM.toString(16).padStart(4, '0') +       
//     rule.maxNumOfDirectors.toString(16).padStart(2, '0') +       
//     rule.tenureMonOfBoard.toString(16).padStart(4, '0') +       
//     rule.quorumOfBoardMeeting.toString(16).padStart(4, '0') +       
//     rule.establishedDate.toString(16).padStart(12, '0') + 
//     rule.businessTermInYears.toString(16).padStart(2, '0') +                 
//     rule.typeOfComp.toString(16).padStart(2, '0')+                 
//     rule.minVoteRatioOnChain.toString(16).padStart(4, '0')                 
//   }`;

//   return hexGR;
// }

// export function grParser(hexRule: HexType): GovernanceRule {
//   let rule: GovernanceRule = {
//     fundApprovalThreshold: parseInt(hexRule.substring(2, 10), 16),
//     basedOnPar: hexRule.substring(10, 12) === '01',
//     proposeWeightRatioOfGM: parseInt(hexRule.substring(12,16), 16),
//     proposeHeadRatioOfMembers: parseInt(hexRule.substring(16, 20), 16),
//     proposeHeadRatioOfDirectorsInGM: parseInt(hexRule.substring(20, 24), 16),
//     proposeHeadRatioOfDirectorsInBoard: parseInt(hexRule.substring(24, 28), 16),
//     maxQtyOfMembers: parseInt(hexRule.substring(28, 32), 16),
//     quorumOfGM: parseInt(hexRule.substring(32, 36), 16),
//     maxNumOfDirectors: parseInt(hexRule.substring(36, 38), 16),
//     tenureMonOfBoard: parseInt(hexRule.substring(38, 42), 16),
//     quorumOfBoardMeeting: parseInt(hexRule.substring(42, 46), 16),
//     establishedDate: parseInt(hexRule.substring(46, 58), 16),
//     businessTermInYears: parseInt(hexRule.substring(58, 60), 16),
//     typeOfComp: parseInt(hexRule.substring(60, 62), 16),
//     minVoteRatioOnChain: parseInt(hexRule.substring(62, 66), 16),    
//   };

//   return rule;
// }

export interface RulesEditProps {
  sha: HexType;
  seq: number;
  isFinalized: boolean;
  time: number;
  refresh: ()=>void;
}

export function SetGovernanceRule({ sha, seq, isFinalized, time, refresh }: RulesEditProps) {
  const [ objGR, setObjGR ] = useState<GovernanceRule>(defGR);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    getRule(sha, seq).then(
      res => setObjGR(strGRParser(res))
    );
  }, [sha, seq, time]);

  return (
    <>
      <Button
        variant={Number(objGR.establishedDate) > 0 ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start'}}
        onClick={()=>setOpen(true)}      
      >
        Governance Rules 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={ ()=>setOpen(false) }
        aria-labelledby="dialog-title"        
      >

        <DialogContent>

          <Paper elevation={3} sx={{ m:1, p:1, border:1, borderColor:'divider'}} >
            
            <Stack direction={'row'} sx={{ alignItems:'center' }}>
              <Toolbar sx={{ textDecoration:'underline' }}>
                <h4>Governance Rule</h4>
              </Toolbar>
            </Stack>

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
                  <Toolbar sx={{ textDecoration:'underline' }}>
                    <h4>Rule No. 0</h4> 
                  </Toolbar>
                </Box>

                <AddRule 
                  sha={ sha }
                  rule={ strGRCodifier(objGR) }
                  isFinalized={ isFinalized }
                  valid = {valid}
                  refresh = { refresh }
                  setOpen = { setOpen }
                />
                
              </Stack>

              <Stack 
                direction={'column'} 
                spacing={1} 
              >

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                  {!isFinalized && (                  
                    <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                      <InputLabel id="basedOnPar-label">BasedOnPar ?</InputLabel>
                      <Select
                        labelId="basedOnPar-label"
                        id="basedOnPar-select"
                        value={ objGR.basedOnPar ? '1' : '0' }
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          proRata: e.target.value == '01',
                        }))}
                        label="BasedOnPar ?"
                      >
                        <MenuItem value={'1'}>True</MenuItem>
                        <MenuItem value={'0'}>False</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {isFinalized && (
                    <TextField 
                      variant='outlined'
                      label='BasedOnPar ?'
                      inputProps={{readOnly: isFinalized}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ objGR.basedOnPar ? 'True' : 'False' }
                    />
                  )}
                
                  <TextField 
                    variant='outlined'
                    label={ 'PropWROfMembers ' + (isFinalized ? '(%)' : 'BP') }
                    size='small'
                    error={ valid['PropWROfMembers']?.error }
                    helperText={ valid['PropWROfMembers']?.helpTx }        
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('PropWROfMembers', input, MaxRatio, setValid);
                      setObjGR((v) => ({
                        ...v,
                        proposeWeightRatioOfGM: input,
                      }));
                    }}
                    value={ isFinalized ? toPercent(objGR.proposeWeightRatioOfGM) : objGR.proposeWeightRatioOfGM}
                  />

                  <TextField 
                    variant='outlined'
                    label={ 'PropHROfMembers ' + (isFinalized ? '(%)' : 'BP') }
                    size='small'
                    error={ valid['PropHROfMembers']?.error }
                    helperText={ valid['PropHROfMembers']?.helpTx }        
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('PropHROfMembers', input, MaxRatio, setValid);
                      setObjGR((v) => ({
                        ...v,
                        proposeHeadRatioOfMembers: input,
                      }));
                    }}
                    value={ isFinalized ? toPercent(objGR.proposeHeadRatioOfMembers) : objGR.proposeHeadRatioOfMembers}
                  />

                  <TextField 
                    variant='outlined'
                    label={ 'PropHROfDirectorsInGM ' + (isFinalized ? '(%)' : 'BP') }
                    size='small'
                    error={ valid['PropHROfDirectorsInGM']?.error }
                    helperText={ valid['PropHROfDirectorsInGM']?.helpTx }        
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('PropHROfDirectorsInGM', input, MaxRatio, setValid);
                      setObjGR((v) => ({
                        ...v,
                        proposeHeadRatioOfDirectorsInGM: e.target.value,
                      }));
                    }}
                    value={ isFinalized ? toPercent(objGR.proposeHeadRatioOfDirectorsInGM) : objGR.proposeHeadRatioOfDirectorsInGM }
                  />

                  <TextField 
                    variant='outlined'
                    label={ 'PropHROfDirectorsInBM ' + (isFinalized ? '(%)' : 'BP') }
                    size='small'
                    error={ valid['PropHROfDirectorsInBM']?.error }
                    helperText={ valid['PropHROfDirectorsInBM']?.helpTx }        
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('PropHROfDirectorsInBM', input, MaxRatio, setValid);
                      setObjGR((v) => ({
                        ...v,
                        proposeHeadRatioOfDirectorsInBoard: input,
                      }));
                    }}
                    value={ isFinalized ? toPercent(objGR.proposeHeadRatioOfDirectorsInBoard) : objGR.proposeHeadRatioOfDirectorsInBoard }
                  />

                </Stack>

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    label='MaxQtyOfMembers'
                    size='small'
                    error={ valid['MaxQtyOfMembers']?.error }
                    helperText={ valid['MaxQtyOfMembers']?.helpTx }        
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('MaxQtyOfMembers', input, MaxSeqNo, setValid);
                      setObjGR((v) => ({
                        ...v,
                        maxQtyOfMembers: input,
                      }));
                    }}
                    value={ objGR.maxQtyOfMembers } 
                  />

                  <TextField 
                    variant='outlined'
                    label={ 'QuorumOfGM ' + (isFinalized ? '(%)' : 'BP') }
                    size='small'
                    error={ valid['QuorumOfGM']?.error }
                    helperText={ valid['QuorumOfGM']?.helpTx }        
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('QuorumOfGM', input, MaxRatio, setValid);
                      setObjGR((v) => ({
                        ...v,
                        quorumOfGM: input,
                      }));
                    }}
                    value={ isFinalized ? toPercent(objGR.quorumOfGM) : objGR.quorumOfGM }
                  />

                  <TextField 
                    variant='outlined'
                    label='MaxNumOfDirectors'
                    size='small'
                    error={ valid['MaxNumOfDirectors']?.error }
                    helperText={ valid['MaxNumOfDirectors']?.helpTx }        
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('MaxNumOfDirectors', input, 255n, setValid);
                      setObjGR((v) => ({
                        ...v,
                        maxNumOfDirectors: input,
                      }));
                    }}
                    value={ objGR.maxNumOfDirectors }
                  />

                  <TextField 
                    variant='outlined'
                    label='TenureMonOfBoard'
                    size='small'
                    error={ valid['TenureMonOfBoard']?.error }
                    helperText={ valid['TenureMonOfBoard']?.helpTx }        
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('TenureMonOfBoard', input, MaxSeqNo, setValid);
                      setObjGR((v) => ({
                        ...v,
                        tenureMonOfBoard: input,
                      }));
                    }}
                    value={ objGR.tenureMonOfBoard } 
                  />

                  <TextField 
                    variant='outlined'
                    label={ 'QuorumOfBoardMeeting ' + (isFinalized ? '(%)' : 'BP') }
                    size='small'
                    error={ valid['QuorumOfBoardMeeting']?.error }
                    helperText={ valid['QuorumOfBoardMeeting']?.helpTx }
                    inputProps={{readOnly: isFinalized}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('QuorumOfBoardMeeting', input, MaxRatio, setValid);
                      setObjGR((v) => ({
                        ...v,
                        quorumOfBoardMeeting: input,
                      }));
                    }}
                    value={ isFinalized ? toPercent(objGR.quorumOfBoardMeeting) : objGR.quorumOfBoardMeeting }   
                  />

                </Stack>

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  {!isFinalized && (
                    <DateTimeField
                      label='EstablishedDate'
                      size='small'
                      readOnly={isFinalized}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }} 
                      value={ dayjs.unix(Number(objGR.establishedDate)) }
                      onChange={(date) => setObjGR((v) => ({
                        ...v,
                        establishedDate: date ? date.unix().toString() : '0',
                      }))}
                      format='YYYY-MM-DD HH:mm:ss'
                    />
                  )}

                  {isFinalized && (
                    <TextField 
                      variant='outlined'
                      label='EstablishedDate'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ dateParser(objGR.establishedDate.toString()) }
                    />
                  )}

                  <TextField 
                    variant='outlined'
                    label='BusinessTermInYears'
                    size='small'
                    error={ valid['BusinessTerm']?.error }
                    helperText={ valid['BusinessTerm']?.helpTx }
                    inputProps={{readOnly: isFinalized}}                        
                    sx={{
                      m:1,
                      minWidth:218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('BusinessTerm', input, 255n, setValid);
                      setObjGR((v) => ({
                        ...v,
                        businessTermInYears: input,
                      }));
                    }}
                    value={ objGR.businessTermInYears }
                  />

                  <TextField 
                    variant='outlined'
                    label='TypeOfComp'
                    size='small'
                    error={ valid['TypeOfComp']?.error }
                    helperText={ valid['TypeOfComp']?.helpTx }
                    inputProps={{readOnly: isFinalized}}
                      sx={{
                      m:1,
                      minWidth:218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('TypeOfComp', input, 255n, setValid);
                      setObjGR((v) => ({
                        ...v,
                        typeOfComp: input,
                      }));
                    }}
                    value={ objGR.typeOfComp }
                  />

                  <TextField 
                    variant='outlined'
                    label={ 'MinVoteRatioOnChain ' + (isFinalized ? '(%)' : 'BP') }
                    size='small'
                    error={ valid['MinVoteRatioOnChain']?.error }
                    helperText={ valid['MinVoteRatioOnChain']?.helpTx }
                    inputProps={{readOnly: isFinalized}}
                      sx={{
                      m:1,
                      minWidth:218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('MinVoteRatioOnChain', input, MaxRatio, setValid);
                      setObjGR((v) => ({
                        ...v,
                        minVoteRatioOnChain: input,
                      }));
                    }}
                    value={ isFinalized ? toPercent(objGR.minVoteRatioOnChain) : objGR.minVoteRatioOnChain }
                  />

                  <TextField 
                    variant='outlined'
                    label='FundThreshold  (CBP/ETH)'
                    size='small'
                    error={ valid['FundThreshold']?.error }
                    helperText={ valid['FundThreshold']?.helpTx }
                    inputProps={{readOnly: isFinalized}}
                      sx={{
                      m:1,
                      minWidth:218,
                    }}
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyNum('FundThreshold', input, 0n, setValid);
                      setObjGR((v) => ({
                        ...v,
                        fundApprovalThreshold: input,
                      }));
                    }}
                    value={ isFinalized ? longDataParser(objGR.fundApprovalThreshold) : objGR.fundApprovalThreshold }
                  />

                </Stack>

              </Stack>
            </Paper>
    
          </Paper>
    
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={ ()=>setOpen(false) }>Close</Button>
        </DialogActions>

      </Dialog>        

    </> 
  )
}
