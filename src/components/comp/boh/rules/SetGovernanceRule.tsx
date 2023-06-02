import { useState, } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers';

import {
  Box, 
  Stack,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
  Collapse,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { AddRule } from './AddRule';

import { Bytes32Zero, ContractEditProps, ContractProps, HexType } from '../../../../interfaces';
import { dateParser, toPercent } from '../../../../scripts/toolsKit';

export interface GovernanceRule {
  basedOnPar: boolean ;
  proposeWeightRatioOfGM: number ;
  proposeHeadRatioOfMembers: number ;
  proposeHeadRatioOfDirectors: number ;
  maxQtyOfMembers: number ;
  quorumOfGM: number ;
  maxNumOfDirectors: number ;
  tenureMonOfBoard: number ;
  quorumOfBoardMeeting: number ;
  establishedDate: Dayjs | null ;
  businessTermInYears: number ;
  typeOfComp: number ; 
}

const defaultGR: GovernanceRule = {
  basedOnPar: false,
  proposeWeightRatioOfGM: 1000,
  proposeHeadRatioOfMembers: 0,
  proposeHeadRatioOfDirectors: 3333,
  maxQtyOfMembers: 50,
  quorumOfGM: 5000,
  maxNumOfDirectors: 7,
  tenureMonOfBoard: 36,
  quorumOfBoardMeeting: 3,
  establishedDate: dayjs('2019-09-09T07:30:00Z'),
  businessTermInYears: 20,
  typeOfComp: 1,   
}

export function SetGovernanceRule({ addr, finalized }: ContractEditProps) {
  const [ objGR, setObjGR ] = useState<GovernanceRule>(defaultGR);

  let hexGR: HexType = `0x${
    '0000' + '01' + '01' +
    (objGR?.basedOnPar != undefined ? objGR?.basedOnPar ? '01' : '00' : defaultGR.basedOnPar ? '01' : '00' ) +
    (objGR?.proposeWeightRatioOfGM.toString(16).padStart(4, '0') ?? defaultGR.proposeWeightRatioOfGM.toString(16).padStart(4, '0') ) +
    (objGR?.proposeHeadRatioOfMembers.toString(16).padStart(4, '0') ?? defaultGR.proposeHeadRatioOfMembers.toString(16).padStart(4, '0')) + 
    (objGR?.proposeHeadRatioOfDirectors.toString(16).padStart(4, '0') ?? defaultGR.proposeHeadRatioOfDirectors.toString(16).padStart(4, '0')) + 
    (objGR?.maxQtyOfMembers.toString(16).padStart(4, '0') ?? defaultGR.maxQtyOfMembers.toString(16).padStart(4, '0') ) +       
    (objGR?.quorumOfGM.toString(16).padStart(4, '0') ?? defaultGR.quorumOfGM.toString(16).padStart(4, '0') ) +       
    (objGR?.maxNumOfDirectors.toString(16).padStart(4, '0') ??  defaultGR.maxNumOfDirectors.toString(16).padStart(4, '0') ) +       
    (objGR?.tenureMonOfBoard.toString(16).padStart(4, '0') ?? defaultGR.tenureMonOfBoard.toString(16).padStart(4, '0') ) +       
    (objGR?.quorumOfBoardMeeting.toString(16).padStart(4, '0') ?? defaultGR.quorumOfBoardMeeting.toString(16).padStart(4, '0') ) +       
    (objGR?.establishedDate?.unix().toString(16).padStart(12, '0') ?? defaultGR.establishedDate?.unix().toString(16).padStart(12, '0') ) + 
    (objGR?.businessTermInYears.toString(16).padStart(4, '0') ?? defaultGR.businessTermInYears.toString(16).padStart(4, '0')) +                 
    (objGR?.typeOfComp.toString(16).padStart(2, '0') ?? defaultGR.typeOfComp.toString(16).padStart(2, '0') ) +                 
    '0000'
  }`;

  // console.log('objGR: ', objGR);

  const [ newHexGR, setNewHexGR ] = useState<HexType>(Bytes32Zero);

  let newGR: GovernanceRule = {
    basedOnPar: newHexGR.substring(10, 12) === '01',
    proposeWeightRatioOfGM: parseInt(newHexGR.substring(12,16), 16),
    proposeHeadRatioOfMembers: parseInt(newHexGR.substring(16, 20), 16),
    proposeHeadRatioOfDirectors: parseInt(newHexGR.substring(20, 24), 16),
    maxQtyOfMembers: parseInt(newHexGR.substring(24, 28), 16),
    quorumOfGM: parseInt(newHexGR.substring(28, 32), 16),
    maxNumOfDirectors: parseInt(newHexGR.substring(32, 36), 16),
    tenureMonOfBoard: parseInt(newHexGR.substring(36, 40), 16),
    quorumOfBoardMeeting: parseInt(newHexGR.substring(40, 44), 16),
    establishedDate: dayjs.unix(parseInt(newHexGR.substring(44, 56), 16)),
    businessTermInYears: parseInt(newHexGR.substring(56, 60), 16),
    typeOfComp: parseInt(newHexGR.substring(60, 62), 16),
  } 

  // console.log('newGR: ', newGR);

  const [ editable, setEditable ] = useState<boolean>(false); 

  return (
    <>
      <Paper sx={{ m:1, p:1, border:1, borderColor:'divider'}} >
        <Box sx={{ width:1680 }}>
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

            <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >        
              <Box sx={{ minWidth:600 }} >
                <Toolbar>
                  <h4>Rule No. 0 </h4>
                </Toolbar>
              </Box>

              <AddRule 
                sha={ addr }
                rule={ hexGR }
                setUpdatedRule={ setNewHexGR }
                editable={ editable }
                setEditable={ setEditable }
                finalized={ finalized }
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

                {newGR?.proposeHeadRatioOfDirectors != undefined && (
                  <TextField 
                    variant='filled'
                    label='ProposeHeadRatioOfDirectors'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={toPercent(newGR.proposeHeadRatioOfDirectors ?? 0)}
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

              <Collapse in={ editable && !finalized }>
                <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >
                    
                  <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="basedOnPar-label">BasedOnPar ?</InputLabel>
                    <Select
                      labelId="basedOnPar-label"
                      id="basedOnPar-select"
                      value={ objGR?.basedOnPar ? '1' : '0' }
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
                    value={ objGR?.proposeWeightRatioOfGM }              
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
                      proposeHeadRatioOfDirectors: parseInt(e.target.value),
                    }))}
                    value={ objGR?.proposeHeadRatioOfDirectors }
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
                  />

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
                    value={newGR.establishedDate.format('YYYY-MM-DD HH:mm:ss')}
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

              <Collapse in={ editable && !finalized }>
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
                  />

                  <DateTimeField
                    label='EstablishedDate'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }} 
                    value={ objGR?.establishedDate }
                    onChange={(date) => setObjGR((v) => ({
                      ...v,
                      establishedDate: date,
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
                    value={ objGR?.businessTermInYears }
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
