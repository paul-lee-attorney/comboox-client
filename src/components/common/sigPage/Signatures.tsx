import { useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  TextField,
  Button,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";

import { 
  HexType,
} from "../../../interfaces";

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
  useSigPageGetParasOfPage,
  useSigPageAddBlank,
  useSigPageRemoveBlank,
  useSigPageGetBuyers,
  useSigPageGetSellers, 
} from "../../../generated";


import { ParasOfSigPage, StrSig, parseParasOfPage } from "../../../queries/sigPage";
import { dateParser, longSnParser } from "../../../scripts/toolsKit";
import { AcceptSha } from "../../comp/boc/sha/AcceptSha";

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

interface SigPageProps {
  addr: HexType,
  initPage: boolean,
  isFinalized: boolean,
  isSha: boolean,
}


export function Signatures({ addr, initPage, isFinalized, isSha }: SigPageProps) {
  const [ parasOfPage, setParasOfPage ] = useState<ParasOfSigPage >();

  const {
    refetch: getParasOfPage
  } = useSigPageGetParasOfPage({
    address: addr,
    args: [initPage],
    onSuccess(paras) {
      setParasOfPage(parseParasOfPage(paras));
    }
  })

  interface TimingProps {
    signingDays?: string,
    closingDays?: string,
  }

  const [ timing, setTiming ] = useState<TimingProps>();

  const {
    isLoading: setTimingIsLoading,
    write: writeSetTiming,
  } = useSigPageSetTiming({
    address: addr,
    args: timing?.closingDays &&
          timing?.signingDays 
        ? [ initPage, 
            BigInt(timing.signingDays), 
            BigInt(timing.closingDays)
          ] 
        : undefined,
    onSuccess() {
      getParasOfPage();
    }
  });

  // ==== Buyers ====

  const [ buyerSigs, setBuyerSigs ] = useState<StrSig[]>();

  const {
    refetch: getBuyers
  } = useSigPageGetBuyers({
    address: addr,
    args: [ initPage ],
    onSuccess(buyers) {
      getSigsOfRole(addr, initPage, buyers).
        then(sigs => setBuyerSigs(sigs));
    }
  });

  // ==== Seller ====

  const [ sellerSigs, setSellerSigs ] = useState<StrSig[]>();  

  const {
    refetch: getSellers
  } = useSigPageGetSellers ({
    address: addr,
    args: [ initPage ],
    onSuccess(sellers) {
      getSigsOfRole(addr, initPage, sellers).
        then(sigs => setSellerSigs(sigs));
    }
  });

  // ==== AddBlank ====

  const [ isBuyer, setIsBuyer ] = useState(true);
  const [ acct, setAcct ] = useState<string>();

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
    onSuccess() {
      getParasOfPage();
      getSellers();
      getBuyers();
    }
  });

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
    onSuccess() {
      getParasOfPage();
      getSellers();
      getBuyers();
    }
  });

  return (
    <Stack direction="column" sx={{width:'100%'}} >
      {initPage && (
        <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

          <Stack direction={'row'} sx={{ alignItems:'center' }} >
            <Toolbar sx={{ textDecoration:'underline'}}>
              <h4>Props of SigPage</h4>
            </Toolbar>

            {!isFinalized && (
              <>
                <TextField 
                  variant='outlined'
                  size='small'
                  label='SigningDays'
                  sx={{
                    m:1,
                    ml: 10,
                    minWidth: 218,
                  }}
                  onChange={(e) => setTiming((v) => ({
                    ...v,
                    signingDays: e.target.value,
                  }))}
                  value={ timing?.signingDays }              
                />

                <TextField 
                  variant='outlined'
                      size='small'
                  label='ClosingDays'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setTiming((v) => ({
                    ...v,
                    closingDays: e.target.value,
                  }))}
                  value={ timing?.closingDays }                                      
                />

                <Button
                  disabled={ setTimingIsLoading }
                  variant="contained"
                  sx={{
                    height: 40,
                    m: 1,
                  }}
                  endIcon={ <Update /> }
                  onClick={() => writeSetTiming?.()}
                >
                  Update
                </Button>
              
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
                    value={ dateParser(parasOfPage.circulateDate) }
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
      )}

      <Paper elevation={3} sx={{ m:1, p:1, border:1, borderColor:'divider' }}>

        <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'space-between' }} >
          <Toolbar sx={{ textDecoration:'underline' }}>
            <h4>Signatures of Doc</h4>
          </Toolbar>

          {!initPage && isFinalized && (
            <AcceptSha getBuyers={ getBuyers } getSellers={ getSellers } />
          )}

          {!isFinalized && (
            <Stack direction={'row'} sx={{ alignItems:'center' }} >

              <Tooltip
                title='Add Party'
                placement="top-start"
                arrow
              >
                <span>
                <IconButton 
                  disabled={ addBlankIsLoading }
                  sx={{width: 20, height: 20, m: 1 }} 
                  onClick={ () => addBlank?.() }
                  color="primary"
                >
                  < PersonAdd />
                </IconButton>
                </span>
              </Tooltip>

              <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
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
              </FormControl>

              <TextField
                variant='outlined'
                size='small'
                label='UserNo.'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setAcct(e.target.value)}
                value={ acct }                                      
              />

              <Tooltip
                title='Remove Party'
                placement="top-end"
                arrow
              >           
                <span>
                <IconButton
                  disabled={ removeBlankIsLoading } 
                  sx={{width: 20, height: 20, m: 1, mr:2 }} 
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
                    value={ dateParser(v.sigDate) }
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
                    value={ dateParser(v.sigDate) }
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

