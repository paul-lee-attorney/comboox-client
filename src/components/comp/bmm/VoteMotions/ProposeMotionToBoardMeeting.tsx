import { Dispatch, SetStateAction, useState } from "react";

import { 
  useGeneralKeeperProposeMotionToBoard,
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Box, Button, Collapse, Paper, Stack, Switch, Toolbar, Typography } from "@mui/material";
import { EmojiPeople, } from "@mui/icons-material";
import { HexType } from "../../../../scripts/common";
import { EntrustDelegaterForBoardMeeting } from "./EntrustDelegaterForBoardMeeting";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";

export interface ProposeMotionProps {
  seqOfMotion: bigint,
  setOpen: Dispatch<SetStateAction<boolean>>,
  refresh: ()=>void;
}

export function ProposeMotionToBoardMeeting({ seqOfMotion, setOpen, refresh }: ProposeMotionProps) {

  const { gk } = useComBooxContext();

  const updateResults = ()=>{
    refresh();
    setOpen(false);
  }

  const {
    isLoading: proposeMotionToBoardLoading,
    write: proposeMotionToBoard,
  } = useGeneralKeeperProposeMotionToBoard({
    address: gk,
    args: [BigInt(seqOfMotion)],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
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
            disabled={ !proposeMotionToBoard || proposeMotionToBoardLoading }
            variant="contained"
            endIcon={<EmojiPeople />}
            sx={{ m:1, minWidth:118 }}
            onClick={()=>proposeMotionToBoard?.()}
          >
            Propose
          </Button>
        </Stack>
      </Collapse>

      <Collapse in={ appear } >
        <EntrustDelegaterForBoardMeeting 
          seqOfMotion={seqOfMotion} 
          setOpen={setOpen} 
          refresh={refresh} 
        />
      </Collapse>

    </Paper>
  );
}



