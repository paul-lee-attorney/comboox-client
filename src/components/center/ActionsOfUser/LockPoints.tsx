
import { Button, Divider, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterLockPoints,
} from '../../../generated';

import { AddrOfRegCenter, Bytes32Zero, HexType } from '../../../scripts/common';
import { LockClockOutlined, } from '@mui/icons-material';
import { useState } from 'react';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { HeadOfLocker, defaultHeadOfLocker } from '../../../scripts/comp/rc';
import { HexParser } from '../../../scripts/common/toolsKit';
import { CBP, defaultCBP } from './Mint';

export interface LockPointsProps{
  refreshList: ()=>void;
  getUser: ()=>void;
  getBalanceOf: ()=>void;
}

export function LockPoints({refreshList, getUser, getBalanceOf}:LockPointsProps) {

  const [ amt, setAmt ] = useState<CBP>(defaultCBP);

  const [ head, setHead ] = useState<HeadOfLocker>(defaultHeadOfLocker);
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  const {
    isLoading: lockPointsLoading,
    write: lockPoints,
  } = useRegCenterLockPoints({
    address: AddrOfRegCenter,
    args: head.to && head.value && head.expireDate && hashLock
        ? [ 
            BigInt(head.to),
            BigInt(amt.cbp) * BigInt(10 ** 9) + BigInt(amt.glee),
            BigInt(head.expireDate),
            hashLock
          ]
        : undefined,
    onSuccess() {
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
              onChange={e => setHashLock( HexParser( e.target.value ) )}
            />
          </Stack>

        </Stack>

        <Divider orientation='vertical' flexItem />

        <Button 
          disabled={ !lockPoints || lockPointsLoading } 
          onClick={() => {
            lockPoints?.()
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
