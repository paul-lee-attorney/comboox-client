import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";

import { Motion, getMotion } from "../../../queries/meetingMinutes";
import { useBookOfDirectorsGetDirectorsFullPosInfo, useBookOfDirectorsGetManagersFullPosInfo, useMeetingMinutesGetSeqList } from "../../../generated";
import { CreateMotionOfBoardMeeting } from "../../../components/comp/bod/CreateMotionOfBoardMeeting";
import { FlowchartOfBoardMotion } from "../../../components/comp/bod/FlowchartOfBoardMotion";
import { Position, getDirectorsFullPosInfo, getManagersFullPosInfo } from "../../../queries/bod";
import { GetOfficersList } from "../../../components/comp/bod/GetOfficersList";

import { Tabs, Tab, TabList, TabPanel } from "@mui/joy";

function BookOfDirectors() {

  const { boox } = useComBooxContext();

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const {
    refetch: getDirectorsList
  } = useBookOfDirectorsGetDirectorsFullPosInfo({
    address: boox ? boox[2] : undefined,
    onSuccess(list) {
      setDirectorsList(list);
    }
  });

  const [ officersList, setOfficersList ] = useState<readonly Position[]>();

  const {
    refetch: getOfficersList
  } = useBookOfDirectorsGetManagersFullPosInfo({
    address: boox ? boox[2]: undefined,
    onSuccess(list) {
      setOfficersList(list);
    }
  })


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
        <h3>BOD - Book Of Directors (Addr: {boox ? boox[2]: undefined}) </h3>
      </Toolbar>

      <Stack direction='column' justifyContent='center' alignItems='start' sx={{m:1, p:1}} >

        <Tabs size="sm" defaultValue={0} sx={{ justifyContent:'center', alignItems:'center' }} >

          <TabList variant="soft" color="primary" sx={{ width: 980 }}  >
            <Tab value={0}><b>Directors List</b></Tab>
            <Tab value={1}><b>Board Meeting Minutes</b></Tab>
            <Tab value={2}><b>Officers List</b></Tab>
          </TabList>

          <TabPanel value={0} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >

            {directorsList && (
              <GetOfficersList list={directorsList} title="Directors List" getOfficersList={getDirectorsList} />
            )}

          </TabPanel>

          <TabPanel value={1} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >

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
              <FlowchartOfBoardMotion 
                minutes={boox[2]}  
                open={open} 
                motion={motion} 
                setOpen={setOpen} 
                obtainMotionsList={obtainSeqList}
                getOfficersList={getOfficersList} 
              />
            )}

          </TabPanel>

          <TabPanel value={2} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >

            {officersList && (
              <GetOfficersList list={officersList} title="Officers List" getOfficersList={getOfficersList} />
            )}

          </TabPanel>


        </Tabs>


        

      </Stack>

    </Paper>
  );
} 

export default BookOfDirectors;