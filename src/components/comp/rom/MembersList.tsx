import { useState } from 'react';

import { DataList } from '../../';

import {
  useRegisterOfMembersMembersList
} from '../../../generated';

import { ContractProps } from '../../../interfaces';


export function MembersList({ addr }:ContractProps ) {
  const [membersList, setMembersList] = useState<string[]>();

  const {isSuccess, refetch} = useRegisterOfMembersMembersList({
    address: addr,
    onSuccess(data) {
      let temp!:string[];
      data?.map(v => temp.push(v.toNumber().toString()));

      setMembersList(temp);
    }
  })

  return (
    <>
      {membersList && (<DataList isOrdered={true} data={membersList} />)}
    </>
  )
}

