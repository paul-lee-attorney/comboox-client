
import { useRouter } from "next/router";

import { HexType } from "../../../interfaces";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { AgrmtAccessControl } from "../../../components/common/accessControl/AgrmtAccessControl";
import { ShaBodyTerms } from "../../../components/comp/boh/sha/ShaBodyTerms";
import { Signatures } from "../../../components/common/sigPage/Signatures";
import { useEffect, useState } from "react";
import { finalized } from "../../../queries/accessControl";
import { ShaLifecycle } from "../../../components/comp/boh/sha/ShaLifecycle";

function Sha() {
  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;
  const snOfDoc:string | undefined = query.snOfDoc?.toString();

  const [ isFinalized, setIsFinalized ] = useState<boolean>();

  useEffect(()=>{
    if (sha != '0x')
      finalized(sha).then(
        flag => setIsFinalized(flag)
      );    
  }, [sha])


  return (
    <Stack direction='column' width='100%' height='100%' >
      <Box width={'100%'} height={'100%'} >
        <Paper elevation={3} sx={{m:2, p:1, border:1, height:'100%', borderColor:'divider' }}>
          <Stack direction='column' justifyContent='center' alignItems='center' >

            <Typography sx={{ mt: 5, mb:2, textDecoration:'underline' }} variant="h4" >
              <b>Shareholders Agreement</b>
            </Typography>

            <Typography sx={{ mt:1 }} variant="body1">
              SnOfDoc: ({snOfDoc})
            </Typography>

            <Typography sx={{ m:1 }} variant="body1">
              Addr: ({sha})
            </Typography>

            <Tabs size="sm" defaultValue={0} sx={{ justifyContent:'center', alignItems:'center' }} >

              <TabList variant="solid" color="primary" sx={{ width: 980 }}  >
                <Tab value={0}><b>Body Term</b></Tab>
                <Tab value={1}><b>Access Control</b></Tab>
                <Tab value={2}><b>Signature Page</b></Tab>
                <Tab value={3}><b>Sup Signature Page</b></Tab>
                <Tab value={4}><b>Life Cycle</b></Tab>
              </TabList>

              <TabPanel value={0} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {isFinalized != undefined && (
                  <ShaBodyTerms sha={sha} isFinalized={isFinalized} />
                )}
              </TabPanel>

              <TabPanel value={1} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {sha != '0x' && (
                  <AgrmtAccessControl agrmt={sha} />
                )}
              </TabPanel>

              <TabPanel value={2} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {sha != '0x' && isFinalized != undefined && (
                  <Signatures addr={sha} initPage={true} isFinalized={isFinalized} />
                )}
              </TabPanel>

              <TabPanel value={4} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {sha != '0x' && isFinalized != undefined && (
                  <ShaLifecycle sha={sha} isFinalized={isFinalized} />
                )}
              </TabPanel>

            </Tabs>

          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
} 

export default Sha;