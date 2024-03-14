"use client"

import { useState } from "react";

import { Paper, Stack, Toolbar } from "@mui/material";

import { MembersEquityList } from "./read/MembersList";

import { CopyLongStrSpan } from "../../read/CopyLongStr";
import { InvHistoryOfMember } from "./read/InvHistoryOfMember";
import { booxMap } from "../../read";

import { useComBooxContext } from "../../_providers/ComBooxContextProvider";

function RegisterOfMembers() {

  const {boox} = useComBooxContext();

  const [ acct, setAcct ] = useState<number>(0);
  const [ open, setOpen ] = useState(false);
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction='row' >
        <Toolbar sx={{m:1, p:1, textDecoration:'underline' }}>
          <h3>ROM - Register Of Members</h3>
        </Toolbar>

        {boox && (
          <CopyLongStrSpan title="Addr"  src={boox[booxMap.ROM].toLowerCase()} />
        )}
      </Stack>

      <MembersEquityList setAcct={setAcct} setOpen={setOpen} />

      {acct > 0 && open && (
        <InvHistoryOfMember acct={ acct } open={ open } setOpen={ setOpen } />
      )}

    </Paper>
  );
} 

export default RegisterOfMembers;