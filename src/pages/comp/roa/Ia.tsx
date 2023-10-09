
import { useRouter } from "next/router";

import { HexType, booxMap } from "../../../scripts/common";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";

import { AgrmtAccessControl } from "../../../components/common/accessControl/AgrmtAccessControl";
import { useEffect, useState } from "react";
import IaBodyTerms from "../../../components/comp/roa/ia/IaBodyTerms";
import { IaLifecycle } from "../../../components/comp/roa/ia/IaLifecycle";
import { Signatures } from "../../../components/common/sigPage/Signatures";
import { InfoOfFile, getFile } from "../../../scripts/common/filesFolder";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { IndexCard } from "../../../components/common/fileFolder/IndexCard";
import { BookOutlined } from "@mui/icons-material";
import { isFinalized } from "../../../scripts/common/accessControl";

function Ia() {
  const { boox } = useComBooxContext();

  const [ index, setIndex ] = useState<number>(0);

  const { query } = useRouter();
  const ia:HexType = `0x${query?.addr?.toString().substring(2)}`;

  const [ file, setFile ] = useState<InfoOfFile>();

  useEffect(()=>{
    if (boox && ia) {
      getFile(boox[booxMap.ROA], ia).then(
        res => setFile({
          addr: ia,
          sn: res.snOfDoc,
          head: res.head,
          ref: res.ref
        })
      );
    }
  }, [boox, ia]);

  const [ open, setOpen ] = useState(false);
  const [ finalized, setFinalized ] = useState<boolean>(false);

  useEffect(()=>{
    if (ia && ia != '0x') {
      isFinalized(ia).then(
        res => setFinalized(res)
      );
    } 
  }, [ia]);

  return (
    <Stack direction='column' width='100%' height='100%' >
      <Box width={'100%'} height={'100%'} >
        <Paper elevation={3} sx={{m:2, p:1, border:1, height:'100%', borderColor:'divider' }}>
          <Stack direction='column' justifyContent='center' alignItems='center' >

            <Stack direction='row' sx={{ alignItems:'baseline' }} >

              <Typography sx={{ mt: 5, mb:2, mr:2, textDecoration:'underline' }} variant="h4" >
                <b>Investment Agreement</b>
              </Typography>

              {file && (
                <IndexCard file={file} open={open} setOpen={setOpen} />
              )}

              <Tooltip title="IndexCard" placement="top" arrow >
                <IconButton 
                  size="large"
                  color="primary"
                  sx={{ mx:1 }}
                  onClick={()=>setOpen(true)}
                >
                  <BookOutlined />
                </IconButton>
              </Tooltip>

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
                <Tab><b>Body Term</b></Tab>
                {!finalized && (
                  <Tab><b>Access Control</b></Tab>
                )}
                <Tab><b>Sig Page</b></Tab>
                <Tab><b>Sup Page</b></Tab>
                <Tab><b>Life Cycle</b></Tab>
              </TabList>

              <TabPanel value={0} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {finalized != undefined && (
                  <IaBodyTerms addr={ia} isFinalized={finalized} />
                )}
              </TabPanel>

              {!finalized && (
                <TabPanel value={1} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                  {ia != '0x' && (
                    <AgrmtAccessControl isSha={false} agrmt={ia} />
                  )}
                </TabPanel>
              )}

              <TabPanel value={2} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {ia != '0x' && finalized != undefined && (
                  <Signatures addr={ia} initPage={true} isFinalized={finalized} isSha={ false }/>
                )}
              </TabPanel>

              <TabPanel value={3} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {ia != '0x' && finalized != undefined && (
                  <Signatures addr={ia} initPage={false} isFinalized={finalized} isSha={ false } />
                )}
              </TabPanel>

              <TabPanel value={4} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {finalized != undefined && (
                  <IaLifecycle addr={ia} isFinalized={finalized} />
                )}
              </TabPanel>

            </Tabs>

          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
} 

export default Ia;