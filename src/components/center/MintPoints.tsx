
import { Alert, Button, Paper, Stack, TextField, Toolbar } from '@mui/material';

import { 
  usePrepareRegCenterMintPoints,
  usePrepareRegCenterRegUser, 
  usePrepareRegCenterSetBackupKey, 
  useRegCenterMintPoints, 
  useRegCenterRegUser,
  useRegCenterSetBackupKey
} from '../../generated';

import { AddrOfRegCenter, HexType } from '../../interfaces';
import { BorderColor, Create } from '@mui/icons-material';
import { useState } from 'react';
import { BigNumber } from 'ethers';
import { getReceipt } from '../../queries/common';
import { longDataParser, longSnParser } from '../../scripts/toolsKit';

export interface Receipt{
  to: string;
  amt: string;
}

export function MintPoints() {

  const [ to, setTo ] = useState<string>();
  const [ amt, setAmt ] = useState<string>();
  const [ receipt, setReceipt ] = useState<Receipt>();

  const { config: mintPointsConfig } = usePrepareRegCenterMintPoints({
    address: AddrOfRegCenter,
    args: to && amt
      ? [BigNumber.from(to), BigNumber.from(amt)]
      : undefined,
  })  

  const {
    isLoading: mintPointsLoading,
    write: mintPoints
  } = useRegCenterMintPoints({
    ...mintPointsConfig,
    onSuccess(data) {
      getReceipt(data.hash).then(
        r => {
          if (r) {
            // let rpt:Receipt = {
            //   to: longSnParser(r.logs[0].topics[1]?.toString()),
            //   amt: longDataParser(r.logs[0].topics[2]?.toString())
            // }
            // console.log('to: ', longSnParser(r.logs[0].topics[1]?.toString()));
            // console.log('amt: ', longDataParser(r.logs[0].topics[2]?.toString()));
            // setReceipt(rpt);          
            console.log('receipt: ', r);
          }
        }
      )
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

      <Toolbar sx={{ color:'black' }} >
        <h4>Mint Points {receipt ? '- To: ' + receipt.to : ''} {receipt? 'With Amount: ' + receipt.amt : ''} </h4>
      </Toolbar>

      <Stack direction='row' sx={{m:1, p:1, alignItems:'center', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='filled'
          label='To'
          sx={{
            m:1,
            minWidth: 218,
          }}
          value={ to }
          onChange={e => setTo(e.target.value ?? '0')}
        />

        <TextField 
          size="small"
          variant='filled'
          label='Amount'
          sx={{
            m:1,
            minWidth: 218,
          }}
          value={ amt }
          onChange={e => setAmt(e.target.value ?? '0')}
        />

        <Button 
          size='small'
          disabled={ !mintPoints || mintPointsLoading } 
          onClick={() => {
            mintPoints?.()
          }}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128 }} 
          endIcon={<BorderColor />}       
        >
          {mintPointsLoading ? 'Loading...' : 'Set'}
        </Button>

      </Stack>
    </Paper>
  )
}
