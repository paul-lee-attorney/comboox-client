import { useEffect, useState } from 'react';

import { booxMap } from '../../../common';


import { MemberShareClip, getEquityList, sortedMembersList } from '../rom';

import { useComBooxContext } from '../../../../_providers/ComBooxContextProvider';
import { ShowMembersList } from './ShowMembersList';
import { InvHistoryOfMember } from './InvHistoryOfMember';
import { Stack } from '@mui/material';

export function MembersList() {
  const { boox } = useComBooxContext();
  const [equityList, setEquityList] = useState<MemberShareClip[]>();

  useEffect(()=>{
    if (boox) {
      sortedMembersList(boox[booxMap.ROM]).then(
        ls => {
          let numLs = ls.map(v => Number(v));
          getEquityList(boox[booxMap.ROM], numLs).then(
            list => setEquityList(list)
          )
        }
      );
    }
  }, [boox]);

  const [ acct, setAcct ] = useState<number | undefined>();
  const [ open, setOpen ] = useState(false);
  
  return (
    <Stack direction="column" sx={{m:1}} >
      {equityList && equityList.length > 0 && (
        <ShowMembersList list={equityList} setAcct={setAcct} setOpen={setOpen} />
      )}

      {acct && open && (
        <InvHistoryOfMember acct={ acct } open={ open } setOpen={ setOpen } />
      )}

    </Stack>
  )
}



