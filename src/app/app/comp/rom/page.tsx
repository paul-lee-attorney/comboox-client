"use client"

import { useState } from "react";

import { Paper, Stack, Toolbar, Typography } from "@mui/material";

import { MembersEquityList } from "./components/MembersList";

import { CopyLongStrSpan } from "../../common/CopyLongStr";
import { InvHistoryOfMember } from "./components/InvHistoryOfMember";
import { booxMap } from "../../common";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

function RegisterOfMembers() {

  const {boox} = useComBooxContext();

  const [ acct, setAcct ] = useState<number>(0);
  const [ open, setOpen ] = useState(false);
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction='row' >
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>ROM - Register Of Members</b>
        </Typography>

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