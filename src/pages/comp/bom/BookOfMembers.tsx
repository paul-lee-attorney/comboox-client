import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Paper, Toolbar } from "@mui/material";

import { MembersEquityList } from "../../../components/comp/bom/MembersList";

function BookOfMembers() {

  const {boox} = useComBooxContext();
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >
      <Toolbar sx={{m:1, p:1}}>
        <h3>BOM - Book Of Members (Addr: {boox ? boox[4] : undefined})</h3>
      </Toolbar>

      <MembersEquityList />

    </Paper>
  );
} 

export default BookOfMembers;