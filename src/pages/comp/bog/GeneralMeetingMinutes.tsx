import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";
import { CreateMotionOfGm } from "../../../components/comp/bog/CreateMotionOfGm";
import { Motion, getMotion } from "../../../queries/meetingMinutes";
import { useMeetingMinutesGetSeqList } from "../../../generated";
import { ApprovalFormOfMotion, FlowchartOfMotion } from "../../../components/comp/bog/ApprovalFormOfMotion";
import { Tabs, Tab, TabList, TabPanel } from "@mui/joy";
import { GetOfficersList } from "../../../components/comp/bod/GetOfficersList";
import { Position, getDirectorsFullPosInfo } from "../../../queries/bod";
import { MembersEquityList } from "../../../components/comp/rom/MembersList";
import { ApprovalFormOfBoardMotion } from "../../../components/comp/bod/ApprovalFormOfBoardMotion";

function BookOfGeneralMeeting() {

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
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >
      <Toolbar sx={{m:1, p:1}}>
        <h3>GMM - General Meeting Minutes (Addr: {boox ? boox[4] : undefined})</h3>
      </Toolbar>

      <CreateMotionOfGm  getMotionsList={obtainSeqList} />

      {motionsList && (
        <GetMotionsList 
          list={motionsList} 
          title="Motions List - General Meeting of Shareholders" 
          setMotion={setMotion}
          setOpen={setOpen}
        />
      )}

      {motion && boox && (
        <ApprovalFormOfMotion 
          minutes={boox[3]}  
          open={open} 
          motion={motion} 
          setOpen={setOpen} 
          obtainMotionsList={obtainSeqList} 
        />
      )}

    </Paper>
  );
} 

export default BookOfGeneralMeeting;