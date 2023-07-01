import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useState } from "react";
import { Paper, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";
import { CreateMotionOfGm } from "../../../components/comp/bog/CreateMotionOfGm";
import { FlowchartOfMotion } from "../../../components/common/meetingMinutes/FlowchartOfMotion";
import { Motion, getMotion } from "../../../queries/meetingMinutes";
import { useMeetingMinutesGetSeqList } from "../../../generated";

function BookOfDirectors() {

  const { boox } = useComBooxContext();

  const [ motionsList, setMotionsList ] = useState<Motion[]>();

  const {
    refetch: getSeqList
  } = useMeetingMinutesGetSeqList({
    address: boox ? boox[2] : undefined,
    onSuccess(seqList) {

      const obtainMotionsList = async () => {

        if ( boox ) {
          let list: Motion[] = [];
          let len = seqList.length;
          let i = len >= 100 ? len - 100 : 0;

          while( i < len ) {
            let motion = await getMotion(boox[2], seqList[i]);
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
      <Toolbar>
        <h3>BOG - Minutes Book Of Shareholders General Meeting</h3>
      </Toolbar>

      <table width={1680}>
        <thead/>

        <tbody>

          <tr>
            <td colSpan={4} >
              <CreateMotionOfGm  getMotionsList={obtainSeqList} />
            </td>
          </tr>

          <tr>
            <td colSpan={4}>
              {motionsList && (
                <GetMotionsList 
                  list={motionsList} 
                  title="Motions List - General Meeting of Shareholders" 
                  setMotion={setMotion}
                  setOpen={setOpen}
                />
              )}
            </td>
          </tr>

          <tr>
            <td colSpan={4}>
              {motion && boox && (
                <FlowchartOfMotion 
                  minutes={boox[3]}  
                  open={open} 
                  motion={motion} 
                  setOpen={setOpen} 
                  obtainMotionsList={obtainSeqList} 
                />
              )}
            </td>
          </tr>

        </tbody>

      </table>


    </Paper>
  );
} 

export default BookOfDirectors;