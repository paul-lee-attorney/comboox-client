import { useEffect, useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  TextField,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  FormHelperText,
} from "@mui/material";

import { 
  HexType, MaxSeqNo, MaxUserNo,
} from "../../../scripts/common";

import {
  Update,
  PersonAdd,
  PersonRemove,
  Face,
} from "@mui/icons-material"

import { 
  readContract 
} from "@wagmi/core";

import {
  sigPageABI,
  useSigPageSetTiming,
  useSigPageAddBlank,
  useSigPageRemoveBlank,
} from "../../../generated";


import { ParasOfSigPage, StrSig, getBuyers, getParasOfPage, getSellers, parseParasOfPage } from "../../../scripts/common/sigPage";
import { FormResults, dateParser, defFormResults, hasError, longSnParser, onlyInt, refreshAfterTx } from "../../../scripts/common/toolsKit";
import { AcceptSha } from "../../comp/roc/sha/Actions/AcceptSha";
import { LoadingButton } from "@mui/lab";

async function getSigsOfRole( addr: HexType, initPage: boolean, parties: readonly bigint[] ): Promise<StrSig[]> {

  let len = parties.length;
  let output: StrSig[] = [];

  while (len > 0) {

    let item = await readContract({
      address: addr,
      abi: sigPageABI,
      functionName: 'getSigOfParty',
      args: [initPage, parties[len-1]],
    });

    output.push({
      signer: Number(parties[len-1]),
      sigDate: item[1].sigDate,
      blocknumber: item[1].blocknumber.toString(),
      sigHash: item[2],
    });

    len--;
  }

  return output;
}

export interface SigPageProps {
  addr: HexType,
  initPage: boolean,
  finalized: boolean,
  isSha: boolean,
}

export function Signatures({ addr, initPage, finalized, isSha }: SigPageProps) {

  interface Timing {
    signingDays: string,
    closingDays: string,
  }

  const defaultTiming:Timing = {
    signingDays: '0',
    closingDays: '0',
  }

  const [ timing, setTiming ] = useState<Timing>(defaultTiming);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [loading, setLoading] = useState(false);
  const refresh = () => {
    setTime(Date.now());
    setLoading(false);
  }

  const {
    isLoading: setTimingLoading,
    write: writeSetTiming,
  } = useSigPageSetTiming({
    address: addr,
    args: !hasError(valid) 
        ? [ initPage, 
            BigInt(timing.signingDays), 
            BigInt(timing.closingDays)
          ] 
        : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const [ isBuyer, setIsBuyer ] = useState(true);
  const [ acct, setAcct ] = useState<string>();

  const [loadingAddBlk, setLoadingAddBlk] = useState(false);
  const refreshAddBlk = () => {
    setTime(Date.now());
    setLoadingAddBlk(false);
  }

  const {
    isLoading: addBlankIsLoading,
    write: addBlank,
  } = useSigPageAddBlank({
    address: addr,
    args: isBuyer != undefined && acct 
      ? [ initPage,
          isBuyer, 
          BigInt('1'), 
          BigInt(acct)
        ] 
      : undefined,
      onSuccess(data) {
        setLoadingAddBlk(true);
        let hash: HexType = data.hash;
        refreshAfterTx(hash, refreshAddBlk);
      }
  });

  const [loadingRemoveBlk, setLoadingRemoveBlk] = useState(false);
  const refreshRemoveBlk = () => {
    setTime(Date.now());
    setLoadingRemoveBlk(false);
  }

  const {
    isLoading: removeBlankIsLoading,
    write: removeBlank,
  } = useSigPageRemoveBlank({
    address: addr,
    args: acct 
      ? [ initPage, 
          BigInt('1'), 
          BigInt(acct)
        ] 
      : undefined,
    onSuccess(data) {
      setLoadingRemoveBlk(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refreshRemoveBlk);
    }
  });

  const [ buyerSigs, setBuyerSigs ] = useState<StrSig[]>();
  const [ sellerSigs, setSellerSigs ] = useState<StrSig[]>();  
  const [ parasOfPage, setParasOfPage ] = useState<ParasOfSigPage >();
  const [ time, setTime ] = useState<number>(0);

  useEffect(()=>{

    getParasOfPage(addr, initPage).then(
      paras => {
        setParasOfPage(parseParasOfPage(paras));
      }
    );

    getBuyers(addr, initPage).then(
      buyers => {
        getSigsOfRole(addr, initPage, buyers).then(
          sigs => setBuyerSigs(sigs)
        );
      }
    );

    getSellers(addr, initPage).then(
      sellers => {
        getSigsOfRole(addr, initPage, sellers).then(
          sigs => setSellerSigs(sigs)
        );
      }
    );

  }, [ addr, initPage, time])

  return (
    <Stack direction="column" sx={{width:'100%'}} >
      
        <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
          <Stack direction={'row'} sx={{ alignItems:'start' }} >
            <Toolbar sx={{ textDecoration:'underline', mt: 2 }}>
              <h4>Props of SigPage</h4>
            </Toolbar>

            {!finalized && initPage && (
              <>
                <TextField 
                  variant='outlined'
                  size='small'
                  label='SigningDays'
                  sx={{
                    m:1,
                    mt: 3,
                    ml: 11.2,
                    minWidth: 218,
                  }}
                  error={ valid['SigningDays']?.error }
                  helperText={ valid['SigningDays']?.helpTx ?? ' ' }

                  onChange={(e) => {
                    let input = e.target.value;
                    onlyInt('SigningDays', input, MaxSeqNo, setValid);
                    setTiming((v) => ({
                      ...v,
                      signingDays: input,
                    }))
                  }}
                  value={ timing?.signingDays }              
                />

                <TextField 
                  variant='outlined'
                      size='small'
                  label='ClosingDays'
                  error={ valid['ClosingDays']?.error }
                  helperText={ valid['ClosingDays']?.helpTx ?? ' ' }

                  sx={{
                    m:1,
                    mt:3,
                    minWidth: 218,
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyInt('ClosingDays', input, MaxSeqNo, setValid);
                    setTiming((v) => ({
                      ...v,
                      closingDays: input,
                    }))
                  }}
                  value={ timing?.closingDays }                                      
                />

                <LoadingButton
                  disabled={ setTimingLoading || hasError(valid) }
                  loading={loading}
                  loadingPosition="end"
                  variant="contained"
                  sx={{
                    height: 40,
                    m: 1,
                    mt: 3,
                  }}
                  endIcon={ <Update /> }
                  onClick={() => writeSetTiming?.()}
                >
                  Update
                </LoadingButton>
              
              </>
            )}

          </Stack>

          {parasOfPage && (
            <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >

              <Stack direction={'row'} >    
                  <TextField 
                    variant='outlined'
                      size='small'
                    label='CirculateDate'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser(parasOfPage.circulateDate.toString()) }
                  />

                  <TextField 
                    variant='outlined'
                      size='small'
                    label='SigningDays'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.signingDays }
                  />

                  <TextField 
                    variant='outlined'
                      size='small'
                    label='ClosingDays'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.closingDays }
                  />

                  <TextField 
                    variant='outlined'
                      size='small'
                    label='CounterOfBlanks'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.counterOfBlanks }
                  />

                  <TextField 
                    variant='outlined'
                      size='small'
                    label='CounterOfSigs'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.counterOfSigs }
                  />

                  <TextField 
                    variant='outlined'
                      size='small'
                    label='Established'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.established ? 'True' : 'False' }
                  />

              </Stack>

            </Paper>
          )}

        </Paper>

      <Paper elevation={3} sx={{ m:1, p:1, border:1, borderColor:'divider' }}>

        <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'space-between' }} >
          <Toolbar sx={{ textDecoration:'underline' }}>
            <h4>Signatures of Doc</h4>
          </Toolbar>

          {!initPage && finalized && isSha && (
            <AcceptSha setTime={ setTime } />
          )}

          {!finalized && initPage && (
            <Stack direction={'row'} sx={{ alignItems:'start' }} >

              <Tooltip
                title='Add Party'
                placement="top-start"
                arrow
              >
                <span>
                <IconButton 
                  disabled={ addBlankIsLoading || hasError(valid) || loadingAddBlk}
                  sx={{width: 20, height: 20, m:1, mt: 4 }} 
                  onClick={ () => addBlank?.() }
                  color="primary"
                >
                  < PersonAdd />
                </IconButton>
                </span>
              </Tooltip>

              <FormControl variant="outlined" size="small" sx={{ m: 1, mt:3, minWidth: 218 }}>
                <InputLabel id="isBuyer-label">Role</InputLabel>
                <Select
                  labelId="isBuyer-label"
                  id="isBuyer-select"
                  value={ isBuyer ? 'true' : 'false' }
                  onChange={(e) => setIsBuyer(e.target.value == 'true')}
                  label="Role"
                >
                  <MenuItem value={'true'}>{isSha ? 'Investor' : 'Buyer'}</MenuItem>
                  <MenuItem value={'false'}>{isSha? 'Shareholders' : 'Seller'}</MenuItem>
                </Select>
                <FormHelperText>{' '}</FormHelperText>
              </FormControl>

              <TextField
                variant='outlined'
                size='small'
                label='UserNo.'
                error={ valid['UserNo']?.error }
                helperText={ valid['UserNo']?.helpTx ?? ' ' }

                sx={{
                  m:1,
                  mt:3,
                  minWidth: 218,
                }}
                onChange={(e) => {
                  let input = e.target.value;
                  onlyInt('UserNo', input, MaxUserNo, setValid);
                  setAcct(input);
                }}
                value={ acct }                                      
              />

              <Tooltip
                title='Remove Party'
                placement="top-end"
                arrow
              >           
                <span>
                <IconButton
                  disabled={ removeBlankIsLoading || hasError(valid) || loadingRemoveBlk} 
                  sx={{width: 20, height: 20, m:1, mt:4, mr:2 }} 
                  onClick={ () => removeBlank?.() }
                  color="primary"
                >
                  <PersonRemove/>
                </IconButton>
                </span>

              </Tooltip>

            </Stack>
          )}

        </Stack>

        <Divider sx={{ m:1 }} flexItem />

        <Stack direction="row" >

          <Paper elevation={3} sx={{m:1, border:1, borderColor:'divider', width:700}} >
            
            <Chip
              sx={{ minWidth:168, m:1, ml:4, p:1 }}
              label={isSha ? 'Shareholders' : 'Sellers'} 
              color="primary" 
            />

            {sellerSigs?.map(v => (
              <Paper elevation={3} key={ v.signer } sx={{m:1, p:1, border:1, borderColor:'divider'}}>
            
                <Stack  direction={'row'} sx={{ alignItems:'center', justifyContent:'center' }} > 

                  <Chip
                    sx={{minWidth: 168, height: 35,
                      m:1, p:1, justifyContent:'start' }}
                    icon={<Face />}
                    size="small"
                    variant={v.sigDate > 0 
                      ? 'filled' 
                      : 'outlined'
                    }
                    color="primary"
                    label={ longSnParser(v.signer.toString()) }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='SigDate'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser(v.sigDate.toString()) }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='Blocknumber'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longSnParser(v.blocknumber) }
                  />

                </Stack>

                <TextField 
                  variant='outlined'
                  size='small'
                  label='SigHash'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 645,
                  }}
                  value={ v.sigHash }
                />

              </Paper>
            ))}

          </Paper>

          <Paper elevation={3} sx={{m:1, border:1, borderColor:'divider', width:700}} >
            
            <Chip
              sx={{ minWidth:168, m:1, ml:4, p:1 }}
              label={isSha ? 'Investors' : 'Buyers'} 
              color="success" 
            />

            {buyerSigs?.map(v => (
              <Paper elevation={3} key={ v.signer } sx={{m:1, p:1, border:1, borderColor:'divider'}}>

                <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'center' }} > 

                  <Chip
                    sx={{minWidth: 168, height:35, 
                      m:1, p:1, justifyContent:'start' }}
                    icon={<Face />}
                    size="small"
                    variant={v.sigDate > 0 
                      ? 'filled' 
                      : 'outlined'
                    }
                    color="success"
                    label={ longSnParser(v.signer.toString()) }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='SigDate'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser(v.sigDate.toString()) }
                  />

                  <TextField 
                    variant='outlined'
                    size='small'
                    label='Blocknumber'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longSnParser(v.blocknumber) }
                  />

                </Stack>

                <TextField 
                  variant='outlined'
                  size='small'
                  label='SigHash'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 645,
                  }}
                  value={ v.sigHash }
                />

              </Paper>

            ))}

          </Paper>

        </Stack>

      </Paper>
    </Stack>
  );
} 

