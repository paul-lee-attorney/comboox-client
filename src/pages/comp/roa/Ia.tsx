
import { useRouter } from "next/router";

import { HexType } from "../../../interfaces";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";

import { AgrmtAccessControl } from "../../../components/common/accessControl/AgrmtAccessControl";
import { useState } from "react";
import IaBodyTerms from "../../../components/comp/roa/ia/IaBodyTerms";
import { IaLifecycle } from "../../../components/comp/roa/ia/IaLifecycle";
import { Signatures } from "../../../components/common/sigPage/Signatures";
import { useAccessControlIsFinalized, useFilesFolderGetFile } from "../../../generated";
import { InfoOfFile } from "../../../queries/filesFolder";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { IndexCard } from "../../../components/common/fileFolder/IndexCard";
import { BookOutlined } from "@mui/icons-material";

function Ia() {
  const { boox } = useComBooxContext();
  const { query } = useRouter();
  const ia:HexType = `0x${query?.addr?.toString().substring(2)}`;

  const [ file, setFile ] = useState<InfoOfFile>();

  useFilesFolderGetFile({
    address: boox ? boox[6]: undefined,
    args: ia ? [ia]: undefined,
    onSuccess(res) {
      setFile({
        addr: ia,
        sn: res.snOfDoc,
        head: res.head,
        ref: res.ref        
      });
    }
  })

  const [ open, setOpen ] = useState(false);

  const [ isFinalized, setIsFinalized ] = useState<boolean>();

  useAccessControlIsFinalized({
    address: ia != '0x' ? ia : undefined,
    onSuccess(flag) {
      setIsFinalized(flag);
    }
  });

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
            <Tabs size="sm" defaultValue={0} sx={{ justifyContent:'center', alignItems:'center' }} >

              <TabList variant="solid" color="primary" sx={{ width: 980 }}  >
                <Tab value={0}><b>Body Term</b></Tab>
                {!isFinalized && (
                  <Tab value={1}><b>Access Control</b></Tab>
                )}
                <Tab value={2}><b>Signature Page</b></Tab>
                <Tab value={3}><b>Sup Signature Page</b></Tab>
                <Tab value={4}><b>Life Cycle</b></Tab>
              </TabList>

              <TabPanel value={0} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {isFinalized != undefined && (
                  <IaBodyTerms ia={ia} isFinalized={isFinalized} />
                )}
              </TabPanel>

              {!isFinalized && (
                <TabPanel value={1} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                  {ia != '0x' && (
                    <AgrmtAccessControl isSha={false} agrmt={ia} />
                  )}
                </TabPanel>
              )}

              <TabPanel value={2} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {ia != '0x' && isFinalized != undefined && (
                  <Signatures addr={ia} initPage={true} isFinalized={isFinalized} isSha={ false }/>
                )}
              </TabPanel>

              <TabPanel value={3} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {ia != '0x' && isFinalized != undefined && (
                  <Signatures addr={ia} initPage={false} isFinalized={isFinalized} isSha={ false } />
                )}
              </TabPanel>

              <TabPanel value={4} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {isFinalized != undefined && (
                  <IaLifecycle ia={ia} isFinalized={isFinalized} />
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