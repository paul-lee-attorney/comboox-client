
import { useRouter } from "next/router";

import { HexType } from "../../../interfaces";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { AgrmtAccessControl } from "../../../components/common/accessControl/AgrmtAccessControl";
import { useState } from "react";
// import { finalized } from "../../../queries/accessControl";
import IaBodyTerms from "../../../components/comp/boi/ia/IaBodyTerms";
import { IaLifecycle } from "../../../components/comp/boi/ia/IaLifecycle";
import { Signatures } from "../../../components/common/sigPage/Signatures";
import { useAccessControlIsFinalized } from "../../../generated";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";

function Ia() {
  const { query } = useRouter();
  const ia:HexType = `0x${query?.addr?.toString().substring(2)}`;
  const snOfDoc:string | undefined = query.snOfDoc?.toString();

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

            <Typography sx={{ mt: 5, mb:2, textDecoration:'underline' }} variant="h4" >
              <b>Investment Agreement</b>
            </Typography>

            <Typography sx={{ mt:1 }} variant="body1">
              SnOfDoc: ({snOfDoc})
            </Typography>

            <CopyLongStrSpan size='body1' title='Addr' src={ia.toLowerCase()} />

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