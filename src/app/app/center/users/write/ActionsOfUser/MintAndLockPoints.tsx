
import { Divider, Paper, Stack, TextField, } from '@mui/material';

import { 
  useRegCenterMintAndLockPoints,
} from '../../../../../../generated';

import { AddrOfRegCenter, Bytes32Zero, HexType, MaxLockValue, MaxUserNo } from '../../../../read';
import { LockClockOutlined, } from '@mui/icons-material';
import { useState } from 'react';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { StrHeadOfLocker, defaultStrHeadOfLocker } from '../../../read/rc';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyInt, onlyNum, refreshAfterTx, strNumToBigInt } from '../../../../read/toolsKit';
import { ActionsOfUserProps } from '../ActionsOfUser';
import { LoadingButton } from '@mui/lab';
import { useComBooxContext } from '../../../../_providers/ComBooxContextProvider';

export function MintAndLockPoints({refreshList, getUser, getBalanceOf}:ActionsOfUserProps) {

  const { setErrMsg } = useComBooxContext();

  const [ amt, setAmt ] = useState('0');

  const [ head, setHead ] = useState<StrHeadOfLocker>(defaultStrHeadOfLocker);
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    refreshList();
    getUser();
    getBalanceOf();
    setLoading(false);
  }

  const {
    isLoading: mintAndLockPointsLoading,
    write: mintAndLockPoints,
  } = useRegCenterMintAndLockPoints({
    address: AddrOfRegCenter,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  })

  const mintAndLockPointsClick = ()=> {
    mintAndLockPoints({
      args: [ 
        BigInt(head.to),
        strNumToBigInt(amt, 9),
        BigInt(head.expireDate),
        hashLock
      ]
    })
  }

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

        <Stack direction='column' >

          <Stack direction='row' sx={{alignItems:'start', justifyContent:'start'}} >
            <TextField 
              size="small"
              variant='outlined'
              label='To'
              error={ valid['To']?.error }
              helperText={ valid['To']?.helpTx ?? ' ' }          

              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ head.to }
              onChange={e => {
                let input = e.target.value ?? '0';
                onlyInt('To', input, MaxUserNo, setValid);
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
              helperText={ valid['Amount(CBP)']?.helpTx ?? ' ' }          

              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ amt }
              onChange={e => {
                let input = e.target.value ?? '0';
                onlyNum('Amount(CBP)', input, MaxLockValue, 9, setValid);
                setAmt(input);
              }}
            />

            <DateTimeField
              label='ExpireDate'
              helperText=' '
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
              helperText={ valid['HashLock']?.helpTx ?? ' ' }
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

        <LoadingButton 
          disabled={ mintAndLockPointsLoading || hasError(valid)} 
          loading={loading}
          loadingPosition='end'
          onClick={ mintAndLockPointsClick }
          variant='contained'
          sx={{ m:1, minWidth:128 }} 
          endIcon={<LockClockOutlined />}       
        >
          Mint & Lock
        </LoadingButton>

      </Stack>
    </Paper>
  )
}
