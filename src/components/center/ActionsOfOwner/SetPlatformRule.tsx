
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterSetPlatformRule,
} from '../../../generated';

import { AddrOfRegCenter, HexType } from '../../../scripts/common';
import { BorderColor } from '@mui/icons-material';
import { useState } from 'react';
import { StrRule, codifyPlatformStrRule, defaultStrRule } from '../../../scripts/center/rc';
import { ActionsOfOwnerProps } from '../ActionsOfOwner';
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from '../../../scripts/common/toolsKit';

export function SetPlatformRule({ refresh }:ActionsOfOwnerProps) {

  const [ rule, setRule ] = useState<StrRule>(defaultStrRule);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: setPlatformRuleLoading,
    write: setPlatformRule
  } = useRegCenterSetPlatformRule({
    address: AddrOfRegCenter,
    args: hasError(valid) ? undefined : [ codifyPlatformStrRule(rule)],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{ alignItems:'start' }} >

        <TextField 
          size="small"
          variant='outlined'
          label='EOA_Rewards(GLee)'
          error = { valid['EOA_Rewards']?.error }
          helperText = { valid['EOA_Rewards']?.helpTx }
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.eoaRewards }
          onChange={e => {
            let input = e.target.value;
            onlyNum('EOA_Rewards', input, 0n, setValid);
            setRule(v => ({
              ...v,
              eoaRewards: input, 
            }));
          }}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='COA_Rewards(GLee)'
          error = { valid['COA_Rewards']?.error }
          helperText = { valid['COA_Rewards']?.helpTx }
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.coaRewards }
          onChange={e => {
            let input = e.target.value;
            onlyNum('COA_Rewards', input, 0n, setValid);            
            setRule(v => ({
              ...v,
              coaRewards: input, 
            }));
        }}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='FloorOfRoyalty(GLee)'
          error = { valid['FloorOfRoyalty']?.error }
          helperText = { valid['FloorOfRoyalty']?.helpTx }
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.floor }
          onChange={e => {
            let input = e.target.value;
            onlyNum('FloorOfRoyalty', input, 0n, setValid);
            setRule(v => ({
              ...v,
              floor: input, 
            }));
          }}
        />

        <TextField 
          size="small"
          variant='outlined'
          label='OffRateOnCommission (BP)'
          error = { valid['OffRate']?.error }
          helperText = { valid['OffRate']?.helpTx }
          sx={{
            m:1,
            minWidth: 128,
          }}
          value={ rule.rate }
          onChange={e => {
            let input = e.target.value;
            onlyNum('OffRate', input, 0n, setValid);
            setRule(v =>({
                ...v,
                rate: input, 
            }));
          }}
        />

        <Button 
          disabled={ setPlatformRuleLoading || hasError(valid)} 
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
