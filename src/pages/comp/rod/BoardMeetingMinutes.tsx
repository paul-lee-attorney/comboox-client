import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";

import { Motion, getMotion } from "../../../queries/meetingMinutes";
import { useMeetingMinutesGetSeqList } from "../../../generated";
import { CreateMotionOfBoardMeeting } from "../../../components/comp/rod/CreateMotionOfBoardMeeting";
import { ApprovalFormOfBoardMotion } from "../../../components/comp/rod/ApprovalFormOfBoardMotion";
import { CopyLongStrSpan, CopyLongStrTF } from "../../../components/common/utils/CopyLongStr";


function BoardMeetingMinutes() {

  const { boox } = useComBooxContext();

  const [ motionsList, setMotionsList ] = useState<Motion[]>();

  const {
    refetch: getSeqList
  } = useMeetingMinutesGetSeqList({
    address: boox ? boox[3] : undefined,
    onSuccess(seqList) {

      const obtainMotionsList = async () => {

        if ( boox ) {
          let list: Motion[] = [];
          let len = seqList.length;
          let i = len >= 100 ? len - 100 : 0;

          while( i < len ) {
            let motion = await getMotion(boox[3], seqList[i]);
            list.push(motion);
            i++;
          }
        
          setMotionsList(list);
        }
      }

      obtainMotionsList();
    }
  });

  const [ open, setOpen ] = useState(false);
  const [ motion, setMotion ] = useState<Motion>();

  const obtainSeqList = ()=> {
    getSeqList();
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' >
        <Toolbar>
          <h3>BMM - Board Meeting Minutes </h3>
        </Toolbar>
        {boox && (
          <CopyLongStrSpan size="body1" title="Addr" src={ boox[2].toLowerCase() } />
        )}
      </Stack>
      <Stack direction='column' justifyContent='center' alignItems='start' sx={{m:1, p:1}} >

        <CreateMotionOfBoardMeeting  getMotionsList={obtainSeqList} />

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
            minutes={boox[3]}  
            open={open} 
            motion={motion} 
            setOpen={setOpen} 
            obtainMotionsList={obtainSeqList}
          />
        )}       

      </Stack>

    </Paper>
  );
} 

export default BoardMeetingMinutes;