
import { useState } from 'react';

import { 
  Stack,
  TextField,
  Paper,
  Toolbar,
  Box,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { AddRule } from '../AddRule'

import { HexType } from '../../../../../scripts/common';
import { ListAlt } from '@mui/icons-material';
import { longSnParser } from '../../../../../scripts/common/toolsKit';
import { SetRuleProps } from '../VotingRules/SetVotingRule';
import { useShareholdersAgreementGetRule } from '../../../../../generated';


export interface FirstRefusalRule {
  seqOfRule: number;
  qtyOfSubRule: number;
  seqOfSubRule: number;
  typeOfDeal: number;
  membersEqual: boolean;
  proRata: boolean;
  basedOnPar: boolean;
  rightholders: number[];
  para: number;
  argu: number;
}

export interface FirstRefusalRuleWrap {
  subTitle: string;
  rule: FirstRefusalRule;
}

interface SetFirstRefusalRuleProps {
  sha: HexType,
  seq: number,
  isFinalized: boolean,
}

export function frCodifier(rule: FirstRefusalRule): HexType {
  let hexFR: HexType = `0x${
    (rule.seqOfRule.toString(16).padStart(4, '0')) +
    (rule.qtyOfSubRule.toString(16).padStart(2, '0')) +
    (rule.seqOfSubRule.toString(16).padStart(2, '0')) +
    (rule.typeOfDeal.toString(16).padStart(2, '0')) +
    (rule.membersEqual ? '01' : '00') +
    (rule.proRata ? '01' : '00') +
    (rule.basedOnPar ? '01' : '00') +
    (rule.rightholders[0]?.toString(16).padStart(10, '0')) +
    (rule.rightholders[1]?.toString(16).padStart(10, '0')) +
    (rule.rightholders[2]?.toString(16).padStart(10, '0')) +
    (rule.rightholders[3]?.toString(16).padStart(10, '0')) +
    (rule.para.toString(16).padStart(4, '0')) +
    (rule.argu.toString(16).padStart(4, '0'))
  }`;

  return hexFR;
}

export function frParser(hexRule: HexType ): FirstRefusalRule {
  let rule: FirstRefusalRule = {
    seqOfRule: parseInt(hexRule.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(hexRule.substring(6, 8), 16),
    seqOfSubRule: parseInt(hexRule.substring(8, 10), 16),
    typeOfDeal: parseInt(hexRule.substring(10, 12), 16),
    membersEqual: hexRule.substring(12, 14) === '01',
    proRata: hexRule.substring(14, 16) === '01',
    basedOnPar: hexRule.substring(16, 18) === '01',
    rightholders: [
      parseInt(hexRule.substring(18, 28), 16),
      parseInt(hexRule.substring(28, 38), 16),
      parseInt(hexRule.substring(38, 48), 16),
      parseInt(hexRule.substring(48, 58), 16),
    ],
    para: parseInt(hexRule.substring(58, 62), 16),
    argu: parseInt(hexRule.substring(62, 66), 16),
  }; 
  
  return rule;
} 

const subTitles: string[] = [
  '- For Capital Increase ',
  '- For External Transfer ',
  '- Newly Added First Refusal Rule', 
]

const defaultRules: FirstRefusalRule[] = [
  { seqOfRule: 512, 
    qtyOfSubRule: 2, 
    seqOfSubRule: 1,
    typeOfDeal: 1,
    membersEqual: true,
    proRata: true,
    basedOnPar: false,
    rightholders: [0,0,0,0],
    para: 0,
    argu: 0,
  },
  { seqOfRule: 513, 
    qtyOfSubRule: 2, 
    seqOfSubRule: 2,
    typeOfDeal: 2,
    membersEqual: true,
    proRata: true,
    basedOnPar: false,
    rightholders: [0,0,0,0],
    para: 0,
    argu: 0,
  }
]

export const typesOfDeal = ['Capital Increase', 'External Transfer', 'Internal Transfer', 'CI & EXT', 'EXT & INT', 'CI & EXT & INT', 'CI & EXT'];

export function SetFirstRefusalRule({ sha, seq, isFinalized, getRules }: SetRuleProps) {

  const defFR: FirstRefusalRule = 
      { seqOfRule: seq, 
        qtyOfSubRule: seq - 511, 
        seqOfSubRule: seq - 511,
        typeOfDeal: 2,
        membersEqual: true,
        proRata: true,
        basedOnPar: false,
        rightholders: [0,0,0,0],
        para: 0,
        argu: 0,
      };

  let subTitle: string = (seq < 514) ? subTitles[seq - 512] : subTitles[2]; 

  const [ objFR, setObjFR ] = useState<FirstRefusalRule>(seq < 514 ? defaultRules[seq - 512] : defFR); 

  const [ newFR, setNewFR ] = useState<FirstRefusalRule>(defFR);

  const [ editable, setEditable ] = useState<boolean>(false); 

  const {
    refetch: obtainRule
  } = useShareholdersAgreementGetRule({
    address: sha,
    args: [ BigInt(seq) ],
    onSuccess(res) {
      setNewFR(frParser(res))
    }
  })

  const [ open, setOpen ] = useState(false);

  return (
    <>
      <Button
        variant={ newFR && newFR.seqOfRule > 0 ? "contained" : "outlined" }
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
                  <h4>Rule No. {seq} - FirstRefusalRight for { typesOfDeal[newFR.typeOfDeal -1] }  </h4>
                </Toolbar>
              </Box>

              <AddRule 
                sha={ sha }
                rule={ frCodifier(objFR) }
                refreshRule={ obtainRule }
                editable = { editable }
                setEditable={ setEditable }
                isFinalized={isFinalized}
                getRules={getRules}
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
                    value={ newFR.seqOfRule.toString() }
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
                    value={ newFR.qtyOfSubRule.toString() }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='TypeOfDeal'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ typesOfDeal[newFR.typeOfDeal -1] }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='MembersEqual ?'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newFR.membersEqual ? 'True' : 'False'}
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='ProRata ?'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newFR.proRata ? 'True' : 'False'}
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='BasedOnPar ?'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={newFR.basedOnPar ? 'True' : 'False'}
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
                    onChange={(e) => setObjFR((v) => ({
                      ...v,
                      seqOfRule: parseInt(e.target.value),
                    }))}
                    value={ objFR.seqOfRule }              
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='QtyOfSubRule'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjFR((v) => ({
                      ...v,
                      qtyOfSubRule: parseInt(e.target.value),
                    }))}
                    value={ objFR.qtyOfSubRule }              
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='TypeOfDeal'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjFR((v) => ({
                      ...v,
                      typeOfDeal: parseInt(e.target.value),
                    }))}
                    value={ objFR.typeOfDeal }              
                  />

                  <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="membersEqual-label">MembersEqual ?</InputLabel>
                    <Select
                      labelId="membersEqual-label"
                      id="membersEqual-select"
                      label="MembersEqual ?"
                      value={ objFR?.membersEqual ? '1' : '0' }
                      onChange={(e) => setObjFR((v) => ({
                        ...v,
                        membersEqual: e.target.value == '1',
                      }))}
                    >
                      <MenuItem value={'1'}>True</MenuItem>
                      <MenuItem value={'0'}>False</MenuItem>
                    </Select>
                  </FormControl>


                  <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="proRata-label">ProRata ?</InputLabel>
                    <Select
                      labelId="proRata-label"
                      id="proRata-select"
                      label="ProRata ?"
                      value={ objFR.proRata ? '1' : '0' }
                      onChange={(e) => setObjFR((v) => ({
                        ...v,
                        proRata: e.target.value == '1',
                      }))}
                    >
                      <MenuItem value={'1'}>True</MenuItem>
                      <MenuItem value={'0'}>False</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="basedOnPar-label">BasedOnPar ?</InputLabel>
                    <Select
                      labelId="basedOnPar-label"
                      id="basedOnPar-select"
                      label="BasedOnPar ?"
                      value={ objFR.basedOnPar ? '1' : '0' }
                      onChange={(e) => setObjFR((v) => ({
                        ...v,
                        basedOnPar: e.target.value == '1',
                      }))}
                    >
                      <MenuItem value={'1'}>True</MenuItem>
                      <MenuItem value={'0'}>False</MenuItem>
                    </Select>
                  </FormControl>

                </Stack>
              </Collapse>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  size='small'
                  label='Rightholder_1'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longSnParser(newFR.rightholders[0].toString()) }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='Rightholder_2'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longSnParser(newFR.rightholders[1].toString()) }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='Rightholder_3'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longSnParser(newFR.rightholders[2].toString()) }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='Rightholder_4'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longSnParser(newFR.rightholders[3].toString()) }
                />

              </Stack>

              <Collapse in={ editable && !isFinalized } >
                <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='Rightholder_1'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjFR((v) => {
                      let holders = [...v.rightholders];
                      holders[0] = parseInt(e.target.value);
                      return {...v, rightholders: holders};
                    })}
                    value={ objFR.rightholders[0] }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='Rightholder_2'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjFR((v) => {
                      let holders = [...v.rightholders];
                      holders[1] = parseInt(e.target.value);
                      return {...v, rightholders: holders};
                    })}
                    value={ objFR.rightholders[1] }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='Rightholder_3'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjFR((v) => {
                      let holders = [...v.rightholders];
                      holders[2] = parseInt(e.target.value);
                      return {...v, rightholders: holders};
                    })}
                    value={ objFR.rightholders[2] }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='Rightholder_4'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjFR((v) => {
                      let holders = [...v.rightholders];
                      holders[3] = parseInt(e.target.value);
                      return {...v, rightholders: holders};
                    })}
                    value={ objFR.rightholders[3] }
                  />

                </Stack>
              </Collapse>

            </Stack>

          </Paper>

        </DialogContent>
      
        <DialogActions>
          <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>
    </> 
  )
}
