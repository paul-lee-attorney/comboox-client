import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { 
  useGeneralKeeperCreateMotionToRemoveDirector, 
  useGeneralKeeperNominateDirector, 
} from "../../../../generated";

import { IconButton, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { PersonAdd, PersonRemove } from "@mui/icons-material";
import { CreateMotionProps } from "../../bmm/CreateMotionOfBoardMeeting";
import { HexType } from "../../../../scripts/common";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";

export function CreateMotionForBoardSeats({ refresh }:CreateMotionProps ) {

  const { gk } = useComBooxContext();

  const [ seqOfPos, setSeqOfPos ] = useState<number>();
  const [ candidate, setCandidate ] = useState<number>();

  const {
    isLoading: addDirectorLoading,
    write: addDirector,
  } = useGeneralKeeperNominateDirector({
    address: gk,
    args: seqOfPos && candidate
          ? [BigInt(seqOfPos), BigInt(candidate)]
          : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const{
    isLoading: removeDirectorLoading,
    write: removeDirector
  } = useGeneralKeeperCreateMotionToRemoveDirector({
    address: gk,
    args: seqOfPos 
          ? [ BigInt(seqOfPos)]
          : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction="row" sx={{ alignItems:'center' }} >

        <Tooltip
          title='AddDirector'
          placement="top-start"
          arrow
        >
          <span>
          <IconButton
            disabled={ !addDirector || addDirectorLoading }
            sx={{width:20, height:20, m:1}}
            onClick={()=>addDirector?.()}
            color="primary"
          >
            <PersonAdd />
          </IconButton>
          </span>
        </Tooltip>

        <TextField 
          variant='outlined'
          label='SeqOfPos'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfPos(parseInt(e.target.value))}
          value={ seqOfPos }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='Candidate'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setCandidate(parseInt(e.target.value))}
          value={ candidate }
          size='small'
        />

        <Tooltip
          title='RemoveDirector'
          placement="top-end"
          arrow
        >
          <span>
          <IconButton
            disabled={ !removeDirector || removeDirectorLoading }
            sx={{width:20, height:20, m:1}}
            onClick={()=>removeDirector?.()}
            color="primary"
          >
            <PersonRemove />
          </IconButton>
          </span>
        </Tooltip>

      </Stack>          
    </Paper>
  );
}


