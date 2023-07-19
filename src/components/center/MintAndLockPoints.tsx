
import { Button, Divider, Paper, Stack, TextField, } from '@mui/material';

import { 
  useRegCenterMintAndLockPoints,
} from '../../generated';

import { AddrOfRegCenter, Bytes32Zero, HexType } from '../../interfaces';
import { LockClockOutlined, } from '@mui/icons-material';
import { useState } from 'react';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { HeadOfLocker, defaultHeadOfLocker } from '../../queries/rc';


interface MintAndLockPointsProps{
  refreshList: ()=>void;
  getUser: ()=>void;
}

export function MintAndLockPoints({refreshList, getUser}:MintAndLockPointsProps) {

  const [ head, setHead ] = useState<HeadOfLocker>(defaultHeadOfLocker);
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  const [ open, setOpen ] = useState(false);

  const {
    isLoading: mintAndLockPointsLoading,
    write: mintAndLockPoints,
  } = useRegCenterMintAndLockPoints({
    address: AddrOfRegCenter,
    args: head.to && head.value && head.expireDate && hashLock
        ? [ 
            BigInt(head.to),
            BigInt(head.value),
            BigInt(head.expireDate),
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

          <Stack direction='row' sx={{ alignItems:'center', justifyContent:'start'}} >
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

        </Stack>

        <Divider orientation='vertical' flexItem />

        <Button 
          size='small'
          disabled={ mintAndLockPointsLoading } 
          onClick={() => {
            mintAndLockPoints?.()
          }}
          variant='contained'
          sx={{ m:1, minWidth:128 }} 
          endIcon={<LockClockOutlined />}       
        >
          {mintAndLockPointsLoading ? 'Loading...' : 'Mint & Lock'}
        </Button>

      </Stack>
    </Paper>
  )
}
