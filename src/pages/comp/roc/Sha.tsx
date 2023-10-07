
import { useRouter } from "next/router";

import { HexType, booxMap } from "../../../scripts/common";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";

import { AgrmtAccessControl } from "../../../components/common/accessControl/AgrmtAccessControl";
import { ShaBodyTerms } from "../../../components/comp/roc/sha/ShaBodyTerms";
import { Signatures } from "../../../components/common/sigPage/Signatures";
import { useState } from "react";
import { ShaLifecycle } from "../../../components/comp/roc/sha/ShaLifecycle";
import { useAccessControlIsFinalized, useFilesFolderGetFile } from "../../../generated";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { InfoOfFile } from "../../../scripts/common/filesFolder";
import { IndexCard } from "../../../components/common/fileFolder/IndexCard";
import { BookOutlined } from "@mui/icons-material";

function Sha() {
  const { boox } = useComBooxContext();

  const [ index, setIndex ] = useState(0);

  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  const [ open, setOpen ] = useState(false);

  const [ file, setFile ] = useState<InfoOfFile>();

  useFilesFolderGetFile({
    address: boox ? boox[booxMap.ROC]: undefined,
    args: sha ? [sha]: undefined,
    onSuccess(res) {
      setFile({
        addr: sha,
        sn: res.snOfDoc,
        head: res.head,
        ref: res.ref        
      });
    }
  })

  const [ isFinalized, setIsFinalized ] = useState<boolean>(false);

  useAccessControlIsFinalized({
    address: sha != '0x' ? sha : undefined,
    onSuccess(flag) {
      setIsFinalized(flag);
    }
  })

  return (
    <Stack direction='column' width='100%' height='100%' >
      <Box width={'100%'} height={'100%'} >
        <Paper elevation={3} sx={{m:2, p:1, border:1, height:'100%', borderColor:'divider' }}>
          <Stack direction='column' justifyContent='center' alignItems='center' >

            <Stack direction='row' sx={{ alignItems:'baseline', mb:5 }} >

              <Typography sx={{ mt: 5, mb:2, textDecoration:'underline' }} variant="h4" >
                <b>Shareholders Agreement</b>
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
              size='md' 
              sx={{ 
                justifyContent:'center', 
                alignItems:'center' 
              }}
              value={index}
              onChange={(e, v) => setIndex(v as number)}
            >

              <TabList tabFlex={1} sx={{ width: 880 }} >
                <Tab><b>Body Term</b></Tab>
                {!isFinalized && (
                  <Tab><b>Access Control</b></Tab>
                )}
                <Tab><b>Sig Page</b></Tab>
                <Tab><b>Sup Page</b></Tab>
                <Tab><b>Life Cycle</b></Tab>
              </TabList>

              <TabPanel value={0} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {isFinalized != undefined && (
                  <ShaBodyTerms sha={sha} isFinalized={isFinalized} />
                )}
              </TabPanel>

              <TabPanel value={1} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {sha != '0x' && !isFinalized && (
                  <AgrmtAccessControl isSha={true} agrmt={sha} />
                )}
              </TabPanel>

              <TabPanel value={2} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {sha != '0x' && isFinalized != undefined && (
                  <Signatures addr={sha} initPage={true} isFinalized={isFinalized} isSha={ true } />
                )}
              </TabPanel>

              <TabPanel value={3} sx={{ width:'100%', justifyContent:'center', alignItems:'center' }} >
                {sha != '0x' && isFinalized != undefined && (
                  <Signatures addr={sha} initPage={false} isFinalized={isFinalized} isSha={ true } />
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