import { useState } from 'react';

import {
  useBookOfMembersSharesList
} from '../../../generated';

import { ContractProps } from '../../../interfaces';
import { DataList } from '../../common/DataList';


export function SharesList({ addr }:ContractProps ) {
  const [sharesList, setSharesList] = useState<string[]>();

  const {isSuccess, refetch} = useBookOfMembersSharesList({
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

