
import { useState, } from 'react';

import {
  Box, 
  Stack,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
  Collapse,
  Toolbar,
} from '@mui/material';

import { AddRule } from './AddRule';

import { Bytes32Zero, ContractProps, HexType } from '../../../../interfaces';
import { dateParser, toPercent } from '../../../../scripts/toolsKit';

interface GovernanceRuleType {
  basedOnPar?: boolean | undefined;
  proposeWeightRatioOfGM?: number | undefined;
  proposeHeadRatioOfMembers?: number | undefined;
  proposeHeadNumOfDirectors?: number | undefined;
  maxQtyOfMembers?: number | undefined;
  quorumOfGM?: number | undefined;
  maxNumOfDirectors?: number | undefined;
  tenureMonOfBoard?: number | undefined;
  quorumOfBoardMeeting?: number | undefined;
  establishedDate?: number | undefined;
  businessTermInYears?: number | undefined;
  typeOfComp?: number | undefined; 
}

export function SetGovernanceRule({ addr }: ContractProps) {
  const [ objGR, setObjGR ] = useState<GovernanceRuleType>();

  let hexGR: HexType = `0x${
    '0000' + '01' + '01' +
    (objGR?.basedOnPar ? '01' : '00') +
    (objGR?.proposeWeightRatioOfGM?.toString(16).padStart(4, '0') ?? '03e8') +
    (objGR?.proposeHeadRatioOfMembers?.toString(16).padStart(4, '0') ?? '0000') + 
    (objGR?.proposeHeadNumOfDirectors?.toString(16).padStart(4, '0') ?? '0d05') + 
    (objGR?.maxQtyOfMembers?.toString(16).padStart(4, '0') ?? '0032') +       
    (objGR?.quorumOfGM?.toString(16).padStart(4, '0') ?? '1388') +       
    (objGR?.maxNumOfDirectors?.toString(16).padStart(4, '0') ?? '0007') +       
    (objGR?.tenureMonOfBoard?.toString(16).padStart(4, '0') ?? '0024') +       
    (objGR?.quorumOfBoardMeeting?.toString(16).padStart(4, '0') ?? '1388') +       
    (objGR?.establishedDate?.toString(16).padStart(12, '0') ?? '00005d751e78') +       
    (objGR?.businessTermInYears?.toString(16).padStart(4, '0') ?? '0014') +                 
    (objGR?.typeOfComp?.toString(16).padStart(2, '0') ?? '01') +                 
    '0000'
  }`;

  // console.log('objGR: ', objGR);

  const [ newHexGR, setNewHexGR ] = useState<HexType>(Bytes32Zero);

  let newGR: GovernanceRuleType = {
    basedOnPar: newHexGR?.substring(10, 12) === '01',
    proposeWeightRatioOfGM: parseInt(newHexGR?.substring(12,16), 16),
    proposeHeadRatioOfMembers: parseInt(newHexGR?.substring(16, 20), 16),
    proposeHeadNumOfDirectors: parseInt(newHexGR?.substring(20, 24), 16),
    maxQtyOfMembers: parseInt(newHexGR?.substring(24, 28), 16),
    quorumOfGM: parseInt(newHexGR?.substring(28, 32), 16),
    maxNumOfDirectors: parseInt(newHexGR?.substring(32, 36), 16),
    tenureMonOfBoard: parseInt(newHexGR?.substring(36, 40), 16),
    quorumOfBoardMeeting: parseInt(newHexGR?.substring(40, 44), 16),
    establishedDate: parseInt(newHexGR?.substring(44, 56), 16),
    businessTermInYears: parseInt(newHexGR?.substring(56, 60), 16),
    typeOfComp: parseInt(newHexGR?.substring(60, 62), 16),
  } 

  // console.log('newGR: ', newGR);

  const [ editable, setEditable ] = useState<boolean>(false); 

  return (
    <>
      <Paper sx={{ m:1, p:1, border:1, borderColor:'divider'}} >
        <Box sx={{ width:1440 }}>
          <Stack direction={'row'} sx={{ alignItems:'center' }}>
            <Toolbar>
              <h4>Governance Rule</h4>
            </Toolbar>
          </Stack>
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
                <h4>Rule No. 0 </h4>
              </Toolbar>

              <AddRule 
                sha={ addr }
                rule={ hexGR }
                setUpdatedRule={ setNewHexGR }
                editable={ editable }
                setEditable={ setEditable }
              />
              
            </Stack>

            <Stack 
              direction={'column'} 
              spacing={1} 
            >

              <Stack direction={'row'} sx={{ alignItems: 'center', }} >
                {/* <h6>System Record</h6> */}
                <TextField 
                  variant='filled'
                  label='BasedOnPar'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newGR?.basedOnPar ? 'True' : 'False' }
                />

                <TextField 
                  variant='filled'
                  label='ProposeWeightRatioOfGM'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={toPercent(newGR?.proposeWeightRatioOfGM ?? 0)}
                />

                <TextField 
                  variant='filled'
                  label='ProposeHeadRatioOfMembers'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={toPercent(newGR?.proposeHeadRatioOfMembers ?? 0)}
                />

                {newGR?.proposeHeadNumOfDirectors != undefined && (
                  <TextField 
                    variant='filled'
                    label='ProposeHeadNumOfDirectors'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newGR.proposeHeadNumOfDirectors.toString()}
                  />
                )}

                {newGR?.maxQtyOfMembers != undefined && (
                  <TextField 
                    variant='filled'
                    label='MaxQtyOfMembers'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newGR.maxQtyOfMembers.toString()}
                  />
                )}

                {newGR?.quorumOfGM != undefined && (
                  <TextField 
                    variant='filled'
                    label='QuorumOfGM'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ toPercent(newGR.quorumOfGM)}
                  />
                )}
              </Stack>

              <Collapse in={ editable }>
                <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >
                  {/* <Collapse in={ false } >   */}            

                    {/* <h6>Update Info</h6> */}
                    
                    <Box sx={{ minWidth: 218, m: 1 }} >
                      <FormControlLabel 
                        label='BasedOnPar'
                        control={
                          <Checkbox 
                            sx={{
                              m: 1,
                              height: 64,
                            }}
                            onChange={e => setObjGR(v => ({
                              ...v,
                              basedOnPar: e.target.checked,
                            }))}
                            checked={ objGR?.basedOnPar }
                            defaultChecked={ false }
                          />
                        }
                      />
                    </Box>
                  

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
                      value={ objGR?.proposeWeightRatioOfGM }              
                      defaultValue='1000'
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
                      value={ objGR?.proposeHeadRatioOfMembers }
                      defaultValue='0'                                      
                    />

                    <TextField 
                      variant='filled'
                      label='ProposeHeadNumOfDirectors'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setObjGR((v) => ({
                        ...v,
                        proposeHeadNumOfDirectors: parseInt(e.target.value),
                      }))}
                      value={ objGR?.proposeHeadNumOfDirectors }
                      defaultValue='1'                          
                    />

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
                      value={ objGR?.maxQtyOfMembers?.toString() } 
                      defaultValue='50'                        
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
                      value={ objGR?.quorumOfGM }
                      defaultValue='5000'                          
                    />

                  {/* </Collapse> */}
                </Stack>
              </Collapse>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                {newGR?.maxNumOfDirectors != undefined && (
                  <TextField 
                    variant='filled'
                    label='MaxNumOfDirectors'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newGR.maxNumOfDirectors.toString()}
                  />
                )}

                {newGR?.tenureMonOfBoard != undefined && (
                  <TextField 
                    variant='filled'
                    label='TenureMonOfBoard'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newGR.tenureMonOfBoard.toString()}
                  />
                )}

                {newGR?.quorumOfBoardMeeting != undefined && (
                  <TextField 
                    variant='filled'
                    label='QuorumOfBoardMeeting'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newGR.quorumOfBoardMeeting.toString()}
                  />
                )}

                {newGR?.establishedDate != undefined && (
                  <TextField 
                    variant='filled'
                    label='EstablishedDate'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={dateParser(newGR.establishedDate)}
                  />
                )}

                {newGR?.businessTermInYears != undefined && (
                  <TextField 
                    variant='filled'
                    label='BusinessTermInYears'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newGR.businessTermInYears.toString()}
                  />
                )}

                {newGR?.typeOfComp != undefined && (
                  <TextField 
                    variant='filled'
                    label='TypeOfComp'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newGR.typeOfComp.toString()}
                  />
                )}
              </Stack>

              <Collapse in={ editable }>
                <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >
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
                    value={ objGR?.maxNumOfDirectors }
                    defaultValue='7'

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
                    value={ objGR?.tenureMonOfBoard } 
                    defaultValue='36'                                                     
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
                    value={ objGR?.quorumOfBoardMeeting }   
                    defaultValue='5000'                                                   
                  />

                  <TextField 
                    variant='filled'
                    label='EstablishedDate'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjGR((v) => ({
                      ...v,
                      establishedDate: parseInt(e.target.value),
                    }))}
                    value={ objGR?.establishedDate }
                    defaultValue={ Number(new Date('2019-09-08 23:30:00.000')) / 1000 }                                                                  
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
                    value={ objGR?.businessTermInYears }
                    defaultValue='20'
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
                    value={ objGR?.typeOfComp }
                    defaultValue='1'                                                      
                  />
                </Stack>
              </Collapse>

            </Stack>
          </Paper>
        </Box>
      </Paper>
    </> 
  )
}
