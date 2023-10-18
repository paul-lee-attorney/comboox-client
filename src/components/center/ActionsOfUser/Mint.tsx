
import { Alert, Button, Collapse, IconButton, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterMint, 
} from '../../../generated';

import { AddrOfRegCenter, AddrZero, HexType, MaxUserNo } from '../../../scripts/common';
import { Close, Flare } from '@mui/icons-material';
import { useState } from 'react';

import { ActionsOfUserProps } from '../ActionsOfUser';
import { FormResults, defFormResults, getEthPart, getGEthPart, getGWeiPart, hasError, onlyNum } from '../../../scripts/common/toolsKit';
import { waitForTransaction } from '@wagmi/core';
import { LoadingButton } from '@mui/lab';

interface Receipt{
  to: string;
  amt: CBP;
}

export interface CBP{
  gp: string;
  cbp: string;
  glee: string;
}

export const defaultCBP:CBP = {
  gp: '0',
  cbp: '0',
  glee: '0',
}

export function MintPoints({getUser, getBalanceOf}:ActionsOfUserProps) {

  const [ to, setTo ] = useState<string>('0');
  const [ amt, setAmt ] = useState<CBP>(defaultCBP);
  const [ receipt, setReceipt ] = useState<Receipt>();
  const [ open, setOpen ] = useState(false);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [loading, setLoading] = useState(false);

  const {
    isLoading: mintPointsLoading,
    write: mintPoints
  } = useRegCenterMint({
    address: AddrOfRegCenter,
    args: hasError(valid) ? undefined
      : [ BigInt(to), 
          BigInt(amt.cbp) * BigInt(10 ** 18) 
        + BigInt(amt.glee) * BigInt(10 ** 9)
        ],
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      waitForTransaction({hash}).then(
        res => {
          if (res && res.logs[0].topics[3] && res.logs[0].topics[2]) {
            let strAmt = BigInt(res.logs[0].topics[3]).toString();
            let rpt:Receipt = {
              to: res.logs[0].topics[2],
              amt: {
                gp: getGEthPart(strAmt),
                cbp: getEthPart(strAmt),
                glee: getGWeiPart(strAmt),
              }
            }
            setReceipt(rpt);
            setOpen(true);
            getUser();
            getBalanceOf();
            setLoading(false);
          }
          console.log("Receipt: ", res);          
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
          error={ valid['To']?.error }
          helperText={ valid['To']?.helpTx ?? ' ' }          
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ to }
          onChange={e => {
            let input = e.target.value ?? '0';
            onlyNum('To', input, MaxUserNo, setValid); 
            setTo(input);
          }}
        />

        <TextField 
          size="small"
          variant="outlined"
          label='Amount (CBP)'
          error={ valid['Amount(CBP)']?.error }
          helperText={ valid['Amount(CBP)']?.helpTx ?? ' ' }          
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ amt.cbp }
          onChange={e => {
            let input = e.target.value ?? '0';
            onlyNum('Amount(CBP)', input, 0n, setValid);
            setAmt(v => ({
              ...v,
              cbp: input,
            }));
          }}
        />

        <TextField 
          size="small"
          variant="outlined"
          label='Amount (GLee)'
          error={ valid['Amount(GLee)']?.error }
          helperText={ valid['Amount(GLee)']?.helpTx ?? ' ' }          
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ amt.glee }
          onChange={e => {
            let input = e.target.value ?? '0';
            onlyNum('Amount(GLee)', input, 0n, setValid);
            setAmt(v => ({
              ...v,
              glee: input,
            }))
          }}
        />

        <LoadingButton 
          size='small'
          disabled={ mintPointsLoading || hasError(valid)} 
          loading={loading}
          loadingPosition='end'
          onClick={() => {
            mintPoints?.()
          }}
          variant='contained'
          sx={{ m:1, mx:2, minWidth:128, height:40 }} 
          endIcon={<Flare />}       
        >
          Mint
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

            variant="outlined" 
            severity='info' 
            sx={{ height: 45, p:0.5 }} 
          >
            {(receipt?.amt.gp != '-' && receipt?.amt.gp != '0') && receipt?.amt.gp + ' Giga-CBP '} 
            {(receipt?.amt.cbp != '-' && receipt?.amt.cbp != '0') && receipt?.amt.cbp + ' CBP ' } 
            {(receipt?.amt.glee != '-' && receipt?.amt.glee != '0') && receipt?.amt.glee + ' GLee ' } 
            minted to Address 
            ({ '0x' + receipt?.to.substring(26, 30) + '...' + receipt?.to.substring(62, 66) })
          </Alert>          
        </Collapse>

      </Stack>
    </Paper>
  )
}
