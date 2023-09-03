
import { Button, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';

import { 
  useRegCenterLockConsideration,
} from '../../../generated';

import { AddrOfRegCenter, AddrZero, Bytes32Zero, HexType } from '../../../scripts/common';
import { LockClockOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { HexParser, selectorCodifier } from '../../../scripts/common/toolsKit';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { HeadOfLocker, defaultHeadOfLocker } from '../../../scripts/center/rc';
import { LockPointsProps } from './LockPoints';
import { CBP, defaultCBP } from './Mint';


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
  'releasePledge': {selector: selectorCodifier('releasePledge(uint256,uint256,string)'), offSet: 0x60},
}

export const funcNames:string[] = [
  'requestPaidInCapital',
  'closeDeal',
  'releasePledge',
]

function constructPayload(func:string, paras:string[]):HexType {
  let selector = selectors[func].selector;
  let strParas:string = '';
  paras.forEach(v=>strParas = strParas.concat(v));
  let offSet = selectors[func].offSet.toString(16).padStart(64, '0');

  return `0x${selector.substring(2) + strParas + offSet }`;    
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

export function LockConsideration({refreshList, getUser, getBalanceOf}:LockPointsProps) {

  const [ amt, setAmt ] = useState<CBP>(defaultCBP);

  const [ head, setHead ] = useState<HeadOfLocker>(defaultHeadOfLocker);
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  const [ counterLocker, setCounterLocker ] = useState<HexType>(AddrZero);

  const [ func, setFunc ] = useState<string>(funcNames[0]);
  const [ paras, setParas ] = useState<string[]>(calDefaultParas(hashLock, selectors[func].offSet));

  const {
    isLoading: lockConsiderationLoading,
    write: lockConsideration,
  } = useRegCenterLockConsideration({
    address: AddrOfRegCenter,
    args: head.to && head.value && head.expireDate && 
          counterLocker && paras && hashLock
        ? [ 
            BigInt(head.to),
            BigInt(amt.cbp) * BigInt(10 ** 9) + BigInt(amt.glee),
            BigInt(head.expireDate),
            counterLocker,
            constructPayload(func, paras),
            hashLock
          ]
        : undefined,
    onSettled() {
      console.log('payloads: ', constructPayload(func, paras));
      refreshList();
      getUser();
      getBalanceOf();
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

      <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

        <Stack direction='column' >
          
          <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

            <TextField 
              size="small"
              variant='outlined'
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
              variant='outlined'
              label='Amount (CBP)'
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ amt.cbp }
              onChange={e => setAmt(v=>({
                ...v,
                cbp: (e.target.value ?? '0'),
              }))}
            />

            <TextField 
              size="small"
              variant='outlined'
              label='Amount (GLee)'
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ amt.glee }
              onChange={e => setAmt(v=>({
                ...v,
                glee: (e.target.value ?? '0'),
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
              variant='outlined'
              label='HashLock'
              sx={{
                m:1,
                minWidth: 685,
              }}
              value={ hashLock }
              onChange={e => setHashLock( HexParser(e.target.value) )}
            />
          </Stack>

          <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

            <TextField 
              size="small"
              variant='outlined'
              label='CounterLockerAddress'
              sx={{
                m:1,
                minWidth: 450,
              }}
              value={ counterLocker }
              onChange={e => setCounterLocker( HexParser(e.target.value) )}
            />

            <FormControl variant="outlined" sx={{ m: 1, minWidth: 218 }}>
              <InputLabel id="FuncSig-label">FunctionSignature</InputLabel>
              <Select
                size='small'
                labelId="FuncSig-label"
                id="fincSig-select"
                label="FunctionSignature"
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
                variant='outlined'
                label='HashLock'
                sx={{
                  m:1,
                  minWidth: 685,
                }}
                inputProps={{readOnly: true}}
                value={ HexParser(hashLock) }
              />
            </Stack>            
          )}

          {func == 'closeDeal' && (
            <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >
                          
              <TextField 
                size="small"
                variant='outlined'
                label='InvestmentAgreement'
                sx={{
                  m:1,
                  minWidth: 450,
                }}
                value={ HexParser(paras[0].substring(24,64)) }
                onChange={e => setParas(v => {
                  let out = [...v];
                  let ia = HexParser(e.target.value ?? '');
                  out[0] = ia.substring(2).padStart(64, '0');
                  return out;
                })}
              />

              <TextField 
                size="small"
                variant='outlined'
                label='SeqOfDeal'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ parseInt(paras[1]?.substring(60,64) ?? '0x00',16).toString()  }
                onChange={e => setParas(v => {
                  let out = [...v];
                  let seq = parseInt(e.target.value ?? '0').toString(16).padStart(64, '0');
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
                variant='outlined'
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
                  variant='outlined'
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

        <Divider orientation='vertical' sx={{ m:1 }} flexItem />

        <Button 
          disabled={ !lockConsideration || lockConsiderationLoading } 
          onClick={() => {
            lockConsideration?.()
          }}
          variant='contained'
          sx={{ m:1, minWidth:128 }} 
          endIcon={<LockClockOutlined />}       
        >
          Lock
        </Button>

      </Stack>

    </Paper>
  )
}
