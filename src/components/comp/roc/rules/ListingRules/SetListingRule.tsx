
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
import { centToDollar, onlyNum, toPercent } from '../../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { titleOfPositions } from '../PositionAllocationRules/SetPositionAllocateRule';
import { RulesEditProps } from '../GovernanceRules/SetGovernanceRule';
import { getRule } from '../../../../../scripts/comp/sha';

export interface StrListingRule {
  seqOfRule: string;
  titleOfIssuer: string;
  classOfShare: string;
  maxTotalPar: string;
  titleOfVerifier: string;
  maxQtyOfInvestors: string;
  ceilingPrice: string;
  floorPrice: string;
  lockupDays: string;
  offPrice: string;
  votingWeight: string;  
}

export var strDefaultLR: StrListingRule = {
  seqOfRule: '0',
  titleOfIssuer: '2',
  classOfShare: '0',
  maxTotalPar: '0',
  titleOfVerifier: '1',
  maxQtyOfInvestors: '0',
  ceilingPrice: '0',
  floorPrice: '0',
  lockupDays: '0',
  offPrice: '0',
  votingWeight: '100',
}

export function strLRParser(hexLr: HexType):StrListingRule {
  let rule: StrListingRule = {
    seqOfRule: parseInt(hexLr.substring(2, 6), 16).toString(), 
    titleOfIssuer: parseInt(hexLr.substring(6, 10), 16).toString(),
    classOfShare: parseInt(hexLr.substring(10, 14), 16).toString(),
    maxTotalPar: BigInt('0x' + hexLr.substring(14, 30)).toString(),
    titleOfVerifier: parseInt(hexLr.substring(30, 34), 16).toString(),
    maxQtyOfInvestors: parseInt(hexLr.substring(34, 38), 16).toString(),
    ceilingPrice: parseInt(hexLr.substring(38, 46), 16).toString(),
    floorPrice: parseInt(hexLr.substring(46, 54), 16).toString(),
    lockupDays: parseInt(hexLr.substring(54, 58), 16).toString(),
    offPrice: parseInt(hexLr.substring(58, 62), 16).toString(),
    votingWeight: parseInt(hexLr.substring(62, 66), 16).toString(),  
  }
  return rule;
}

export function strLRCodifier(objLr: StrListingRule ): HexType {
  let hexLr: HexType = `0x${
    (Number(objLr.seqOfRule).toString(16).padStart(4, '0')) +
    (Number(objLr.titleOfIssuer).toString(16).padStart(4, '0')) +
    (Number(objLr.classOfShare).toString(16).padStart(4, '0')) +
    (BigInt(objLr.maxTotalPar).toString(16).padStart(16, '0')) +
    (Number(objLr.titleOfVerifier).toString(16).padStart(4, '0')) +
    (Number(objLr.maxQtyOfInvestors).toString(16).padStart(4, '0')) +
    (Number(objLr.ceilingPrice).toString(16).padStart(8, '0')) +
    (Number(objLr.floorPrice).toString(16).padStart(8, '0')) +
    (Number(objLr.lockupDays).toString(16).padStart(4, '0')) +
    (Number(objLr.offPrice).toString(16).padStart(4, '0')) +
    (Number(objLr.votingWeight).toString(16).padStart(4, '0'))
  }`;
  return hexLr;
}

// ==== Interface Num ====
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

export function SetListingRule({ sha, seq, isFinalized, time, refresh }: RulesEditProps) {

  defaultLR = {...defaultLR, seqOfRule: seq};

  const [ objLR, setObjLR ] = useState<StrListingRule>(strDefaultLR);   
  const [ valid, setValid ] = useState(true);
  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    getRule(sha, seq).then(
      res => setObjLR(strLRParser(res))
    );
  }, [sha, seq, time]); 

  return (
    <>
      <Button
        variant={ Number(objLR.seqOfRule) == seq ? 'contained' : 'outlined' }
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
                rule={ strLRCodifier(objLR) }
                isFinalized={ isFinalized }
                valid={valid}
                refresh={refresh}
                setOpen={setOpen}
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
                  label='ClassOfShare'
                  error={ onlyNum(objLR.classOfShare, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objLR.classOfShare, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjLR((v) => ({
                    ...v,
                    classOfShare: e.target.value,
                  }))}
                  value={ objLR.classOfShare } 
                />

                {!isFinalized && (
                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="titleOfIssuer-label">TitleOfIssuer</InputLabel>
                    <Select
                      labelId="titleOfIssuer-label"
                      id="titleOfIssuer-select"
                      label="TitleOfIssuer"
                      value={ objLR.titleOfIssuer }
                      onChange={(e) => setObjLR((v) => ({
                        ...v,
                        titleOfIssuer: e.target.value.toString(),
                      }))}
                    >
                      {titleOfPositions.map((v, i) => (
                        <MenuItem key={i} value={i + 1}>{v}</MenuItem>
                      )) }

                    </Select>
                  </FormControl>
                )}
                {isFinalized && (
                  <TextField 
                    variant='outlined'
                    size='small'
                    label='TitleOfIssuer'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ titleOfPositions[ (Number(objLR.titleOfIssuer) < 1 ? 1 : Number(objLR.titleOfIssuer)) - 1 ] }
                  />
                )}

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'MaxTotalPar ' + (isFinalized ? '(Dollar)' : '(Cent)')}
                  error={ onlyNum(objLR.maxTotalPar, BigInt(2**64-1), setValid).error }
                  helperText={ onlyNum(objLR.maxTotalPar, BigInt(2**64-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjLR((v) => ({
                    ...v,
                    maxTotalPar: e.target.value,
                  }))}
                  value={ isFinalized ? centToDollar(objLR.maxTotalPar) : objLR.maxTotalPar }
                />

                {!isFinalized && (
                  <FormControl variant="outlined" size='small' sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="titleOfVerifier-label">TitleOfVerifier</InputLabel>
                    <Select
                      labelId="titleOfVerifier-label"
                      id="titleOfVerifier-select"
                      label="TitleOfIssuer"
                      value={ objLR.titleOfVerifier }
                      onChange={(e) => setObjLR((v) => ({
                        ...v,
                        titleOfVerifier: e.target.value.toString(),
                      }))}
                    >
                  
                      {titleOfPositions.map((v, i) => (
                        <MenuItem key={i} value={i + 1}>{v}</MenuItem>
                      )) }

                    </Select>
                  </FormControl>
                )}
                {isFinalized && (
                  <TextField 
                    variant='outlined'
                    size='small'
                    label='TitleOfVerifier'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ titleOfPositions[ (Number(objLR.titleOfVerifier) < 1 ? 1 : Number(objLR.titleOfVerifier)) - 1 ] }
                  />
                )}

                <TextField 
                  variant='outlined'
                  size='small'
                  label='MaxQtyOfInvestors'
                  error={ onlyNum(objLR.maxQtyOfInvestors, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objLR.maxQtyOfInvestors, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjLR((v) => ({
                    ...v,
                    maxQtyOfInvestors: e.target.value,
                  }))}
                  value={ objLR.maxQtyOfInvestors }
                />

              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'CeilingPrice ' + (isFinalized ? '(Dollar)' : '(Cent)')}
                  error={ onlyNum(objLR.ceilingPrice, BigInt(2**32-1), setValid).error }
                  helperText={ onlyNum(objLR.ceilingPrice, BigInt(2**32-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjLR((v) => ({
                    ...v,
                    ceilingPrice: e.target.value,
                  }))}
                  value={ isFinalized ? centToDollar(objLR.ceilingPrice) : objLR.ceilingPrice }   
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'FloorPrice ' + (isFinalized ? '(Dollar)' : '(Cent)')}
                  error={ onlyNum(objLR.floorPrice, BigInt(2**32-1), setValid).error }
                  helperText={ onlyNum(objLR.floorPrice, BigInt(2**32-1), setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjLR((v) => ({
                    ...v,
                    floorPrice: e.target.value,
                  }))}
                  value={ isFinalized ? centToDollar(objLR.floorPrice) : objLR.floorPrice }   
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'OffPrice ' + (isFinalized ? '(Dollar)' : '(Cent)')}
                  error={ onlyNum(objLR.offPrice, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objLR.offPrice, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjLR((v) => ({
                    ...v,
                    offPrice: e.target.value,
                  }))}
                  value={ isFinalized ? centToDollar(objLR.offPrice) : objLR.offPrice }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='LockupDays'
                  error={ onlyNum(objLR.lockupDays, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objLR.lockupDays, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjLR((v) => ({
                    ...v,
                    lockupDays: e.target.value,
                  }))}
                  value={ objLR.lockupDays }   
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='VotingWeight (%)'
                  error={ onlyNum(objLR.votingWeight, MaxSeqNo, setValid).error }
                  helperText={ onlyNum(objLR.votingWeight, MaxSeqNo, setValid).helpTx }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjLR((v) => ({
                    ...v,
                    votingWeight: e.target.value ,
                  }))}
                  value={ isFinalized ? toPercent(objLR.votingWeight) : objLR.votingWeight }   
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
