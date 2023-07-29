import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Paper, Stack, Toolbar } from "@mui/material";

import { MembersEquityList } from "../../../components/comp/bom/MembersList";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";

function BookOfMembers() {

  const {boox} = useComBooxContext();
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction='row' >
        <Toolbar sx={{m:1, p:1, textDecoration:'underline' }}>
          <h3>BOM - Book Of Members</h3>
        </Toolbar>

        {boox && (
          <CopyLongStrSpan title="Addr" size="body1" src={boox[4].toLowerCase()} />
        )}
      </Stack>

      <MembersEquityList />

    </Paper>
  );
} 

export default BookOfMembers;