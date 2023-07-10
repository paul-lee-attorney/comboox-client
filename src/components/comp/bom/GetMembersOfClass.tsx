import { useState } from 'react';


import {
  useBookOfMembersGetMembersOfClass
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { BigNumber } from 'ethers';
import { DataList } from '../../common/DataList';

type GetMembersOfClassProps = ContractProps & {
  args: readonly [BigNumber]
}
                                                                
export function GetMembersOfClass({ addr, args }:GetMembersOfClassProps ) {
  const [membersList, setMembersList] = useState<string[]>();

  useBookOfMembersGetMembersOfClass({
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

