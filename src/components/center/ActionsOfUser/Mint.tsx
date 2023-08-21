
import { Alert, Button, Collapse, IconButton, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterMint, 
} from '../../../generated';

import { AddrOfRegCenter, HexType } from '../../../interfaces';
import { Close, Flare } from '@mui/icons-material';
import { useState } from 'react';
import { getReceipt } from '../../../queries/common';

import { ActionsOfUserProps } from '../ActionsOfUser';
import { longDataParser } from '../../../scripts/toolsKit';

interface Receipt{
  to: string;
  amt: string;
}


export function MintPoints({getUser, getBalanceOf}:ActionsOfUserProps) {

  const [ to, setTo ] = useState<string>();
  const [ amt, setAmt ] = useState<string>();
  const [ receipt, setReceipt ] = useState<Receipt>();
  const [ open, setOpen ] = useState(false);

  const {
    isLoading: mintPointsLoading,
    write: mintPoints
  } = useRegCenterMint({
    address: AddrOfRegCenter,
    args: to && amt
      ? [BigInt(to), BigInt(amt)*BigInt(10**9)]
      : undefined,
    onSuccess(data:any) {
      getReceipt(data.hash).then(
        r => {
          if (r) {
            let rpt:Receipt = {
              to: r.logs[0].topics[2],
              amt: r.logs[0].topics[3]
            }
            setReceipt(rpt);
            setOpen(true);
            getUser();
            getBalanceOf();
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
          variant="outlined"
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
          variant="outlined"
          label='Amount (GLee)'
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
          sx={{ m:1, mx:2, minWidth:128, height:40 }} 
          endIcon={<Flare />}       
        >
          Mint
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

            variant="outlined" 
            severity='info' 
            sx={{ height: 45, p:0.5 }} 
          >
            { longDataParser((BigInt(receipt?.amt ?? '0')/BigInt(10 ** 9)).toString())} GLee Points minted to Address ({ '0x' + receipt?.to.substring(26, 30) + '...' + receipt?.to.substring(62, 66) })
          </Alert>          
        </Collapse>

      </Stack>
    </Paper>
  )
}
