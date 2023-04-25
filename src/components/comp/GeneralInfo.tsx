import { Stack } from '@mui/material';

import {
  GetCompId,
  BasedOnPar,
  MaxQtyOfMembers,
  OwnersEquity,
  TotalVotes,
  GetNumOfMembers,
  QtyOfGroups,
  GetControllorInfo,
  SharesList,
  MembersList,
} from '.'


import { useState } from 'react';

type GeneralInfoProps = {
  gk: string,
  books: string[]
}

export function GeneralInfo( { gk, books } : GeneralInfoProps ) {
  
  const [addrOfGK, setAddrOfGK] = useState(gk);
  
  return (
    <>
      <hr />
        <h2 >Company General Info</h2>
      <hr />

      <Stack direction="row" spacing={1} >
        <GetCompId addr={ addrOfGK } />
        <GetControllorInfo addr={ `0x${books[7]}` } />
      </Stack>

      <hr />

      <Stack direction="row" spacing={1} >
        <BasedOnPar addr={ `0x${books[7]}` } />
        <TotalVotes addr={ `0x${books[7]}` } />
        <MaxQtyOfMembers addr={ `0x${books[7]}` } />
        <GetNumOfMembers addr={ `0x${books[7]}` } />
      </Stack>

      <OwnersEquity addr={ `0x${books[7]}` } />
      <br/>
      <QtyOfGroups addr={ `0x${books[7]}` } />
      <br />
      
      <SharesList addr={`0x${books[7]}`} />
      <br />
      <MembersList addr={`0x${books[7]}`} />
      <br />
      

    </>
  )
}

