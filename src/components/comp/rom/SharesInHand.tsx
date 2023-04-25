import { useState } from 'react';

import { DataList } from '../..';

import {
  useRegisterOfMembersSharesInHand
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type SharesInHandProps = ContractProps & {
  args: readonly [BigNumber]
}

export function SharesList({ addr, args }:SharesInHandProps ) {
  const [sharesList, setSharesList] = useState<string[]>();

  const {isSuccess, refetch} = useRegisterOfMembersSharesInHand({
    address: addr,
    args: args,
    onSuccess(data) {
      let temp!:string[];
      data?.map(v => temp.push(v.substring(2)));

      setSharesList(temp);
    }
  })

  return (
    <>
      {sharesList && (<DataList isOrdered={true} data={sharesList} />)}
    </>
  )
}

