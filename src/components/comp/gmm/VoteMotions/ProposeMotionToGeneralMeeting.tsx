import { useState } from "react";

import { 
  useGeneralKeeperProposeMotionToGeneralMeeting, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Box, Button, Collapse, Paper, Stack, Switch, Toolbar, Typography } from "@mui/material";
import { EmojiPeople, } from "@mui/icons-material";
import { EntrustDelegaterForGeneralMeeting } from "./EntrustDelegaterForGeneralMeeting";
import { ProposeMotionProps } from "../../bmm/VoteMotions/ProposeMotionToBoardMeeting";

export function ProposeMotionToGeneralMeeting({ seqOfMotion, setOpen, setTime }: ProposeMotionProps) {

  const { gk } = useComBooxContext();
  
  const {
    isLoading: proposeMotionToGmLoading,
    write: proposeMotionToGm,
  } = useGeneralKeeperProposeMotionToGeneralMeeting({
    address: gk,
    args: [BigInt(seqOfMotion)],
    onSuccess(){
      setTime(Date.now());
      setOpen(false);
    }
  });

  const [ appear, setAppear ] = useState(false);

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1, width:'100%' }} >

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
            disabled={ !proposeMotionToGm || proposeMotionToGmLoading }
            variant="contained"
            endIcon={<EmojiPeople />}
            sx={{ m:1, minWidth:118 }}
            onClick={()=>proposeMotionToGm?.()}
          >
            Propose
          </Button>
        </Stack>
      </Collapse>

      <Collapse in={ appear } >
        <EntrustDelegaterForGeneralMeeting 
          seqOfMotion={seqOfMotion} 
          setOpen={setOpen} 
          setTime={setTime} 
        />
      </Collapse>

    </Paper>
  );
}



