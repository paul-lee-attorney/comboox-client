
import { Alert, Button, Collapse, IconButton, Paper, Stack, TextField, Toolbar } from '@mui/material';

import { 
  useRegCenterMintPoints,
  useRegCenterTransferPoints, 
} from '../../generated';

import { AddrOfRegCenter, HexType } from '../../interfaces';
import { ArrowCircleRight, ArrowCircleRightOutlined, BorderColor, Close, Create } from '@mui/icons-material';
import { useState } from 'react';
import { bigint } from 'ethers';
import { getReceipt } from '../../queries/common';
import { longDataParser, longSnParser } from '../../scripts/toolsKit';

interface Receipt{
  from: string;
  to: string;
  amt: string;
}

interface TransferPointsProps {
  getUser: ()=> void;
}

export function TransferPoints({ getUser }: TransferPointsProps) {

  const [ to, setTo ] = useState<string>();
  const [ amt, setAmt ] = useState<string>();

  const [ receipt, setReceipt ] = useState<Receipt>();
  const [ open, setOpen ] = useState(false);

  // const { config: transferPointsConfig } = usePrepareRegCenterTransferPoints({
  //   address: AddrOfRegCenter,
  //   args: to && amt
  //     ? [BigInt(to), BigInt(amt)]
  //     : undefined,
  // })  

  const {
    isLoading: transferPointsLoading,
    write: transferPoints
  } = useRegCenterTransferPoints({
    address: AddrOfRegCenter,
    args: to && amt
      ? [BigInt(to), BigInt(amt)]
      : undefined,
    onSuccess(data:any) {
      getReceipt(data.hash).then(
        r => {
          if (r) {
            let rpt:Receipt = {
              from: longSnParser(BigInt(r.logs[0].topics[1]).toString()),
              to: longSnParser(BigInt(r.logs[0].topics[2]).toString()),
              amt: longDataParser(r.logs[0].topics[3]?.toString())
            }
            setReceipt(rpt);
            setOpen(true);
            getUser();
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
          disabled={ transferPointsLoading } 
          onClick={() => {
            transferPoints?.()
          }}
          variant='contained'
          sx={{ m:1, mx:2, minWidth:128 }} 
          endIcon={<ArrowCircleRightOutlined />}       
        >
          {transferPointsLoading ? 'Loading...' : 'Transfer'}
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
            {receipt?.amt} points transfered to User ({receipt?.to})
          </Alert>          
        </Collapse>

      </Stack>
    </Paper>
  )
}
