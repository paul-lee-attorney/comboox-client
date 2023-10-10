
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
import { longDataParser } from '../../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { titleOfPositions } from '../PositionAllocationRules/SetPositionAllocateRule';
import { RulesEditProps } from '../GovernanceRules/SetGovernanceRule';
import { getRule } from '../../../../../scripts/comp/sha';

export interface ListingRule {
  seqOfRule: number;
  titleOfIssuer: number;
  classOfShare: number;
  maxTotalPar: bigint;
  titleOfVerifier: number;
  maxQtyOfInvestors: number;
  ceilingPrice: number;
  floorPrice: number;
  lockupDays: number;
  offPrice: number;
  votingWeight: number;  
}

export var defaultLR: ListingRule = {
  seqOfRule: 0,
  titleOfIssuer: 2,
  classOfShare: 0,
  maxTotalPar: BigInt(0),
  titleOfVerifier: 1,
  maxQtyOfInvestors: 0,
  ceilingPrice: 0,
  floorPrice: 0,
  lockupDays: 0,
  offPrice: 0,
  votingWeight: 100,
}

export function lrParser(hexLr: HexType):ListingRule {
  let rule: ListingRule = {
    seqOfRule: parseInt(hexLr.substring(2, 6), 16), 
    titleOfIssuer: parseInt(hexLr.substring(6, 10), 16),
    classOfShare: parseInt(hexLr.substring(10, 14), 16),
    maxTotalPar: BigInt('0x' + hexLr.substring(14, 30)),
    titleOfVerifier: parseInt(hexLr.substring(30, 34), 16),
    maxQtyOfInvestors: parseInt(hexLr.substring(34, 38), 16),
    ceilingPrice: parseInt(hexLr.substring(38, 46), 16),
    floorPrice: parseInt(hexLr.substring(46, 54), 16),
    lockupDays: parseInt(hexLr.substring(54, 58), 16),
    offPrice: parseInt(hexLr.substring(58, 62), 16),
    votingWeight: parseInt(hexLr.substring(62, 66), 16),  
  }
  return rule;
}

export function lrCodifier(objLr: ListingRule ): HexType {
  let hexLr: HexType = `0x${
    (objLr.seqOfRule.toString(16).padStart(4, '0')) +
    (objLr.titleOfIssuer.toString(16).padStart(4, '0')) +
    (objLr.classOfShare.toString(16).padStart(4, '0')) +
    (objLr.maxTotalPar.toString(16).padStart(16, '0')) +
    (objLr.titleOfVerifier.toString(16).padStart(4, '0')) +
    (objLr.maxQtyOfInvestors.toString(16).padStart(4, '0')) +
    (objLr.ceilingPrice.toString(16).padStart(8, '0')) +
    (objLr.floorPrice.toString(16).padStart(8, '0')) +
    (objLr.lockupDays.toString(16).padStart(4, '0')) +
    (objLr.offPrice.toString(16).padStart(4, '0')) +
    (objLr.votingWeight.toString(16).padStart(4, '0'))
  }`;
  return hexLr;
}

export function SetListingRule({ sha, seq, isFinalized, time, setTime }: RulesEditProps) {

  defaultLR = {...defaultLR, seqOfRule: seq};

  const [ objLR, setObjLR ] = useState<ListingRule>(defaultLR);   
  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    getRule(sha, seq).then(
      res => setObjLR(lrParser(res))
    );
  }, [sha, seq, time]); 

  return (
    <>
      <Button
        variant={ objLR.seqOfRule == seq ? 'contained' : 'outlined' }
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
                  <h4>Listing Rule - No. { seq } </h4>
                </Toolbar>
              </Box>

              <AddRule
                sha={ sha }
                rule={ lrCodifier(objLR) }
                isFinalized={ isFinalized }
                setTime={setTime}
                setOpen={setOpen}
              />
              
            </Stack>

            <Stack
              direction={'column'}
              spacing={1}
            >

              {isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='ClassOfShare'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ objLR.classOfShare.toString() }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='TitleOfIssuer'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ titleOfPositions[ (objLR.titleOfIssuer < 1 ? 1 : objLR.titleOfIssuer) - 1 ] }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='MaxTotalPar (Cent)'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longDataParser(objLR.maxTotalPar.toString()) }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='TitleOfVerifier'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ titleOfPositions[ (objLR.titleOfVerifier < 1 ? 1 : objLR.titleOfVerifier) - 1 ] }
                  />

                    <TextField 
                      variant='outlined'
                      size='small'
                      label='MaxQtyOfInvestors'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ objLR.maxQtyOfInvestors }                                    
                    />


                </Stack>
              )}

              {!isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='ClassOfShare'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjLR((v) => ({
                      ...v,
                      classOfShare: parseInt( e.target.value ?? '0'),
                    }))}
                    value={ objLR.classOfShare } 
                  />

                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="titleOfIssuer-label">TitleOfIssuer</InputLabel>
                    <Select
                      labelId="titleOfIssuer-label"
                      id="titleOfIssuer-select"
                      label="TitleOfIssuer"
                      value={ objLR.titleOfIssuer }
                      onChange={(e) => setObjLR((v) => ({
                        ...v,
                        titleOfIssuer: parseInt( e.target.value.toString() ),
                      }))}
                    >
                      {titleOfPositions.map((v, i) => (
                        <MenuItem key={i} value={i + 1}>{v}</MenuItem>
                      )) }

                    </Select>
                  </FormControl>

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='MaxTotalPar (Cent)'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjLR((v) => ({
                      ...v,
                      maxTotalPar: BigInt(e.target.value ?? '0'),
                    }))}
                    value={ objLR.maxTotalPar.toString() }
                  />

                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="titleOfVerifier-label">TitleOfVerifier</InputLabel>
                    <Select
                      labelId="titleOfVerifier-label"
                      id="titleOfVerifier-select"
                      label="TitleOfIssuer"
                      value={ objLR.titleOfVerifier }
                      onChange={(e) => setObjLR((v) => ({
                        ...v,
                        titleOfVerifier: parseInt( e.target.value.toString() ),
                      }))}
                    >
                  
                      {titleOfPositions.map((v, i) => (
                        <MenuItem key={i} value={i + 1}>{v}</MenuItem>
                      )) }

                    </Select>
                  </FormControl>

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='MaxQtyOfInvestors'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjLR((v) => ({
                      ...v,
                      maxQtyOfInvestors: parseInt( e.target.value ?? '0'),
                    }))}
                    value={ objLR.maxQtyOfInvestors }                                        
                  />

                </Stack>
              )}

              {isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='CeilingPrice (Cent)'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longDataParser( objLR.ceilingPrice.toString() )}
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='FloorPrice (Cent)'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longDataParser( objLR.floorPrice.toString() )}
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='OffPrice (Cent) '
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longDataParser( objLR.offPrice.toString() ) }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='LockupDays'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ objLR.lockupDays.toString() }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='VotingWeight (%)'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ objLR.votingWeight.toString()}
                  />

                </Stack>
              )}

              {!isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='CeilingPrice (Cent)'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjLR((v) => ({
                      ...v,
                      ceilingPrice: parseInt( e.target.value ?? '0'),
                    }))}
                    value={ objLR.ceilingPrice.toString()}   
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='FloorPrice (Cent)'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjLR((v) => ({
                      ...v,
                      floorPrice: parseInt( e.target.value ?? '0'),
                    }))}
                    value={ objLR.floorPrice.toString()}   
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='OffPrice (Cent)'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjLR((v) => ({
                      ...v,
                      offPrice: parseInt( e.target.value ?? '0'),
                    }))}
                    value={ objLR.offPrice.toString()}   
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='LockupDays'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjLR((v) => ({
                      ...v,
                      lockupDays: parseInt( e.target.value ?? '0'),
                    }))}
                    value={ objLR.lockupDays.toString()}   
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='VotingWeight (%)'
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjLR((v) => ({
                      ...v,
                      votingWeight: parseInt( e.target.value ?? '0'),
                    }))}
                    value={ objLR.votingWeight.toString()}   
                  />

                </Stack>
              )}

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
