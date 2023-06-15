import { useState } from "react";

import { 
  useGeneralKeeperProposeMotionOfGm, 
  usePrepareGeneralKeeperProposeMotionOfGm 
} from "../../../generated";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Box, Button, Collapse, Paper, Stack, Switch, Toolbar, Typography } from "@mui/material";
import { EmojiPeople, } from "@mui/icons-material";
import { EntrustDelegaterOfMember } from "./EntrustDelegaterOfMember";

interface ProposeMotionProps {
  seqOfMotion: string,
  setOpen: (flag: boolean) => void,
  getMotionsList: () => any,
}

export function ProposeMotionOfGm({ seqOfMotion, setOpen, getMotionsList }: ProposeMotionProps) {

  const { gk } = useComBooxContext();

  const {
    config: proposeMotionOfGmConfig,
  } = usePrepareGeneralKeeperProposeMotionOfGm({
    address: gk,
    args: [BigNumber.from(seqOfMotion)],
  });

  const {
    isLoading: proposeMotionOfGmLoading,
    write: proposeMotionOfGm,
  } = useGeneralKeeperProposeMotionOfGm({
    ...proposeMotionOfGmConfig,
    onSuccess(){
      getMotionsList();
      setOpen(false);
    }
  });

  const [ appear, setAppear ] = useState(false);

  return (
    <Paper sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Box sx={{ minWidth:200 }} >
          <Toolbar >
            <h4>Propose Motion: </h4>
          </Toolbar>
        </Box>

        <Typography>
          Propose Directly
        </Typography>

        <Switch 
          color="primary" 
          onChange={(e) => setAppear( e.target.checked )} 
          checked={ appear } 
        />

        <Typography>
          Entrust Delegate
        </Typography>

      </Stack>

      <Collapse in={ !appear } >
        <Stack direction="row" sx={{ alignItems:'center' }} >
         <Button
            disabled={ !proposeMotionOfGm || proposeMotionOfGmLoading }
            variant="contained"
            endIcon={<EmojiPeople />}
            sx={{ m:1, minWidth:118 }}
            onClick={()=>proposeMotionOfGm?.()}
          >
            Propose
          </Button>
        </Stack>
      </Collapse>

      <Collapse in={ appear } >
        <EntrustDelegaterOfMember 
          seqOfMotion={seqOfMotion} 
          setOpen={setOpen} 
          getMotionsList={getMotionsList} 
        />
      </Collapse>

    </Paper>
  );
}



