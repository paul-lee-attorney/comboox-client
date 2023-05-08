import { useState } from 'react';

import { DataList } from '../..';

import {
  useRegisterOfMembersGetMembersOfClass
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';

type GetMembersOfClassProps = ContractProps & {
  args: readonly [BigNumber]
}
                                                                
export function GetMembersOfClass({ addr, args }:GetMembersOfClassProps ) {
  const [membersList, setMembersList] = useState<string[]>();

  useRegisterOfMembersGetMembersOfClass({
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

