import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";

import { Motion, getMotionsList } from "../../../scripts/common/meetingMinutes";
import { CreateMotionOfBoardMeeting } from "../../../components/comp/bmm/CreateMotionOfBoardMeeting";
import { ApprovalFormOfBoardMotion } from "../../../components/comp/bmm/ApprovalFormOfBoardMotion";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { booxMap } from "../../../scripts/common";


function BoardMeetingMinutes() {

  const { boox } = useComBooxContext();

  const [ motionsList, setMotionsList ] = useState<Motion[]>();

  const [ open, setOpen ] = useState(false);
  const [ motion, setMotion ] = useState<Motion>();
  const [ time, setTime ] = useState<number>(0);

  const refresh = ()=> {
    setTime(Date.now());
  }

  useEffect(()=>{
    if (boox) {
      getMotionsList(boox[booxMap.BMM]).then(
        ls => setMotionsList(ls)
      );
    }
  }, [boox, time]);

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' >
        <Toolbar sx={{ textDecoration:'underline' }} >
          <h3>BMM - Board Meeting Minutes </h3>
        </Toolbar>
        {boox && (
          <CopyLongStrSpan  title="Addr" src={ boox[booxMap.BMM].toLowerCase() } />
        )}
      </Stack>
      <Stack direction='column' justifyContent='center' alignItems='start' sx={{m:1, p:1}} >

        <CreateMotionOfBoardMeeting  refresh={refresh} />

        {motionsList && (
          <GetMotionsList 
            list={motionsList} 
            title="Motions List - Board Meeting" 
            setMotion={setMotion}
            setOpen={setOpen}
          />
        )}

        {motion && boox && (
          <ApprovalFormOfBoardMotion 
            minutes={boox[booxMap.BMM]}  
            open={open} 
            motion={motion} 
            setOpen={setOpen} 
            refresh={refresh}
          />
        )}       

      </Stack>

    </Paper>
  );
} 

export default BoardMeetingMinutes;