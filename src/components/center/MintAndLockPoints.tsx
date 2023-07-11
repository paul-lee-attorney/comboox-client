
import { Alert, Button, Collapse, Divider, IconButton, Paper, Stack, TextField, Toolbar } from '@mui/material';

import { 
  usePrepareRegCenterMintAndLockPoints,
  usePrepareRegCenterMintPoints,
  useRegCenterMintAndLockPoints,
  useRegCenterMintPoints, 
} from '../../generated';

import { AddrOfRegCenter, Bytes32Zero, HexType } from '../../interfaces';
import { BorderColor, Close, Create, LockReset } from '@mui/icons-material';
import { useState } from 'react';
import { BigNumber } from 'ethers';
import { getReceipt } from '../../queries/common';
import { dateParser, longDataParser, longSnParser } from '../../scripts/toolsKit';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { BodyOfLocker, HeadOfLocker, defaultHeadOfLocker } from '../../queries/rc';


interface MintAndLockPointsProps{
  refreshList: ()=>void;
}

export function MintAndLockPoints({refreshList}:MintAndLockPointsProps) {

  const [ head, setHead ] = useState<HeadOfLocker>(defaultHeadOfLocker);
  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  // // const [ receipt, setReceipt ] = useState<Receipt>();
  // const [ upHead, setUpHead ] = useState<HeadOfLocker>();
  const [ upHashLock, setUpHashLock ] = useState<HexType>();

  const [ open, setOpen ] = useState(false);

  const {
    config: mintAndLockPointsConfig
  } = usePrepareRegCenterMintAndLockPoints({
    address: AddrOfRegCenter,
    args: head.to && head.value && head.expireDate && hashLock
        ? [ 
            BigNumber.from(head.to),
            BigNumber.from(head.value),
            BigNumber.from(head.expireDate),
            hashLock
          ]
        : undefined,
  })

  const {
    isLoading: mintAndLockPointsLoading,
    write: mintAndLockPoints,
  } = useRegCenterMintAndLockPoints({
    ...mintAndLockPointsConfig,
    onSuccess(data) {
      getReceipt(data.hash).then(
        r => {
          if (r) {
            setUpHashLock( r.logs[0].topics[3] );
            setOpen(true);
            refreshList();
          }
        }
      )
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, color:'divider', border:1 }}  >
      {/* <Stack direction='row' sx={{alignItems:'center', justifyContent:'start' }}>

        <Collapse in={ open } sx={{ ml:3, minWidth:680 }} >
          <Alert 
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }

            variant='outlined' 
            severity='info' 
            sx={{ height: 45, p:0.5 }} 
          >
            Locker ({ upHashLock }) established.             
          </Alert>          
        </Collapse>
      </Stack> */}

      <Stack direction='row' sx={{m:1, alignItems:'center', justifyContent:'start'}} >

        <Stack direction='column' >
        
          <Stack direction='row' sx={{m:1, alignItems:'center', justifyContent:'start'}} >

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
                value: BigNumber.from(e.target.value ?? '0'),
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

          <Stack direction='row' sx={{m:1, alignItems:'center', justifyContent:'start'}} >
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
          disabled={ !mintAndLockPoints || mintAndLockPointsLoading } 
          onClick={() => {
            mintAndLockPoints?.()
          }}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128 }} 
          endIcon={<LockReset />}       
        >
          {mintAndLockPointsLoading ? 'Loading...' : 'Mint & Lock'}
        </Button>

      </Stack>

    </Paper>
  )
}
