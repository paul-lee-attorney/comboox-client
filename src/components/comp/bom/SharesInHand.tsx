import { useState } from 'react';

import {
  useBookOfMembersSharesInHand
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';
import { DataList } from '../../common/DataList';

type SharesInHandProps = ContractProps & {
  args: readonly [BigNumber]
}

export function SharesInHand({ addr, args }:SharesInHandProps ) {
  const [sharesList, setSharesList] = useState<string[]>();

  const {isSuccess, refetch} = useBookOfMembersSharesInHand({
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

