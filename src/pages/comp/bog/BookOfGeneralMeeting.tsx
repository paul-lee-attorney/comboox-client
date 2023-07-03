import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Box, Paper, Stack, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";
import { CreateMotionOfGm } from "../../../components/comp/bog/CreateMotionOfGm";
import { Motion, getMotion } from "../../../queries/meetingMinutes";
import { useBookOfDirectorsGetDirectorsFullPosInfo, useMeetingMinutesGetSeqList } from "../../../generated";
import { FlowchartOfMotion } from "../../../components/comp/bog/FlowchartOfMotion";
import { Tabs, Tab, TabList, TabPanel } from "@mui/joy";
import { GetOfficersList } from "../../../components/comp/bod/GetOfficersList";
import { Position, getDirectorsFullPosInfo } from "../../../queries/bod";
import { MembersEquityList } from "../../../components/comp/rom/MembersList";

function BookOfGeneralMeeting() {

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
      <Toolbar sx={{m:1, p:1}}>
        <h3>BOG - Book Of General Meeting</h3>
      </Toolbar>

      <Stack direction='column' justifyContent='center' alignItems='start' sx={{m:1, p:1}} >

        <Tabs size="sm" defaultValue={0} sx={{ m:1, justifyContent:'center', alignItems:'start' }} >

          <TabList variant="soft" color="primary" sx={{ m:1, width: 980 }}  >
            <Tab value={0}><b>Members List</b></Tab>
            <Tab value={1}><b>General Meeting Minutes</b></Tab>
            <Tab value={2}><b>Directors List</b></Tab>
          </TabList>

          <TabPanel value={0} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
            <MembersEquityList />
          </TabPanel>

          <TabPanel value={1} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >

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
              <FlowchartOfMotion 
                minutes={boox[3]}  
                open={open} 
                motion={motion} 
                setOpen={setOpen} 
                obtainMotionsList={obtainSeqList}
                getOfficersList={getDirectorsList} 
              />
            )}


          </TabPanel>

          <TabPanel value={2} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >

            {directorsList && (
              <GetOfficersList list={directorsList} title="Directors List" getOfficersList={getDirectorsList} />
            )}

          </TabPanel>

        </Tabs>
      </Stack>

    </Paper>
  );
} 

export default BookOfGeneralMeeting;