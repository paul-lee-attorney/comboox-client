
import { useRouter } from "next/router";

import { HexType } from "../../../read";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { HeadOfDoc, getHeadByBody } from "../../../center/read/rc";
import { dateParser } from "../../../read/toolsKit";
import { OwnerPage } from "./Owner/write/OwnerPage";
import { ManagerPage } from "./Manager/write/ManagerPage";
import { LeaderPage } from "./Leader/write/LeaderPage";

function Payroll() {

  const [ index, setIndex ] = useState<number>(0);

  const { query } = useRouter();

  const body:HexType = `0x${query?.body?.toString().substring(2)}`;

  const [ head, setHead ] = useState<HeadOfDoc>();

  useEffect(()=>{
    if (body) {
      getHeadByBody(body).then(
        head => setHead(head)
      );
    }
  })

  return (
    <Stack direction='column' width='100%' height='100%' >
      <Box width={'100%'} height={'100%'} >
        <Paper elevation={3} sx={{m:2, p:1, border:1, height:'100%', borderColor:'divider' }}>
          <Stack direction='column' justifyContent='center' alignItems='center' >

            <Stack direction='row' sx={{ alignItems:'baseline' }} >

              <Typography sx={{ mt:5, mb:1, mr:10, textDecoration:'underline' }} variant="h4" >
                <b>Payroll Of Project</b>
              </Typography>

              <Stack direction='column' sx={{ alignItems:'baseline' }} >

                <Stack direction='row' sx={{ alignItems:'baseline' }} >
                  <Typography sx={{ m: 1, textDecoration:'underline' }} variant="body2" >
                    SN: {head?.seqOfDoc.toString().padStart(6, '0')}
                  </Typography>
                  <Typography sx={{ m: 1, textDecoration:'underline' }} variant="body2" >
                    Creator: {head?.creator.toString().padStart(6, '0')}
                  </Typography>
                </Stack>

                <Stack direction='row' sx={{ alignItems:'baseline' }} >
                  <Typography sx={{ m:1, mb:5, textDecoration:'underline' }} variant="body2" >
                    { dateParser(head?.createDate.toString() || '0')}
                  </Typography>
                </Stack>

              </Stack>

            </Stack>

            <Tabs 
              size="md" 
              sx={{ 
                justifyContent:'center', 
                alignItems:'center' 
              }}
              value={index}
              onChange={(e,v)=>setIndex(v as number)} 
            >

              <TabList tabFlex={1} sx={{ width: 880 }}  >
                <Tab><b>Member</b></Tab>
                <Tab><b>Leader</b></Tab>
                <Tab><b>Manager</b></Tab>
                <Tab><b>Owner</b></Tab>
              </TabList>

              <TabPanel value={0} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                Members Panel
              </TabPanel>

              <TabPanel value={1} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                <LeaderPage addr={body} />
              </TabPanel>

              <TabPanel value={2} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                <ManagerPage addr={body} />
              </TabPanel>

              <TabPanel value={3} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                <OwnerPage addr={body} />
              </TabPanel>

            </Tabs>

          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
} 

export default Payroll;