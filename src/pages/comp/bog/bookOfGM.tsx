import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";
import { CreateMotionOfGm } from "../../../components/comp/bog/CreateMotionOfGm";
import { FlowchartOfMotion } from "../../../components/common/meetingMinutes/FlowchartOfMotion";
import { Motion, getMotionsList, getSeqList } from "../../../queries/meetingMinutes";

function BookOfGM() {

  const { gk, boox } = useComBooxContext();

  const [ motionsList, setMotionsList ] = useState<Motion[]>();

  useEffect(()=>{
    getMotionsList(boox[3]).then(
      ls => setMotionsList(ls)
    )
  }, [boox])

  const [ open, setOpen ] = useState(false);
  const [ motion, setMotion ] = useState<Motion>();
  
  return (
    <Paper sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h3>BOG - Minutes Book Of Shareholders General Meeting</h3>
      </Toolbar>

      <table width={1680}>
        <thead/>

        <tbody>

          <tr>
            <td colSpan={4} >
              <CreateMotionOfGm  getMotionsList={getSeqList} />
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
              {motion && (
                <FlowchartOfMotion  open={open} motion={motion} setOpen={setOpen} obtainMotionsList={getMotionsList} />
              )}
            </td>
          </tr>

        </tbody>

      </table>


    </Paper>
  );
} 

export default BookOfGM;