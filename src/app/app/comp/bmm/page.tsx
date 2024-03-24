"use client"

import { useEffect, useState } from "react";

import { Paper, Stack, Toolbar, Typography } from "@mui/material";
import { GetMotionsList } from "../gmm/components/GetMotionsList";
import { Motion, getMotionsList } from "../gmm/meetingMinutes";
import { CreateMotionOfBoardMeeting } from "./components/CreateMotionOfBoardMeeting";
import { ApprovalFormOfBoardMotion } from "./components/ApprovalFormOfBoardMotion";

import { CopyLongStrSpan } from "../../common/CopyLongStr";

import { booxMap } from "../../common";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

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
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>BMM - Board Meeting Minutes </b>
        </Typography>
        
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