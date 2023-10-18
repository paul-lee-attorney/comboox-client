
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
  FormHelperText,
} from '@mui/material';
import { AddRule } from '../AddRule';
import { HexType, MaxData, MaxPrice, MaxSeqNo } from '../../../../../scripts/common';
import { FormResults, centToDollar, defFormResults, onlyNum, toPercent } from '../../../../../scripts/common/toolsKit';
import { ListAlt } from '@mui/icons-material';
import { titleOfPositions } from '../PositionAllocationRules/SetPositionAllocateRule';
import { RulesEditProps } from '../GovernanceRules/SetGovernanceRule';
import { getRule } from '../../../../../scripts/comp/sha';

export interface ListingRule {
  seqOfRule: number;
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

export var defaultLR: ListingRule = {
  seqOfRule: 0,
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

export function lrParser(hexLr: HexType):ListingRule {
  let rule: ListingRule = {
    seqOfRule: parseInt(hexLr.substring(2, 6), 16), 
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

export function lrCodifier(objLr: ListingRule, seq: number ): HexType {
  let hexLr: HexType = `0x${
    (seq.toString(16).padStart(4, '0')) +
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

export function SetListingRule({ sha, seq, isFinalized, time, refresh }: RulesEditProps) {

  defaultLR = {...defaultLR, seqOfRule: seq};

  const [ objLR, setObjLR ] = useState<ListingRule>(defaultLR);   
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    getRule(sha, seq).then(
      res => setObjLR(lrParser(res))
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
                rule={ lrCodifier(objLR, seq) }
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
                  error={ valid['ClassOfShare']?.error }
                  helperText={ valid['ClassOfShare']?.helpTx ?? ' ' }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('ClassOfShare', input, MaxSeqNo, setValid);
                    setObjLR((v) => ({
                      ...v,
                      classOfShare: input,
                    }));
                  }}
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
                    <FormHelperText>{' '}</FormHelperText>
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
                  error={ valid['MaxTotalPar']?.error }
                  helperText={ valid['MaxTotalPar']?.helpTx ?? ' ' }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('MxTotalPar', input, MaxData, setValid);
                    setObjLR((v) => ({
                      ...v,
                      maxTotalPar: input,
                    }));
                  }}
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
                    <FormHelperText>{' '}</FormHelperText>
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
                  error={ valid['MaxQtyOfInvestors']?.error }
                  helperText={ valid['MaxQtyOfInvestors']?.helpTx ?? ' ' }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('MaxQtyOfInvestors', input, MaxSeqNo, setValid);
                    setObjLR((v) => ({
                      ...v,
                      maxQtyOfInvestors: input,
                    }));
                  }}
                  value={ objLR.maxQtyOfInvestors }
                />

              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'CeilingPrice ' + (isFinalized ? '(Dollar)' : '(Cent)')}
                  error={ valid['CeilingPrice']?.error }
                  helperText={ valid['CeilingPrice']?.helpTx ?? ' ' }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('CeilingPrice', input, MaxPrice, setValid);
                    setObjLR((v) => ({
                      ...v,
                      ceilingPrice: input,
                    }));
                  }}
                  value={ isFinalized ? centToDollar(objLR.ceilingPrice) : objLR.ceilingPrice }   
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'FloorPrice ' + (isFinalized ? '(Dollar)' : '(Cent)')}
                  error={ valid['FloorPrice']?.error }
                  helperText={ valid['FloorPrice']?.helpTx ?? ' ' }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('FloorPrice', input, MaxPrice, setValid);
                    setObjLR((v) => ({
                      ...v,
                      floorPrice: input,
                    }));
                  }}
                  value={ isFinalized ? centToDollar(objLR.floorPrice) : objLR.floorPrice }   
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label={'OffPrice ' + (isFinalized ? '(Dollar)' : '(Cent)')}
                  error={ valid['OffPrice']?.error }
                  helperText={ valid['OffPrice']?.helpTx ?? ' ' }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('OffPrice', input, MaxSeqNo, setValid);
                    setObjLR((v) => ({
                      ...v,
                      offPrice: input,
                    }));
                  }}
                  value={ isFinalized ? centToDollar(objLR.offPrice) : objLR.offPrice }
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='LockupDays'
                  error={ valid['LockupDays']?.error }
                  helperText={ valid['LockupDays']?.helpTx ?? ' ' }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('LockupDays', input, MaxSeqNo, setValid);
                    setObjLR((v) => ({
                      ...v,
                      lockupDays: input,
                    }));
                  }}
                  value={ objLR.lockupDays }   
                />

                <TextField 
                  variant='outlined'
                  size='small'
                  label='VotingWeight (%)'
                  error={ valid['VotingWeight']?.error }
                  helperText={ valid['VotingWeight']?.helpTx ?? ' ' }
                  inputProps={{readOnly: isFinalized}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('VotingWeight', input, MaxSeqNo, setValid);
                    setObjLR((v) => ({
                      ...v,
                      votingWeight: input,
                    }));
                  }}
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
