import { useState, } from 'react';

import dayjs from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers';

import {
  Box, 
  Stack,
  TextField,
  Paper,
  Collapse,
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

import { HexType } from '../../../../../scripts/common';
import { dateParser, toPercent } from '../../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { useShareholdersAgreementGetRule } from '../../../../../generated';

export interface GovernanceRule {
  fundApprovalThreshold: number;
  basedOnPar: boolean ;
  proposeWeightRatioOfGM: number ;
  proposeHeadRatioOfMembers: number ;
  proposeHeadRatioOfDirectorsInGM: number ;
  proposeHeadRatioOfDirectorsInBoard: number ;
  maxQtyOfMembers: number ;
  quorumOfGM: number ;
  maxNumOfDirectors: number ;
  tenureMonOfBoard: number ;
  quorumOfBoardMeeting: number ;
  establishedDate: number ;
  businessTermInYears: number ;
  typeOfComp: number ; 
  minVoteRatioOnChain: number;
}

const defaultGR: GovernanceRule = {
  fundApprovalThreshold: 0,
  basedOnPar: false,
  proposeWeightRatioOfGM: 1000,
  proposeHeadRatioOfMembers: 0,
  proposeHeadRatioOfDirectorsInGM: 3333,
  proposeHeadRatioOfDirectorsInBoard: 1000,
  maxQtyOfMembers: 50,
  quorumOfGM: 5000,
  maxNumOfDirectors: 5,
  tenureMonOfBoard: 36,
  quorumOfBoardMeeting: 5000,
  establishedDate: 0,
  businessTermInYears: 20,
  typeOfComp: 1,
  minVoteRatioOnChain: 500,   
}

export function grCodifier(rule: GovernanceRule): HexType {
  let hexGR: HexType = `0x${
    rule.fundApprovalThreshold.toString(16).padStart(8, '0') +
    (rule.basedOnPar ? '01' : '00') +
    rule.proposeWeightRatioOfGM.toString(16).padStart(4, '0') +
    rule.proposeHeadRatioOfMembers.toString(16).padStart(4, '0') + 
    rule.proposeHeadRatioOfDirectorsInGM.toString(16).padStart(4, '0') + 
    rule.proposeHeadRatioOfDirectorsInBoard.toString(16).padStart(4, '0') + 
    rule.maxQtyOfMembers.toString(16).padStart(4, '0') +       
    rule.quorumOfGM.toString(16).padStart(4, '0') +       
    rule.maxNumOfDirectors.toString(16).padStart(2, '0') +       
    rule.tenureMonOfBoard.toString(16).padStart(4, '0') +       
    rule.quorumOfBoardMeeting.toString(16).padStart(4, '0') +       
    rule.establishedDate.toString(16).padStart(12, '0') + 
    rule.businessTermInYears.toString(16).padStart(2, '0') +                 
    rule.typeOfComp.toString(16).padStart(2, '0')+                 
    rule.minVoteRatioOnChain.toString(16).padStart(4, '0')                 
  }`;

  return hexGR;
}

export function grParser(hexRule: HexType): GovernanceRule {
  let rule: GovernanceRule = {
    fundApprovalThreshold: parseInt(hexRule.substring(2, 10), 16),
    basedOnPar: hexRule.substring(10, 12) === '01',
    proposeWeightRatioOfGM: parseInt(hexRule.substring(12,16), 16),
    proposeHeadRatioOfMembers: parseInt(hexRule.substring(16, 20), 16),
    proposeHeadRatioOfDirectorsInGM: parseInt(hexRule.substring(20, 24), 16),
    proposeHeadRatioOfDirectorsInBoard: parseInt(hexRule.substring(24, 28), 16),
    maxQtyOfMembers: parseInt(hexRule.substring(28, 32), 16),
    quorumOfGM: parseInt(hexRule.substring(32, 36), 16),
    maxNumOfDirectors: parseInt(hexRule.substring(36, 38), 16),
    tenureMonOfBoard: parseInt(hexRule.substring(38, 42), 16),
    quorumOfBoardMeeting: parseInt(hexRule.substring(42, 46), 16),
    establishedDate: parseInt(hexRule.substring(46, 58), 16),
    businessTermInYears: parseInt(hexRule.substring(58, 60), 16),
    typeOfComp: parseInt(hexRule.substring(60, 62), 16),
    minVoteRatioOnChain: parseInt(hexRule.substring(62, 66), 16),    
  };

  return rule;
}

export interface RulesEditProps {
  sha: HexType;
  initSeqList: number[] | undefined;
  isFinalized: boolean;
  getRules: ()=>void;
}

export function SetGovernanceRule({ sha, initSeqList, isFinalized, getRules }: RulesEditProps) {
  const [ objGR, setObjGR ] = useState<GovernanceRule>(defaultGR);
  const [ newGR, setNewGR ] = useState<GovernanceRule>(defaultGR);

  const [ editable, setEditable ] = useState<boolean>(false); 
  const [ open, setOpen ] = useState(false);

  const {
    refetch: getGr
  } = useShareholdersAgreementGetRule({
    address: sha,
    args: [ BigInt(0) ],
    onSuccess(res) {
      setNewGR(grParser(res))
    }
  })

  return (
    <>
      <Button
        // disabled={ !newGR }
        variant={newGR.establishedDate > 0 ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        // fullWidth={true}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start'}}
        onClick={()=>setOpen(true)}      
      >
        Governance Rules 
      </Button>

      {newGR && (
        <Dialog
          maxWidth={false}
          open={open}
          onClose={ getRules }
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
                    rule={ grCodifier(objGR) }
                    refreshRule={ getGr }
                    editable={ editable }
                    setEditable={ setEditable }
                    isFinalized={ isFinalized }
                    getRules = { getRules }
                  />
                  
                </Stack>

                <Stack 
                  direction={'column'} 
                  spacing={1} 
                >

                  <Stack direction={'row'} sx={{ alignItems: 'center', }} >
                    <TextField 
                      variant='outlined'
                      label='BasedOnPar ?'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ newGR.basedOnPar ? 'True' : 'False' }
                    />

                    <TextField 
                      variant='outlined'
                      label='PropW_RatioOfGM'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={toPercent(newGR.proposeWeightRatioOfGM ?? 0)}
                    />

                    <TextField 
                      variant='outlined'
                      label='PropH_RatioOfMembers'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={toPercent(newGR.proposeHeadRatioOfMembers ?? 0)}
                    />

                    <TextField 
                      variant='outlined'
                      label='PropH_RatioOfDirectorsInGM'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={toPercent(newGR.proposeHeadRatioOfDirectorsInGM ?? 0)}
                    />

                    <TextField 
                      variant='outlined'
                      label='PropH_RatioOfDirectorsInBM'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={toPercent(newGR.proposeHeadRatioOfDirectorsInBoard ?? 0)}
                    />

                  </Stack>

                  <Collapse in={ editable && !isFinalized }>
                    <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >
                        
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
                    
                      <TextField 
                        variant='outlined'
                        label='PropW_RatioOfGM'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          proposeWeightRatioOfGM: parseInt(e.target.value),
                        }))}
                        value={ objGR.proposeWeightRatioOfGM }              
                      />

                      <TextField 
                        variant='outlined'
                        label='PropH_RatioOfMembers'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          proposeHeadRatioOfMembers: parseInt(e.target.value),
                        }))}
                        value={ objGR.proposeHeadRatioOfMembers }
                      />

                      <TextField 
                        variant='outlined'
                        label='PropH_RatioOfDirectorsInGM'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          proposeHeadRatioOfDirectorsInGM: parseInt(e.target.value),
                        }))}
                        value={ objGR.proposeHeadRatioOfDirectorsInGM }
                      />

                      <TextField 
                        variant='outlined'
                        label='PropH_RatioOfDirectorsInBM'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          proposeHeadRatioOfDirectorsInBoard: parseInt(e.target.value),
                        }))}
                        value={ objGR.proposeHeadRatioOfDirectorsInBoard }
                      />

                    </Stack>
                  </Collapse>

                  <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                    <TextField 
                      variant='outlined'
                      label='MaxQtyOfMembers'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newGR.maxQtyOfMembers.toString() ?? '0'}
                    />

                    <TextField 
                      variant='outlined'
                      label='QuorumOfGM'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ toPercent(newGR.quorumOfGM ?? 0)}
                    />

                    <TextField 
                      variant='outlined'
                      label='MaxNumOfDirectors'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newGR.maxNumOfDirectors.toString() ?? '0'}
                    />

                    <TextField 
                      variant='outlined'
                      label='TenureMonOfBoard'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newGR.tenureMonOfBoard.toString() ?? '0'}
                    />

                    <TextField 
                      variant='outlined'
                      label='QuorumOfBoardMeeting'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ toPercent(newGR.quorumOfBoardMeeting ?? 0)}
                    />

                  </Stack>

                  <Collapse in={ editable && !isFinalized }>
                    <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                      <TextField 
                        variant='outlined'
                        label='MaxQtyOfMembers'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          maxQtyOfMembers: parseInt(e.target.value),
                        }))}
                        value={ objGR.maxQtyOfMembers.toString() } 
                      />

                      <TextField 
                        variant='outlined'
                        label='QuorumOfGM'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          quorumOfGM: parseInt(e.target.value),
                        }))}
                        value={ objGR.quorumOfGM }
                      />

                      <TextField 
                        variant='outlined'
                        label='MaxNumOfDirectors'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          maxNumOfDirectors: parseInt(e.target.value),
                        }))}
                        value={ objGR.maxNumOfDirectors }

                      />

                      <TextField 
                        variant='outlined'
                        label='TenureMonOfBoard'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          tenureMonOfBoard: parseInt(e.target.value),
                        }))}
                        value={ objGR.tenureMonOfBoard } 
                      />

                      <TextField 
                        variant='outlined'
                        label='QuorumOfBoardMeeting'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          quorumOfBoardMeeting: parseInt(e.target.value),
                        }))}
                        value={ objGR.quorumOfBoardMeeting }   
                      />

                    </Stack>
                  </Collapse>

                  <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                    <TextField 
                      variant='outlined'
                      label='EstablishedDate'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ dateParser(newGR.establishedDate ?? 0) }
                    />

                    <TextField 
                      variant='outlined'
                      label='BusinessTermInYears'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newGR.businessTermInYears.toString() ?? '0'}
                    />

                    <TextField 
                      variant='outlined'
                      label='TypeOfComp'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newGR.typeOfComp.toString() ?? '0'}
                    />

                    <TextField 
                      variant='outlined'
                      label='MinVoteRatioOnChain(%)'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ toPercent(newGR.minVoteRatioOnChain ?? 0)}
                    />

                    <TextField 
                      variant='outlined'
                      label='FundThreshold (CBP/ETH)'
                      inputProps={{readOnly: true}}
                      size='small'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={newGR.fundApprovalThreshold.toString() ?? '0'}
                    />

                  </Stack>

                  <Collapse in={ editable && !isFinalized }>
                    <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                      <DateTimeField
                        label='EstablishedDate'
                        size='small'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }} 
                        value={ dayjs.unix(objGR.establishedDate) }
                        onChange={(date) => setObjGR((v) => ({
                          ...v,
                          establishedDate: date ? date.unix() : 0,
                        }))}
                        format='YYYY-MM-DD HH:mm:ss'
                      />

                      <TextField 
                        variant='outlined'
                        label='BusinessTermInYears'
                        size='small'
                        sx={{
                          m:1,
                          minWidth:218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          businessTermInYears: parseInt(e.target.value),
                        }))}
                        value={ objGR.businessTermInYears }
                      />

                      <TextField 
                        variant='outlined'
                        label='TypeOfComp'
                        size='small'
                        sx={{
                          m:1,
                          minWidth:218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          typeOfComp: parseInt(e.target.value),
                        }))}
                        value={ objGR.typeOfComp }
                      />

                      <TextField 
                        variant='outlined'
                        label='MinVoteRatioOnChain (BP)'
                        size='small'
                        sx={{
                          m:1,
                          minWidth:218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          minVoteRatioOnChain: parseInt(e.target.value),
                        }))}
                        value={ objGR.minVoteRatioOnChain }
                      />

                      <TextField 
                        variant='outlined'
                        label='FundThreshold  (CBP/ETH)'
                        size='small'
                        sx={{
                          m:1,
                          minWidth:218,
                        }}
                        onChange={(e) => setObjGR((v) => ({
                          ...v,
                          fundApprovalThreshold: parseInt(e.target.value ?? '0'),
                        }))}
                        value={ objGR.fundApprovalThreshold }
                      />

                    </Stack>
                  </Collapse>

                </Stack>
              </Paper>
      
            </Paper>
      
          </DialogContent>

          <DialogActions>
            <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={ ()=>setOpen(false) }>Close</Button>
          </DialogActions>

        </Dialog>        
      )}

    </> 
  )
}