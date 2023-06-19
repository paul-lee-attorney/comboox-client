import { useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  TextField,
  Button,
  Tooltip,
  Box,
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
} from "@mui/icons-material"

import { 
  readContract 
} from "@wagmi/core";

import {
  sigPageABI,
  usePrepareSigPageSetTiming,
  useSigPageSetTiming,
  useSigPageGetParasOfPage,
  usePrepareSigPageAddBlank,
  useSigPageAddBlank,
  usePrepareSigPageRemoveBlank,
  useSigPageRemoveBlank,
  useSigPageGetBuyers,
  useSigPageGetSellers, 
} from "../../../generated";

import { BigNumber } from "ethers";

import { dateParser, longSnParser } from "../../../scripts/toolsKit";
import { ParasOfSigPage, StrSig, parseParasOfPage } from "../../../queries/sigPage";

async function getSigsOfRole( addr: HexType, initPage: boolean, parties: readonly BigNumber[] ): Promise<StrSig[]> {

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
      signer: parties[len-1].toNumber(),
      sigDate: item.sig.sigDate,
      blocknumber: item.sig.blocknumber.toString(),
      sigHash: item.sigHash,
    });

    len--;
  }

  return output;
}

interface SigPageProps {
  addr: HexType,
  initPage: boolean,
  finalized: boolean,
}


export function Signatures({ addr, initPage, finalized }: SigPageProps) {
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
    config: setTimingConfig
  } = usePrepareSigPageSetTiming({
    address: addr,
    args: timing?.closingDays &&
          timing?.signingDays 
        ? [ initPage, 
            BigNumber.from(timing.signingDays), 
            BigNumber.from(timing.closingDays)
          ] 
        : undefined,
  });

  const {
    isLoading: setTimingIsLoading,
    write: writeSetTiming,
  } = useSigPageSetTiming({
    ...setTimingConfig,
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
    args: [true],
    onSuccess(buyers) {
      getSigsOfRole(addr, true, buyers).
        then(sigs => setBuyerSigs(sigs));
    }
  });

  // ==== Seller ====

  const [ sellerSigs, setSellerSigs ] = useState<StrSig[]>();  

  const {
    refetch: getSellers
  } = useSigPageGetSellers ({
    address: addr,
    args: [true],
    onSuccess(sellers) {
      getSigsOfRole(addr, true, sellers).
        then(sigs => setSellerSigs(sigs));
    }
  });

  // ==== AddBlank ====

  const [ isBuyer, setIsBuyer ] = useState(true);
  const [ acct, setAcct ] = useState<string>();

  const {
    config: addBlankConfig
  } = usePrepareSigPageAddBlank({
    address: addr,
    args: isBuyer != undefined &&
      acct ? 
        [ initPage,
          isBuyer, 
          BigNumber.from('1'), 
          BigNumber.from(acct)
        ] : 
        undefined,
  });

  const {
    isLoading: addBlankIsLoading,
    write: addBlank,
  } = useSigPageAddBlank({
    ...addBlankConfig,
    onSuccess() {
      getParasOfPage();
      getSellers();
      getBuyers();
    }
  });

  const {
    config: removeBlankConfig
  } = usePrepareSigPageRemoveBlank({
    address: addr,
    args: acct ? 
        [ initPage, 
          BigNumber.from('1'), 
          BigNumber.from(acct)
        ] : 
        undefined,
  });

  const {
    isLoading: removeBlankIsLoading,
    write: removeBlank,
  } = useSigPageRemoveBlank({
    ...removeBlankConfig,
    onSuccess() {
      getParasOfPage();
      getSellers();
      getBuyers();
    }
  });

  return (
    <>
      <Paper sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
        <Box sx={{ width:1680 }}>

          <Stack direction={'row'} sx={{ alignItems:'center' }} >
            <Toolbar>
              <h4>Props of SigPage</h4>
            </Toolbar>

            {!finalized && (
              <>
                <TextField 
                  variant='filled'
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
                  variant='filled'
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
                  disabled={ !writeSetTiming || setTimingIsLoading }
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

          <Paper sx={{m:1, p:1, border:1, borderColor:'divider'}} >
            
              <Stack direction={'row'} >    
                {parasOfPage && (
                  <TextField 
                    variant='filled'
                    label='CirculateDate'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser(parasOfPage.circulateDate) }
                  />
                )}

                {parasOfPage && (
                  <TextField 
                    variant='filled'
                    label='SigningDays'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.signingDays }
                  />
                )}

                {parasOfPage && (
                  <TextField 
                    variant='filled'
                    label='ClosingDays'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.closingDays }
                  />
                )}

                {parasOfPage && (
                  <TextField 
                    variant='filled'
                    label='CounterOfBlanks'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.counterOfBlanks }
                  />
                )}

                {parasOfPage && (
                  <TextField 
                    variant='filled'
                    label='CounterOfSigs'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.counterOfSigs }
                  />
                )}

                {parasOfPage && (
                  <TextField 
                    variant='filled'
                    label='Established'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parasOfPage.established ? 'True' : 'False' }
                  />
                )}

              </Stack>

          </Paper>

        </Box>
      </Paper>

      <Paper sx={{ m:1, p:1, border:1, borderColor:'divider' }}>
        <Box sx={{ width:1680 }}>

          <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'space-between' }} >
            <Toolbar>
              <h4>Signatures of Doc</h4>
            </Toolbar>

            {!finalized && (
              <Stack direction={'row'} sx={{ alignItems:'center' }} >

                <Tooltip
                  title='Add Party'
                  placement="top-start"
                  arrow
                >
                  <span>
                  <IconButton 
                    disabled={ !addBlank || addBlankIsLoading }
                    sx={{width: 20, height: 20, m: 1 }} 
                    onClick={ () => addBlank?.() }
                    color="primary"
                  >
                    < PersonAdd />
                  </IconButton>
                  </span>
                </Tooltip>

                <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                  <InputLabel id="isBuyer-label">Role</InputLabel>
                  <Select
                    labelId="isBuyer-label"
                    id="isBuyer-select"
                    value={ isBuyer ? 'true' : 'false' }
                    onChange={(e) => setIsBuyer(e.target.value == 'true')}

                    label="Role"
                  >
                    <MenuItem value={'true'}>Investor</MenuItem>
                    <MenuItem value={'false'}>Orignal Shareholders</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  variant='filled'
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
                    disabled={ !removeBlank || removeBlankIsLoading } 
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

          <Divider />

          <Stack direction="row" >

            <Paper sx={{m:1, border:1, borderColor:'divider', width:'50%' }} >
              
              <Chip
                sx={{ minWidth:80, m:1 }}
                label="Original Shareholders" 
                color="primary" 
              />

              {sellerSigs?.map(v => (
                <Paper key={ v.signer } sx={{m:1, p:1, border:1, borderColor:'divider'}}>
              
                  <Stack  direction={'row'} sx={{ alignItems:'center' }} > 

                    <TextField 
                      variant='filled'
                      label='UserNo.'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ longSnParser(v.signer.toString()) }
                    />

                    <TextField 
                      variant='filled'
                      label='SigDate'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ dateParser(v.sigDate) }
                    />

                    <TextField 
                      variant='filled'
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
                    variant='filled'
                    label='SigHash'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 688,
                    }}
                    value={ v.sigHash }
                  />

                </Paper>
              ))}

            </Paper>

            <Paper sx={{m:1, border:1, borderColor:'divider', width:'50%' }} >
              
              <Chip
                sx={{ minWidth:80, m:1 }}
                label="Investors" 
                color="success" 
              />

              {buyerSigs?.map(v => (
                <Paper key={ v.signer } sx={{m:1, p:1, border:1, borderColor:'divider'}}>

                  <Stack direction={'row'} sx={{ alignItems:'center' }} > 

                    <TextField 
                      variant='filled'
                      label='UserNo.'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ longSnParser(v.signer.toString()) }
                    />

                    <TextField 
                      variant='filled'
                      label='SigDate'
                      inputProps={{readOnly: true}}
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ dateParser(v.sigDate) }
                    />

                    <TextField 
                      variant='filled'
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
                    variant='filled'
                    label='SigHash'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 688,
                    }}
                    value={ v.sigHash }
                  />

                </Paper>

              ))}

            </Paper>

          </Stack>

        </Box>
      </Paper>
    </>
  );
} 

