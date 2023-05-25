
import { useEffect } from 'react';

import { 
  Stack,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';

import { EditNote }  from '@mui/icons-material';

import { readContract } from '@wagmi/core';

import { 
  shareholdersAgreementABI,
  usePrepareShareholdersAgreementAddRule,
  useShareholdersAgreementAddRule,
} from '../../../../generated';

import { HexType } from '../../../../interfaces';
import { BigNumber } from 'ethers';

async function getRule(sha: HexType, seq: number): Promise<HexType> {
  let rule = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'getRule',
    args: [BigNumber.from(seq)],
  });

  return rule;
}

interface AddRuleProps {
  sha: HexType,
  rule: HexType,
  setUpdatedRule: (rule: HexType) => void,
  editable: boolean,
  setEditable: (flag: boolean) => void,
  finalized: boolean,
}

export function AddRule({ sha, rule, setUpdatedRule, editable, setEditable, finalized }: AddRuleProps) {

  const { config } = usePrepareShareholdersAgreementAddRule({
    address: sha,
    args: rule ? [rule]: undefined,
  });

  const {
    data,
    isLoading,
    write,
  } = useShareholdersAgreementAddRule(config);

  const handleClick = () => {
    write?.();
  }

  let seq = parseInt(rule.substring(2, 6), 16);

  useEffect(() => {
    getRule(sha, seq).then(rule => 
      setUpdatedRule(rule)
    );
  }, [data, sha, seq, setUpdatedRule]);

  return (
    <>
      {!finalized && (
        <Stack direction='row' sx={{m:1, mr:5, p:1, alignItems:'center', justifyItems:'center'}}>
          
          <Button 
            disabled = {!write || isLoading}

            sx={{ m: 1, minWidth: 120, height: 40 }} 
            variant="contained" 
            endIcon={<EditNote />}
            onClick={()=> write?.()}
            size='small'
          >
            Update
          </Button>

          <FormControlLabel 
            label='Edit'
            sx={{
              ml: 1,
            }}
            control={
              <Checkbox 
                sx={{
                  m: 1,
                  height: 64,
                }}
                onChange={e => setEditable(e.target.checked)}
                checked={ editable }
              />
            }
          />

        </Stack>
      )}
    </>
  )
}
