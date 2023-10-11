import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";
import { CreateMotionOfGm } from "../../../components/comp/gmm/CreateMotionOfGm";
import { Motion, getMotionsList } from "../../../scripts/common/meetingMinutes";
import { ApprovalFormOfMotion } from "../../../components/comp/gmm/ApprovalFormOfMotion";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { booxMap } from "../../../scripts/common";

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

        <Toolbar sx={{m:1, p:1, textDecoration:'underline'}}>
          <h3>GMM - General Meeting Minutes</h3>
        </Toolbar>

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