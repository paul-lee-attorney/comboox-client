
import { Button, Divider, Paper, Stack, TextField, } from '@mui/material';

import { 
  useRegCenterMintAndLockPoints,
} from '../../../generated';

import { AddrOfRegCenter, Bytes32Zero, HexType, MaxUserNo } from '../../../scripts/common';
import { LockClockOutlined, } from '@mui/icons-material';
import { useState } from 'react';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { StrHeadOfLocker, defaultStrHeadOfLocker } from '../../../scripts/center/rc';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyNum, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { ActionsOfUserProps } from '../ActionsOfUser';
import { CBP, defaultCBP } from './Mint';

export function MintAndLockPoints({refreshList, getUser, getBalanceOf}:ActionsOfUserProps) {

  const [ amt, setAmt ] = useState<CBP>(defaultCBP);

  const [ head, setHead ] = useState<StrHeadOfLocker>(defaultStrHeadOfLocker);
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const refresh = () => {
    refreshList();
    getUser();
    getBalanceOf();
  }

  const {
    isLoading: mintAndLockPointsLoading,
    write: mintAndLockPoints,
  } = useRegCenterMintAndLockPoints({
    address: AddrOfRegCenter,
    args: !hasError(valid) && head.expireDate
        ? [ 
            BigInt(head.to),
            BigInt(amt.cbp) * BigInt(10 ** 9) + BigInt(amt.glee),
            BigInt(head.expireDate),
            hashLock
          ]
        : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
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
              error={ valid['To']?.error }
              helperText={ valid['To']?.helpTx }          

              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ head.to }
              onChange={e => {
                let input = e.target.value ?? '0';
                onlyNum('To', input, MaxUserNo, setValid);
                setHead(v =>({
                  ...v,
                  to: input,
                }));
              }}
            />

            <TextField 
              size="small"
              variant='outlined'
              label='Amount (CBP)'
              error={ valid['Amount(CBP)']?.error }
              helperText={ valid['Amount(CBP)']?.helpTx }          

              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ amt.cbp }
              onChange={e => {
                let input = e.target.value ?? '0';
                onlyNum('Amount(CBP)', input, 0n, setValid);
                setAmt(v=>({
                  ...v,
                  cbp: input,
                }));
              }}
            />

            <TextField 
              size="small"
              variant='outlined'
              label='Amount (GLee)'
              error={ valid['Amount(GLee)']?.error }
              helperText={ valid['Amount(GLee)']?.helpTx }          
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ amt.glee }
              onChange={e => {
                let input = e.target.value ?? '0';
                onlyNum('Amount(GLee)', input, 0n, setValid);
                setAmt(v=>({
                  ...v,
                  glee: input,
                }));
              }}
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

          <Stack direction='row' sx={{ alignItems:'center', justifyContent:'start'}} >
            <TextField 
              size="small"
              variant='outlined'
              label='HashLock'
              error={ valid['HashLock']?.error }
              helperText={ valid['HashLock']?.helpTx }
              sx={{
                m:1,
                minWidth: 685,
              }}
              value={ hashLock }
              onChange={e => {
                let input = HexParser( e.target.value );
                onlyHex('HashLock', input, 64, setValid);
                setHashLock(input);
              }}
            />
          </Stack>

        </Stack>

        <Divider orientation='vertical' sx={{ m:1 }} flexItem />

        <Button 
          disabled={ mintAndLockPointsLoading || hasError(valid)} 
          onClick={() => {
            mintAndLockPoints?.()
          }}
          variant='contained'
          sx={{ m:1, minWidth:128 }} 
          endIcon={<LockClockOutlined />}       
        >
          Mint & Lock
        </Button>

      </Stack>
    </Paper>
  )
}
