import { useState } from 'react';

import { DataList } from '../..';

import {
  useRegisterOfMembersMembersOfGroup
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type MembersOfGroupProps = ContractProps & {
  args: readonly [BigNumber]
}
                                                                
export function MembersOfGroup({ addr, args }:MembersOfGroupProps ) {
  const [membersList, setMembersList] = useState<string[]>();

  const {isSuccess, refetch} = useRegisterOfMembersMembersOfGroup({
    address: addr,
    args: args,
    onSuccess(data) {
      let temp!:string[];
      data?.map(v => temp.push(v.toNumber().toString()));

      setMembersList(temp);
    }
  })

  return (
    <>
      {membersList && (<DataList isOrdered={true} data={ membersList } />)}
    </>
  )
}

