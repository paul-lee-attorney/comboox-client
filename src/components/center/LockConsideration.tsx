
import { Button, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Toolbar } from '@mui/material';

import { 
  usePrepareRegCenterLockConsideration,
  useRegCenterLockConsideration,
} from '../../generated';

import { AddrOfRegCenter, AddrZero, Bytes32Zero, HexType } from '../../interfaces';
import { LockClockOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { bigint } from 'ethers';
import { selectorCodifier } from '../../scripts/toolsKit';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { BodyOfLocker, HeadOfLocker, defaultHeadOfLocker, defaultBodyOfLocker } from '../../queries/rc';


export interface Selector {
  selector: HexType;
  offSet:number;
}

export interface Selectors {
  [key: string]: Selector
}

export const selectors: Selectors = {
  'requestPaidInCapital': {selector: selectorCodifier('requestPaidInCapital(bytes32,string)'), offSet: 0x40},
  'closeDeal': {selector: selectorCodifier('closeDeal(address,uint256,string)'), offSet: 0x60},
  'releaseSwapOrder': {selector: selectorCodifier('releaseSwapOrder(uint256,uint256,string)'), offSet: 0x60},
  'releasePledge': {selector: selectorCodifier('releasePledge(uint256,uint256,string)'), offSet: 0x60},
  'releaseSwap': {selector: selectorCodifier('releaseSwap(uint256,string)'), offSet: 0x40},
}

export const funcNames:string[] = [
  'requestPaidInCapital',
  'closeDeal',
  'releaseSwapOrder',
  'releasePledge',
  'releaseSwap'
]

function constructPayload(func:string, paras:string[]):HexType {
  let selector = selectors[func].selector;
  let strParas:string = '';
  paras.forEach(v=>strParas = strParas.concat(v));
  let offSet = selectors[func].offSet.toString(16).padStart(64, '0');
  let mockKey = '1'.padStart(64, '0') + '1'.padStart(64, '0');

  return `0x${selector.substring(2) + strParas + offSet +  mockKey}`;    
}

interface LockConsiderationProps{
  refreshList: ()=>void;
  getUser: ()=> void;
}

function calDefaultParas(hashLock:HexType, offSet:number):string[]{

  let out:string[] = [ hashLock.padStart(0x40, '0') ];
  let len = parseInt(`${offSet/0x20}`) - 1;
  while (len > 1) {
    out.push(Bytes32Zero);
    len--;
  }
  return out;
}

export function LockConsideration({refreshList, getUser}:LockConsiderationProps) {

  const [ head, setHead ] = useState<HeadOfLocker>(defaultHeadOfLocker);
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  const [ counterLocker, setCounterLocker ] = useState<HexType>(AddrZero);

  const [ func, setFunc ] = useState<string>(funcNames[0]);
  const [ paras, setParas ] = useState<string[]>(calDefaultParas(hashLock, selectors[func].offSet));

  // const {
  //   config: lockConsiderationConfig
  // } = usePrepareRegCenterLockConsideration({
  //   address: AddrOfRegCenter,
  //   args: head.to && head.value && head.expireDate && 
  //         counterLocker && paras && hashLock
  //       ? [ 
  //           BigInt(head.to),
  //           BigInt(head.value),
  //           BigInt(head.expireDate),
  //           counterLocker,
  //           constructPayload(func, paras),
  //           hashLock
  //         ]
  //       : undefined,
  // })

  const {
    isLoading: lockConsiderationLoading,
    write: lockConsideration,
  } = useRegCenterLockConsideration({
    address: AddrOfRegCenter,
    args: head.to && head.value && head.expireDate && 
          counterLocker && paras && hashLock
        ? [ 
            BigInt(head.to),
            BigInt(head.value),
            BigInt(head.expireDate),
            counterLocker,
            constructPayload(func, paras),
            hashLock
          ]
        : undefined,
    onSuccess() {
      refreshList();
      getUser();
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

      <Toolbar sx={{color:'black'}} >
        <h4>Lock Consideration</h4>
      </Toolbar>

      <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

        <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

          <Stack direction='column' >
            
            <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

              <TextField 
                size="small"
                variant='filled'
                label='To'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ head.to.toString() }
                onChange={e => setHead(v =>({
                  ...v,
                  to: parseInt(e.target.value ?? '0'),
                }))}
              />

              <TextField 
                size="small"
                variant='filled'
                label='Amount'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ head.value }
                onChange={e => setHead(v=>({
                  ...v,
                  value: BigInt(e.target.value ?? '0'),
                }))}
              />

              <DateTimeField
                label='ExpireDate'
                sx={{
                  m:1,
                  minWidth: 218,
                }} 
                value={ dayjs.unix(head.expireDate) }
                onChange={(date) => setHead((v) => ({
                  ...v,
                  expireDate: date ? date.unix() : 0,
                }))}
                format='YYYY-MM-DD HH:mm:ss'
                size='small'
              />

            </Stack>

            <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >
              <TextField 
                size="small"
                variant='filled'
                label='HashLock'
                sx={{
                  m:1,
                  minWidth: 685,
                }}
                value={ hashLock.substring(2) }
                onChange={e => setHashLock(`0x${e.target.value ?? ''}`)}
              />
            </Stack>

            <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

              <TextField 
                size="small"
                variant='filled'
                label='CounterLockerAddress'
                sx={{
                  m:1,
                  minWidth: 450,
                }}
                value={ counterLocker.substring(2) }
                onChange={e => setCounterLocker(`0x${e.target.value ?? ''}`)}
              />

              <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="FuncSig-label">FunctionSignature</InputLabel>
                <Select
                  size='small'
                  labelId="FuncSig-label"
                  id="fincSig-select"
                  value={ func }
                  onChange={(e) => setFunc(e.target.value)}
                >
                  {funcNames.map(v=>(
                    <MenuItem key={v} value={v} >{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Stack>
            
            <Divider flexItem sx={{m:1}} />
            
            {func == 'requestPaidInCapital' && (
              <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >
                <TextField 
                  size="small"
                  variant='filled'
                  label='HashLock'
                  sx={{
                    m:1,
                    minWidth: 685,
                  }}
                  inputProps={{readOnly: true}}
                  value={ hashLock.substring(2) }
                />
              </Stack>            
            )}

            {func == 'closeDeal' && (
              <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >
                            
                <TextField 
                  size="small"
                  variant='filled'
                  label='InvestmentAgreement'
                  sx={{
                    m:1,
                    minWidth: 450,
                  }}
                  value={ paras[0].substring(0x18,0x40) }
                  onChange={e => setParas(v => {
                    let out = [...v];
                    let ia = e.target.value ?? '';
                    out[0] = ia.padStart(0x40, '0');
                    return out;
                  })}
                />

                <TextField 
                  size="small"
                  variant='filled'
                  label='SeqOfDeal'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ parseInt(paras[1]?.substring(0x3c,0x40) ?? '0x00',0x10).toString()  }
                  onChange={e => setParas(v => {
                    let out = [...v];
                    let seq = parseInt(e.target.value ?? '0').toString(16).padStart(0x40, '0');
                    out[1] = seq;
                    return out;
                  })}
                />

              </Stack>
            )}

            {(func == 'releaseSwapOrder' || func == 'releasePledge' || func == 'releaseSwap') && (
              <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >
                            
                <TextField 
                  size="small"
                  variant='filled'
                  label={
                    func == 'releaseSwapOrder' 
                      ? 'SeqOfOpt' 
                      : func == 'releasePledge' 
                        ? 'SeqOfShare'
                        : 'SeqOfSwap'
                  }
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ parseInt(paras[0]?.substring(0x38,0x40) ?? '0x00',0x10).toString() }
                  onChange={e => setParas(v => {
                    let out = [...v];
                    let seq = parseInt(e.target.value ?? '0').toString(16).padStart(0x40, '0');
                    out[0] = seq;
                    return out;
                  })}
                />

                {(func == 'releaseSwapOrder' || func == 'releasePledge') && (
                  <TextField 
                    size="small"
                    variant='filled'
                    label={func == 'releaseSwapOrder' ? 'SeqOfBrief' : 'SeqOfPledge'}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ parseInt(paras[1]?.substring(0x3c,0x40) ?? '0x00',0x10).toString()  }
                    onChange={e => setParas(v => {
                      let out = [...v];
                      let seq = parseInt(e.target.value ?? '0').toString(16).padStart(0x40, '0');
                      out[1] = seq;
                      return out;
                    })}
                  />
                )}

              </Stack>
            )}
            
          </Stack>

          <Divider orientation='vertical' flexItem />

          <Button 
            size='small'
            disabled={ !lockConsideration || lockConsiderationLoading } 
            onClick={() => {
              lockConsideration?.()
            }}
            variant='contained'
            sx={{ m:1, minWidth:128 }} 
            endIcon={<LockClockOutlined />}       
          >
            {lockConsiderationLoading ? 'Loading...' : 'Lock'}
          </Button>

        </Stack>

      </Paper>

    </Paper>
  )
}
