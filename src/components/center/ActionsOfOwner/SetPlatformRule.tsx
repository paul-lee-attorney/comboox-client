
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterSetPlatformRule,
} from '../../../generated';

import { AddrOfRegCenter } from '../../../interfaces';
import { BorderColor } from '@mui/icons-material';
import { useState } from 'react';
import { Rule, codifyPlatformRule, defaultRule } from '../../../queries/rc';
import { ActionsOfOwnerProps } from '../ActionsOfOwner';

export function SetPlatformRule({ refreshPage }:ActionsOfOwnerProps) {

  const [ rule, setRule ] = useState<Rule>(defaultRule);

  const {
    isLoading: setPlatformRuleLoading,
    write: setPlatformRule
  } = useRegCenterSetPlatformRule({
    address: AddrOfRegCenter,
    args: rule ? [ codifyPlatformRule(rule)] : undefined,
    onSuccess() {
      refreshPage()
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          size="small"
          variant='outlined'
          label='EOA_Rewards(GLee)'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.eoaRewards }
          onChange={e => setRule(v => ({
            ...v,
            eoaRewards: parseInt( e.target.value ?? '0'), 
          }))}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='COA_Rewards(GLee)'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.coaRewards }
          onChange={e => setRule(v => ({
            ...v,
            coaRewards: parseInt( e.target.value ?? '0'), 
          }))}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='FloorOfRoyalty(GLee)'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.floor }
          onChange={e => setRule(v => ({
            ...v,
            floor: parseInt( e.target.value ?? '0'), 
          }))}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='CommissionRate (BP)'
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.rate }
          onChange={e => setRule(v => ({
            ...v,
            rate: parseInt( e.target.value ?? '0'), 
          }))}
        />

        <Button 
          disabled={ setPlatformRuleLoading } 
          onClick={() => setPlatformRule?.()}
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
