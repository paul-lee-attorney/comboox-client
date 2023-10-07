import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { Paper, Stack, Toolbar } from "@mui/material";

import { MembersEquityList } from "../../../components/comp/rom/MembersList";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { useState } from "react";
import { InvHistoryOfMember } from "../../../components/comp/rom/InvHistoryOfMember";
import { booxMap } from "../../../scripts/common";

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