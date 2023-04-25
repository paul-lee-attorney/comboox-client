import { useState } from 'react';

import { DataList } from '../../.';

import {
  useRegisterOfMembersSharesList
} from '../../../generated';

import { ContractProps } from '../../../interfaces';


export function SharesList({ addr }:ContractProps ) {
  const [sharesList, setSharesList] = useState<string[]>();

  const {isSuccess, refetch} = useRegisterOfMembersSharesList({
    address: addr,
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

