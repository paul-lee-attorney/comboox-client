import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";
import { CreateMotionOfGm } from "../../../components/comp/gmm/CreateMotionOfGm";
import { Motion, getMotion } from "../../../scripts/common/meetingMinutes";
import { useMeetingMinutesGetSeqList } from "../../../generated";
import { ApprovalFormOfMotion } from "../../../components/comp/gmm/ApprovalFormOfMotion";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { booxMap } from "../../../scripts/common";

function GeneralMeetingMinutes() {

  const { boox } = useComBooxContext();

  const [ motionsList, setMotionsList ] = useState<Motion[]>();

  const {
    refetch: getSeqList
  } = useMeetingMinutesGetSeqList({
    address: boox ? boox[booxMap.GMM] : undefined,
    onSuccess(seqList) {

      const obtainMotionsList = async () => {

        if ( boox ) {
          let list: Motion[] = [];
          let len = seqList.length;
          let i = len >= 100 ? len - 100 : 0;

          while( i < len ) {
            let motion = await getMotion(boox[booxMap.GMM], seqList[i]);
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

      <Stack direction="row" >

        <Toolbar sx={{m:1, p:1, textDecoration:'underline'}}>
          <h3>GMM - General Meeting Minutes</h3>
        </Toolbar>

        {boox && (
          <CopyLongStrSpan title="Addr"  src={ boox[booxMap.GMM].toLowerCase() }  />
        )}

      </Stack>

      <CreateMotionOfGm  getMotionsList={obtainSeqList} />

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
          obtainMotionsList={obtainSeqList} 
        />
      )}

    </Paper>
  );
} 

export default GeneralMeetingMinutes;