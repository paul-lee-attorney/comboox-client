import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";

import { Motion, getMotion } from "../../../queries/meetingMinutes";
import { useMeetingMinutesGetSeqList } from "../../../generated";
import { CreateMotionOfBoardMeeting } from "../../../components/comp/bod/CreateMotionOfBoardMeeting";
import { ApprovalFormOfBoardMotion } from "../../../components/comp/bod/ApprovalFormOfBoardMotion";
import { Position, getDirectorsFullPosInfo, getManagersFullPosInfo } from "../../../queries/bod";
import { GetOfficersList } from "../../../components/comp/bod/GetOfficersList";

import { Tabs, Tab, TabList, TabPanel } from "@mui/joy";

function BookOfDirectors() {

  const { boox } = useComBooxContext();

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const getDirectorsList = async ()=>{
    if (boox) {
      let list = await getDirectorsFullPosInfo(boox[2]);
      setDirectorsList(list);
    }
  }

  useEffect(()=>{
    getDirectorsList();
  });

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth: 1680, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h3>BOD - Book Of Directors (Addr: {boox ? boox[2]: undefined}) </h3>
      </Toolbar>

      {directorsList && (
        <GetOfficersList list={directorsList} title="Directors List" getOfficersList={getDirectorsList} />
      )}
        
    </Paper>
  );
} 

export default BookOfDirectors;