
import { Alert, Button, Collapse, IconButton, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterTransfer, 
} from '../../../generated';

import { AddrOfRegCenter, HexType } from '../../../scripts/common';
import { ArrowCircleRightOutlined, Close } from '@mui/icons-material';
import { useState } from 'react';
import { getReceipt } from '../../../scripts/common/common';
import { HexParser, getEthPart, getGEthPart, getGWeiPart } from '../../../scripts/common/toolsKit';
import { ActionsOfUserProps } from '../ActionsOfUser';
import { CBP, defaultCBP } from './Mint';

interface Receipt{
  from: string;
  to: string;
  amt: CBP;
}

export function TransferPoints({ refreshList, getUser, getBalanceOf }: ActionsOfUserProps) {

  const [ to, setTo ] = useState<HexType>();
  const [ amt, setAmt ] = useState<CBP>(defaultCBP);

  const [ receipt, setReceipt ] = useState<Receipt>();
  const [ open, setOpen ] = useState(false);

  const {
    isLoading: transferPointsLoading,
    write: transferPoints
  } = useRegCenterTransfer({
    address: AddrOfRegCenter,
    args: to && amt
      ? [ to, 
          BigInt(amt.cbp) * BigInt(10 ** 18) + BigInt(amt.glee) * BigInt(10 ** 9)]
      : undefined,
    onSuccess(data:any) {
      getReceipt(data.hash).then(
        r => {
          if (r) {
            let strAmt = BigInt(r.logs[0].topics[3]).toString();
            let rpt:Receipt = {
              from: r.logs[0].topics[1],
              to: r.logs[0].topics[2],
              amt: {
                gp: getGEthPart(strAmt),
                cbp: getEthPart(strAmt),
                glee: getGWeiPart(strAmt),
              }
            }
            setReceipt(rpt);
            setOpen(true);
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
          variant='outlined'
          label='To (Addr)'
          sx={{
            m:1,
            minWidth: 550,
          }}
          value={ to }
          onChange={e => setTo( HexParser(e.target.value ?? '0'))}
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
          onChange={e => setAmt(v => ({
            ...v,
            cbp: (e.target.value ?? '0')
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
          onChange={e => setAmt(v => ({
            ...v,
            glee: (e.target.value ?? '0')
          }))}
        />

        <Button 
          disabled={ transferPointsLoading } 
          onClick={() => {
            transferPoints?.()
          }}
          variant='contained'
          sx={{ m:1, mx:2, minWidth:128 }} 
          endIcon={<ArrowCircleRightOutlined />}       
        >
          Transfer
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
            {receipt?.amt.cbp != '-' && receipt?.amt.cbp + ' CBP, '} {receipt?.amt.glee != '-' && receipt?.amt.glee + ' GLee '} transfered to Addr ({ '0x' + receipt?.to.substring(26, 30) + '...' + receipt?.to.substring(62, 66)})
          </Alert>          
        </Collapse>

      </Stack>
    </Paper>
  )
}
