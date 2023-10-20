
import { Alert, Button, Collapse, IconButton, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterTransfer, 
} from '../../../generated';

import { AddrOfRegCenter, AddrZero, HexType } from '../../../scripts/common';
import { ArrowCircleRightOutlined, Close } from '@mui/icons-material';
import { useState } from 'react';
import { getReceipt } from '../../../scripts/common/common';
import { FormResults, HexParser, defFormResults, getEthPart, getGEthPart, getGWeiPart, hasError, longDataParser, onlyHex, onlyInt, onlyNum } from '../../../scripts/common/toolsKit';
import { ActionsOfUserProps } from '../ActionsOfUser';
import { LoadingButton } from '@mui/lab';

interface Receipt{
  from: string;
  to: string;
  amt: string;
}

export function TransferPoints({ refreshList, getUser, getBalanceOf }: ActionsOfUserProps) {

  const [ to, setTo ] = useState<HexType>(AddrZero);
  const [ amt, setAmt ] = useState('0');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ receipt, setReceipt ] = useState<Receipt>();
  const [ open, setOpen ] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    isLoading: transferPointsLoading,
    write: transferPoints
  } = useRegCenterTransfer({
    address: AddrOfRegCenter,
    args: !hasError(valid)
      ? [ to, 
          BigInt(Number(amt) * (10 ** 9)) * (10n ** 9n)]
      : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      getReceipt(hash).then(
        r => {
          console.log("Receipt: ", r);
          if (r) {
            let rpt:Receipt = {
              from: r.logs[0].topics[1],
              to: r.logs[0].topics[2],
              amt: BigInt(r.logs[0].topics[3]).toString(),
              };
            setReceipt(rpt);
            setOpen(true);
            getBalanceOf();
            setLoading(false);
          }
        }
      )
    }
  })


  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'start', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='outlined'
          label='To (Addr)'
          error={ valid['To(Addr)']?.error }
          helperText={ valid['To(Addr)']?.helpTx ?? ' ' }                                  
          sx={{
            m:1,
            minWidth: 550,
          }}
          value={ to }
          onChange={e => {
            let input = HexParser(e.target.value ?? '0');
            onlyHex('To(Addr)', input, 40, setValid);
            setTo(input);
          }}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='Amount (CBP)' 
          error={ valid['Amt(CBP)']?.error }
          helperText={ valid['Amt(CBP)']?.helpTx ?? ' ' }                                  
          sx={{
            m:1,
            minWidth: 218,
          }}
          value={ amt }
          onChange={e => {
            let input = e.target.value;
            onlyNum('Amt(CBP)', input, 0n, 9, setValid);
            setAmt(input);
          }}
        />

        <LoadingButton 
          disabled={ transferPointsLoading || hasError(valid) } 
          loading={loading}
          loadingPosition='end'
          onClick={() => {
            transferPoints?.()
          }}
          variant='contained'
          sx={{ m:1, mx:2, minWidth:128 }} 
          endIcon={<ArrowCircleRightOutlined />}       
        >
          Transfer
        </LoadingButton>

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
            {  longDataParser(receipt?.amt ?? '0') + ' CBP' } transfered to Addr ({ '0x' + receipt?.to.substring(26, 30) + '...' + receipt?.to.substring(62, 66)})
          </Alert>          
        </Collapse>

      </Stack>
    </Paper>
  )
}
