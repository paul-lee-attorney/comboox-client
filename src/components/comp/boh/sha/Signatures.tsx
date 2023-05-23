import { useEffect, useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  TextField,
  Button,
  Tooltip,
  Card,
  CardContent,
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
} from "../../../../interfaces";

import {
  Update,
  PersonAdd,
  PersonRemove,
  Fingerprint,
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
} from "../../../../generated";

import { BigNumber } from "ethers";

import { SignSha } from "./SignSha";

import { dateParser } from "../../../../scripts/toolsKit";

export interface StrSigType {
  signer: string,
  sigDate: number,
  blocknumber: string,
}

export interface StrParasOfSigPageType {
  circulateDate: number,
  established: boolean,
  counterOfBlanks: string,
  counterOfSigs: string,
  signingDays: string,
  closingDays: string,
}

function parseParasOfPage(data: any): StrParasOfSigPageType {
  let output: StrParasOfSigPageType = {
    circulateDate: data.sigDate,
    established: data.flag,
    counterOfBlanks: data.para.toString(),
    counterOfSigs: data.arg.toString(),
    signingDays: data.seq.toString(),
    closingDays: data.attr.toString(),
  }
  return output;
}


async function getSigsOfRole( addr: HexType, initPage: boolean, parties: readonly BigNumber[] ): Promise<StrSigType[]> {

  let len = parties.length;
  let output: StrSigType[] = [];

  while (len > 0) {

    let item = await readContract({
      address: addr,
      abi: sigPageABI,
      functionName: 'getSigOfParty',
      args: [initPage, parties[len-1]],
    });

    output.push({
      signer: parties[len-1].toString(),
      sigDate: item.sig.sigDate,
      blocknumber: item.sig.blocknumber.toString(),
    });

    len--;
  }

  return output;
}

interface SigPageProps {
  addr: HexType,
  initPage: boolean,
}


export function Signatures({ addr, initPage }: SigPageProps) {
  const [ parasOfPage, setParasOfPage ] = useState<StrParasOfSigPageType>();

  const {
    refetch: refetchParasOfPage
  } = useSigPageGetParasOfPage({
    address: addr,
    args: [initPage],
    onSuccess(data) {
      setParasOfPage(parseParasOfPage(data));
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
      timing?.signingDays ? 
        [ initPage, 
          BigNumber.from(timing.signingDays), 
          BigNumber.from(timing.closingDays)
        ] : 
        undefined,
  });

  const {
    isLoading: setTimingIsLoading,
    write: writeSetTiming,
  } = useSigPageSetTiming({
    ...setTimingConfig,
    onSuccess() {
      refetchParasOfPage();
    }
  });

  // ==== Buyers ====

  const [ buyerSigs, setBuyerSigs ] = useState<StrSigType[]>();

  const {
    refetch: refetchGetBuyers
  } = useSigPageGetBuyers({
    address: addr,
    args: [true],
    onSuccess(data) {
      getSigsOfRole(addr, true, data).
        then(sigs => setBuyerSigs(sigs));
    }
  });

  // ==== Seller ====

  const [ sellerSigs, setSellerSigs ] = useState<StrSigType[]>();  

  const {
    refetch: refetchGetSellers
  } = useSigPageGetSellers ({
    address: addr,
    args: [true],
    onSuccess(data) {
      getSigsOfRole(addr, true, data).
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
      refetchParasOfPage();
      refetchGetSellers();
      refetchGetBuyers();
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
      refetchParasOfPage();
      refetchGetSellers();
      refetchGetBuyers();
    }
  });

  return (
    <>
      <Paper sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
        <Box sx={{ width:1440 }}>

          <Stack direction={'row'} sx={{ alignItems:'center' }} >
            <Toolbar>
              <h4>Props of SigPage</h4>
            </Toolbar>

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
        <Box sx={{ width:1440 }}>

          <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'space-between' }} >
            <Toolbar>
              <h4>Signatures of Doc</h4>
            </Toolbar>

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
                  <MenuItem value={'true'}>Buyer</MenuItem>
                  <MenuItem value={'false'}>Seller</MenuItem>
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
            
          </Stack>

          <Divider />

          <Stack direction="row" >

            <Paper sx={{m:1, border:1, borderColor:'divider', width:'50%' }} >
              
              <Chip
                sx={{ minWidth:80, m:1 }}
                label="Seller" 
                color="primary" 
              />

              {sellerSigs?.map(v => (              
                <Stack key={ v.signer } direction={'row'} sx={{ alignItems:'center' }} > 

                  <TextField 
                    variant='filled'
                    label='UserNo.'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ v.signer }
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
                    value={ v.blocknumber }
                  />

                </Stack>
              ))}

            </Paper>

            <Paper sx={{m:1, border:1, borderColor:'divider', width:'50%' }} >
              
              <Chip
                sx={{ minWidth:80, m:1 }}
                label="Buyer" 
                color="success" 
              />

              {buyerSigs?.map(v => (              
                <Stack key={ v.signer } direction={'row'} sx={{ alignItems:'center' }} > 

                  <TextField 
                    variant='filled'
                    label='UserNo.'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ v.signer }
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
                    value={ v.blocknumber }
                  />

                </Stack>
              ))}

            </Paper>

          </Stack>

        </Box>
      </Paper>
    </>
  );
} 

