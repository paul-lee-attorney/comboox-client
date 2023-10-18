import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { 
  useGeneralKeeperCreateMotionToRemoveOfficer, 
  useGeneralKeeperNominateOfficer, 
} from "../../../../generated";

import { IconButton, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { PersonAdd, PersonRemove } from "@mui/icons-material";
import { CreateMotionProps } from "../CreateMotionOfBoardMeeting";
import { HexType, MaxSeqNo, MaxUserNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { loadingButtonClasses } from "@mui/lab";

export function CreateMotionForOfficer({ refresh }:CreateMotionProps ) {

  const { gk } = useComBooxContext();

  const [ seqOfPos, setSeqOfPos ] = useState<string>();
  const [ candidate, setCandidate ] = useState<string>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ loading, setLoading ] = useState(false);
  const updateResults = ()=>{
    refresh();
    setLoading(false);
  }

  const {
    isLoading: addOfficerLoading,
    write: addOfficer,
  } = useGeneralKeeperNominateOfficer({
    address: gk,
    args: seqOfPos && candidate && !hasError(valid)
          ? [BigInt(seqOfPos), BigInt(candidate)]
          : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const [ loadingRemove, setLoadingRemove ] = useState(false);
  const updateResultsRemove = ()=>{
    refresh();
    setLoadingRemove(false);
  }


  const{
    isLoading: removeOfficerLoading,
    write: removeOfficer
  } = useGeneralKeeperCreateMotionToRemoveOfficer({
    address: gk,
    args: seqOfPos && !hasError(valid) 
          ? [ BigInt(seqOfPos)]
          : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResultsRemove);
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
            disabled={ !addOfficer || addOfficerLoading || hasError(valid) || loading}
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
          error={ valid['SeqOfPos']?.error }
          helperText={ valid['SeqOfPos']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('SeqOfPos', input, MaxSeqNo, setValid);
            setSeqOfPos(input);
          }}
          value={ seqOfPos }
        />

        <TextField 
          variant='outlined'
          label='Candidate'
          error={ valid['Candidate']?.error }
          helperText={ valid['Candidate']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Candidate', input, MaxUserNo, setValid);
            setCandidate(input);
          }}
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
            disabled={ !removeOfficer || removeOfficerLoading || hasError(valid) || loadingRemove}
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


