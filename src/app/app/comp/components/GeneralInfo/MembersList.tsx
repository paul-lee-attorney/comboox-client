import { Stack } from "@mui/material";
import { MembersEquityList } from "../../rom/components/MembersList";
import { InvHistoryOfMember } from "../../rom/components/InvHistoryOfMember";
import { useState } from "react";

export function MembersList() {

  const [ acct, setAcct ] = useState<number>(0);
  const [ open, setOpen ] = useState(false);

  return (
    <Stack direction="row" sx={{m:1}}>
      <MembersEquityList setAcct={setAcct} setOpen={setOpen} />
      {acct > 0 && open && (
        <InvHistoryOfMember acct={ acct } open={ open } setOpen={ setOpen } />
      )}
    </Stack>
  );
}