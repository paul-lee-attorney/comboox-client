import { useEffect, useState, } from 'react';

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
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { AddRule } from './AddRule';

import { ContractEditProps, HexType } from '../../../../interfaces';
import { dateParser, toPercent } from '../../../../scripts/toolsKit';
import { getRule } from '../../../../queries/sha';
import { ListAlt } from '@mui/icons-material';

export interface GovernanceRule {
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
  annualPenaltyRateForLatePayInCap: number;
}

const defaultGR: GovernanceRule = {
  basedOnPar: false,
  proposeWeightRatioOfGM: 1000,
  proposeHeadRatioOfMembers: 0,
  proposeHeadRatioOfDirectorsInGM: 3333,
  proposeHeadRatioOfDirectorsInBoard: 1000,
  maxQtyOfMembers: 50,
  quorumOfGM: 5000,
  maxNumOfDirectors: 7,
  tenureMonOfBoard: 36,
  quorumOfBoardMeeting: 5000,
  establishedDate: 0,
  businessTermInYears: 20,
  typeOfComp: 1,
  annualPenaltyRateForLatePayInCap: 1500,   
}

export function grCodifier(rule: GovernanceRule): HexType {
  let hexGR: HexType = `0x${
    '0000' + '01' + '01' +
    (rule.basedOnPar ? '01' : '00' ) +
    (rule.proposeWeightRatioOfGM.toString(16).padStart(4, '0') ) +
    (rule.proposeHeadRatioOfMembers.toString(16).padStart(4, '0') ) + 
    (rule.proposeHeadRatioOfDirectorsInGM.toString(16).padStart(4, '0') ) + 
    (rule.proposeHeadRatioOfDirectorsInBoard.toString(16).padStart(4, '0') ) + 
    (rule.maxQtyOfMembers.toString(16).padStart(4, '0') ) +       
    (rule.quorumOfGM.toString(16).padStart(4, '0') ) +       
    (rule.maxNumOfDirectors.toString(16).padStart(2, '0') ) +       
    (rule.tenureMonOfBoard.toString(16).padStart(4, '0') ) +       
    (rule.quorumOfBoardMeeting.toString(16).padStart(4, '0') ) +       
    (rule.establishedDate.toString(16).padStart(12, '0') ) + 
    (rule.businessTermInYears.toString(16).padStart(2, '0') ) +                 
    (rule.typeOfComp.toString(16).padStart(2, '0')) +                 
    (rule.annualPenaltyRateForLatePayInCap.toString(16).padStart(4, '0'))                 
  }`;

  return hexGR;
}

export function grParser(hexRule: HexType): GovernanceRule {
  let rule: GovernanceRule = {
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
    annualPenaltyRateForLatePayInCap: parseInt(hexRule.substring(62, 66), 16),    
  };

  return rule;
}

export function SetGovernanceRule({ addr, isFinalized }: ContractEditProps) {
  const [ objGR, setObjGR ] = useState<GovernanceRule>(defaultGR);
  const [ newGR, setNewGR ] = useState<GovernanceRule>();
  const [ editable, setEditable ] = useState<boolean>(false); 
  const [ open, setOpen ] = useState(false);

  const obtainRule = async () => {
    let hexRule = await getRule(addr, 0);
    let objRule: GovernanceRule = grParser(hexRule);
    setNewGR(objRule);
  }
  
  useEffect(()=>{
    obtainRule();
  })

  return (
    <>
      <Button
        disabled={ !newGR }
        variant="outlined"
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
          onClose={()=>setOpen(false)}
          aria-labelledby="dialog-title"        
        >

          <DialogContent>

            <Paper elevation={3} sx={{ m:1, p:1, border:1, borderColor:'divider'}} >

              <Box sx={{ width:1680 }}>
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
                      sha={ addr }
                      rule={ grCodifier(objGR) }
                      refreshRule={ obtainRule }
                      editable={ editable }
                      setEditable={ setEditable }
                      isFinalized={ isFinalized }
                    />
                    
                  </Stack>

                  <Stack 
                    direction={'column'} 
                    spacing={1} 
                  >

                    <Stack direction={'row'} sx={{ alignItems: 'center', }} >
                      <TextField 
                        variant='filled'
                        label='BasedOnPar ?'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={ newGR.basedOnPar ? 'True' : 'False' }
                      />

                      <TextField 
                        variant='filled'
                        label='ProposeWeightRatioOfGM'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={toPercent(newGR.proposeWeightRatioOfGM ?? 0)}
                      />

                      <TextField 
                        variant='filled'
                        label='ProposeHeadRatioOfMembers'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={toPercent(newGR.proposeHeadRatioOfMembers ?? 0)}
                      />

                      <TextField 
                        variant='filled'
                        label='ProposeHeadRatioOfDirectorsInGM'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={toPercent(newGR.proposeHeadRatioOfDirectorsInGM ?? 0)}
                      />

                      <TextField 
                        variant='filled'
                        label='ProposeHeadRatioOfDirectorsInBM'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={toPercent(newGR.proposeHeadRatioOfDirectorsInBoard ?? 0)}
                      />

                    </Stack>

                    <Collapse in={ editable && !isFinalized }>
                      <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >
                          
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
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
                          variant='filled'
                          label='ProposeWeightRatioOfGM'
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
                          variant='filled'
                          label='ProposeHeadRatioOfMembers'
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
                          variant='filled'
                          label='ProposeHeadRatioOfDirectorsInGM'
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
                          variant='filled'
                          label='ProposeHeadRatioOfDirectorsInBM'
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
                        variant='filled'
                        label='MaxQtyOfMembers'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={newGR.maxQtyOfMembers.toString() ?? '0'}
                      />

                      <TextField 
                        variant='filled'
                        label='QuorumOfGM'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={ toPercent(newGR.quorumOfGM ?? 0)}
                      />

                      <TextField 
                        variant='filled'
                        label='MaxNumOfDirectors'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={newGR.maxNumOfDirectors.toString() ?? '0'}
                      />

                      <TextField 
                        variant='filled'
                        label='TenureMonOfBoard'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={newGR.tenureMonOfBoard.toString() ?? '0'}
                      />

                      <TextField 
                        variant='filled'
                        label='QuorumOfBoardMeeting'
                        inputProps={{readOnly: true}}
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
                          variant='filled'
                          label='MaxQtyOfMembers'
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
                          variant='filled'
                          label='QuorumOfGM'
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
                          variant='filled'
                          label='MaxNumOfDirectors'
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
                          variant='filled'
                          label='TenureMonOfBoard'
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
                          variant='filled'
                          label='QuorumOfBoardMeeting'
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
                        variant='filled'
                        label='EstablishedDate'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={ dateParser(newGR.establishedDate ?? 0) }
                      />

                      <TextField 
                        variant='filled'
                        label='BusinessTermInYears'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={newGR.businessTermInYears.toString() ?? '0'}
                      />

                      <TextField 
                        variant='filled'
                        label='TypeOfComp'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={newGR.typeOfComp.toString() ?? '0'}
                      />

                      <TextField 
                        variant='filled'
                        label='LatePenaltyRate'
                        inputProps={{readOnly: true}}
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        value={ toPercent(newGR.annualPenaltyRateForLatePayInCap ?? 0)}
                      />

                    </Stack>

                    <Collapse in={ editable && !isFinalized }>
                      <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                        <DateTimeField
                          label='EstablishedDate'
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
                          variant='filled'
                          label='BusinessTermInYears'
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
                          variant='filled'
                          label='TypeOfComp'
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
                          variant='filled'
                          label='LatePenaltyRate'
                          sx={{
                            m:1,
                            minWidth:218,
                          }}
                          onChange={(e) => setObjGR((v) => ({
                            ...v,
                            annualPenaltyRateForLatePayInCap: parseInt(e.target.value),
                          }))}
                          value={ objGR.annualPenaltyRateForLatePayInCap }
                        />

                      </Stack>
                    </Collapse>

                  </Stack>
                </Paper>
              </Box>
      
            </Paper>
      
          </DialogContent>

          <DialogActions>
            <Button onClick={()=>setOpen(false)}>Close</Button>
          </DialogActions>

        </Dialog>        
      )}

    </> 
  )
}
