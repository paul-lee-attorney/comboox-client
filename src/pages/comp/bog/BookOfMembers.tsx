import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";
import { CreateMotionOfGm } from "../../../components/comp/bog/CreateMotionOfGm";
import { Motion, getMotion } from "../../../queries/meetingMinutes";
import { useMeetingMinutesGetSeqList } from "../../../generated";
import { Tabs, Tab, TabList, TabPanel } from "@mui/joy";
import { GetOfficersList } from "../../../components/comp/bod/GetOfficersList";
import { Position, getDirectorsFullPosInfo } from "../../../queries/bod";
import { MembersEquityList } from "../../../components/comp/rom/MembersList";

function BookOfGeneralMeeting() {

  const {boox} = useComBooxContext();
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >
      <Toolbar sx={{m:1, p:1}}>
        <h3>BOM - Book Of Members (Addr: {boox ? boox[8] : undefined})</h3>
      </Toolbar>

      <MembersEquityList />

    </Paper>
  );
} 

export default BookOfGeneralMeeting;