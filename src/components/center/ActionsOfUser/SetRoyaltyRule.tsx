
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterSetRoyaltyRule
} from '../../../generated';

import { AddrOfRegCenter } from '../../../interfaces';
import { BorderColor } from '@mui/icons-material';
import { useState } from 'react';
import { Key, codifyRoyaltyRule, defaultKey } from '../../../queries/rc';
import { ActionsOfUserProps } from '../ActionsOfUser';

export function SetRoyaltyRule({ refreshList, getUser }:ActionsOfUserProps) {

  const [ rule, setRule ] = useState<Key>(defaultKey);

  const {
    isLoading: setRoyaltyRuleLoading,
    write: setRoyaltyRule
  } = useRegCenterSetRoyaltyRule({
    address: AddrOfRegCenter,
    args: rule ? [ codifyRoyaltyRule(rule)] : undefined,
    onSuccess() {
      refreshList();
      getUser();
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          size="small"
          variant='outlined'
          label='DiscountRate (BP)'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.discount }
          onChange={e => setRule(v => ({
            ...v,
            discount: parseInt( e.target.value ?? '0'), 
          }))}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='GiftAmt (GLee)'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.gift }
          onChange={e => setRule(v => ({
            ...v,
            gift: parseInt( e.target.value ?? '0'), 
          }))}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='CouponAmt (GLee)'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.coupon }
          onChange={e => setRule(v => ({
            ...v,
            coupon: parseInt( e.target.value ?? '0'), 
          }))}
        />

        <Button 
          disabled={ setRoyaltyRuleLoading } 
          onClick={() => setRoyaltyRule?.()}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128, height:40 }} 
          endIcon={<BorderColor />}
        >
          Set
        </Button>

      </Stack>
    </Paper>
  )
}
