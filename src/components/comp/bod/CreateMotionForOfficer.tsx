import { useState } from "react";
import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { 
  useGeneralKeeperCreateMotionToRemoveDirector, 
  useGeneralKeeperCreateMotionToRemoveOfficer, 
  useGeneralKeeperNominateDirector, 
  useGeneralKeeperNominateOfficer, 
  usePrepareGeneralKeeperCreateMotionToRemoveDirector, 
  usePrepareGeneralKeeperCreateMotionToRemoveOfficer, 
  usePrepareGeneralKeeperNominateDirector, 
  usePrepareGeneralKeeperNominateOfficer
} from "../../../generated";

import { BigNumber } from "ethers";
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
    config: addOfficerConfig
  } = usePrepareGeneralKeeperNominateOfficer({
    address: gk,
    args: seqOfPos && candidate
          ? [BigNumber.from(seqOfPos), BigNumber.from(candidate)]
          : undefined,
  });

  const {
    isLoading: addOfficerLoading,
    write: addOfficer,
  } = useGeneralKeeperNominateOfficer({
    ...addOfficerConfig,
    onSuccess(){
      getMotionsList();
    }
  });

  const {
    config: removeOfficerConfig
  } = usePrepareGeneralKeeperCreateMotionToRemoveOfficer({
    address: gk,
    args: seqOfPos 
          ? [ BigNumber.from(seqOfPos)]
          : undefined,
  });

  const{
    isLoading: removeOfficerLoading,
    write: removeOfficer
  } = useGeneralKeeperCreateMotionToRemoveOfficer({
    ...removeOfficerConfig,
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
          variant='filled'
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
          variant='filled'
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

