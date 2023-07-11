
import { Alert, Button, Collapse, IconButton, Paper, Stack, TextField, Toolbar } from '@mui/material';

import { 
  usePrepareRegCenterMintPoints,
  useRegCenterMintPoints, 
} from '../../generated';

import { AddrOfRegCenter, HexType } from '../../interfaces';
import { BorderColor, Close, Create } from '@mui/icons-material';
import { useState } from 'react';
import { BigNumber } from 'ethers';
import { getReceipt } from '../../queries/common';
import { longDataParser, longSnParser } from '../../scripts/toolsKit';

interface Receipt{
  to: string;
  amt: string;
}


export function MintPoints() {

  const [ to, setTo ] = useState<string>();
  const [ amt, setAmt ] = useState<string>();
  const [ receipt, setReceipt ] = useState<Receipt>();
  const [ open, setOpen ] = useState(false);

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
            let rpt:Receipt = {
              to: longSnParser(BigNumber.from(r.logs[0].topics[1]).toString()),
              amt: longDataParser(r.logs[0].topics[2]?.toString())
            }
            setReceipt(rpt);
            setOpen(true);
          }
        }
      )
    }
  })


  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

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
          sx={{ m:1, mx:2, minWidth:128 }} 
          endIcon={<BorderColor />}       
        >
          {mintPointsLoading ? 'Loading...' : 'Set'}
        </Button>

        <Collapse in={ open } sx={{ m:1 }} >
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
            {receipt?.amt} points minted to User ({receipt?.to})
          </Alert>          
        </Collapse>

      </Stack>
    </Paper>
  )
}
