import { useState } from "react";
import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { 
  useGeneralKeeperCreateMotionToRemoveDirector, 
  useGeneralKeeperNominateDirector, 
  usePrepareGeneralKeeperCreateMotionToRemoveDirector, 
  usePrepareGeneralKeeperNominateDirector 
} from "../../../generated";

import { BigNumber } from "ethers";
import { IconButton, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { PersonAdd, PersonRemove } from "@mui/icons-material";

interface CreateMotionForBoardSeatsProps {
  getMotionsList: ()=>any;
}

export function CreateMotionForBoardSeats({ getMotionsList }:CreateMotionForBoardSeatsProps ) {

  const { gk } = useComBooxContext();

  const [ seqOfPos, setSeqOfPos ] = useState<number>();
  const [ candidate, setCandidate ] = useState<number>();

  const {
    config: addDirectorConfig
  } = usePrepareGeneralKeeperNominateDirector({
    address: gk,
    args: seqOfPos && candidate
          ? [BigNumber.from(seqOfPos), BigNumber.from(candidate)]
          : undefined,
  });

  const {
    isLoading: addDirectorLoading,
    write: addDirector,
  } = useGeneralKeeperNominateDirector({
    ...addDirectorConfig,
    onSuccess(){
      getMotionsList();
    }
  });

  const {
    config: removeDirectorConfig
  } = usePrepareGeneralKeeperCreateMotionToRemoveDirector({
    address: gk,
    args: seqOfPos 
          ? [ BigNumber.from(seqOfPos)]
          : undefined,
  });

  const{
    isLoading: removeDirectorLoading,
    write: removeDirector
  } = useGeneralKeeperCreateMotionToRemoveDirector({
    ...removeDirectorConfig,
    onSuccess() {
      getMotionsList();
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

