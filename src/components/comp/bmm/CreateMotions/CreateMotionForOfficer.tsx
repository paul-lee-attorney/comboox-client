import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { 
  useGeneralKeeperCreateMotionToRemoveOfficer, 
  useGeneralKeeperNominateOfficer, 
} from "../../../../generated";

import { IconButton, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { PersonAdd, PersonRemove } from "@mui/icons-material";

interface CreateMotionForOfficerProps {
  getMotionsList: ()=>any;
}

export function CreateMotionForOfficer({ getMotionsList }:CreateMotionForOfficerProps ) {

  const { gk } = useComBooxContext();

  const [ seqOfPos, setSeqOfPos ] = useState<number>();
  const [ candidate, setCandidate ] = useState<number>();

  const {
    isLoading: addOfficerLoading,
    write: addOfficer,
  } = useGeneralKeeperNominateOfficer({
    address: gk,
    args: seqOfPos && candidate
          ? [BigInt(seqOfPos), BigInt(candidate)]
          : undefined,
    onSuccess(){
      getMotionsList();
    }
  });

  const{
    isLoading: removeOfficerLoading,
    write: removeOfficer
  } = useGeneralKeeperCreateMotionToRemoveOfficer({
    address: gk,
    args: seqOfPos 
          ? [ BigInt(seqOfPos)]
          : undefined,
    onSuccess() {
      getMotionsList();
    }
  });

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction="row" sx={{ alignItems:'center' }} >

        <Tooltip
          title='AddOfficer'
          placement="top-start"
          arrow
        >
          <span>
          <IconButton
            disabled={ !addOfficer || addOfficerLoading }
            sx={{width:20, height:20, m:1}}
            onClick={()=>addOfficer?.()}
            color="primary"
          >
            <PersonAdd />
          </IconButton>
          </span>
        </Tooltip>

        <TextField 
          variant='outlined'
          label='SeqOfPos'
          size="small"
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfPos(parseInt(e.target.value))}
          value={ seqOfPos }
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
          title='RemoveOfficer'
          placement="top-end"
          arrow
        >
          <span>
          <IconButton
            disabled={ !removeOfficer || removeOfficerLoading }
            sx={{width:20, height:20, m:1}}
            onClick={()=>removeOfficer?.()}
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

