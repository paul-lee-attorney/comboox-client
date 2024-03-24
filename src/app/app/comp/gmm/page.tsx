"use client"

import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar, Typography } from "@mui/material";

import { GetMotionsList } from "./components/GetMotionsList";

import { CreateMotionOfGm } from "./components/CreateMotionOfGm";
import { Motion, getMotionsList } from "./meetingMinutes";
import { ApprovalFormOfMotion } from "./components/ApprovalFormOfMotion";
import { CopyLongStrSpan } from "../../common/CopyLongStr";
import { booxMap } from "../../common";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

function GeneralMeetingMinutes() {

  const { boox } = useComBooxContext();

  const [ motionsList, setMotionsList ] = useState<Motion[]>();

  const [ open, setOpen ] = useState(false);
  const [ motion, setMotion ] = useState<Motion>();
  const [ time, setTime ] = useState<number>(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

  useEffect(()=>{
    if (boox) {
      getMotionsList(boox[booxMap.GMM]).then(
        ls => setMotionsList(ls)
      );
    }
  }, [boox, time]);
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction="row" >

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>GMM - General Meeting Minutes</b>
        </Typography>

        {boox && (
          <CopyLongStrSpan title="Addr"  src={ boox[booxMap.GMM].toLowerCase() }  />
        )}

      </Stack>

      <CreateMotionOfGm  refresh={refresh} />

      {motionsList && (
        <GetMotionsList 
          list={motionsList} 
          title="Motions List - General Meeting of Members" 
          setMotion={setMotion}
          setOpen={setOpen}
        />
      )}

      {motion && boox && (
        <ApprovalFormOfMotion 
          minutes={boox[booxMap.GMM]}  
          open={open} 
          motion={motion} 
          setOpen={setOpen} 
          refresh={refresh} 
        />
      )}

    </Paper>
  );
} 

export default GeneralMeetingMinutes;