import { useState } from 'react';

import { 
  TextField,
  Stack
} from '@mui/material';

import {
  useBookOfMembersSharesClipOfMember
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type SharesClipOfMemberProps = ContractProps & {
  args: readonly [BigNumber]
}

export function SharesClipOfMember({ addr, args }:SharesClipOfMemberProps ) {
  const [timestamp, setTimestamp] = useState('');
  const [par, setPar] = useState('');
  const [paid, setPaid] = useState('');

  const {isSuccess} = useBookOfMembersSharesClipOfMember({
    address: addr,
    args: args,
    onSuccess(data) {
      setTimestamp(data.timestamp.toString());
      setPar(data.par.toString());
      setPaid(data.paid.toString());
    }
  })

  return (
    <>
      {isSuccess && (
        <div>
          <h4>SharesClipOfMember</h4>
          <Stack direction="row" spacing={1} >
            <TextField value={timestamp} variant='outlined' label="Timestamp" />
            <TextField value={par} variant='outlined' label="RegisteredCapital" />
            <TextField value={paid} variant='outlined' label="PaidInCapital" />
          </Stack>
        </div>
      )}
    </>
  )
}

