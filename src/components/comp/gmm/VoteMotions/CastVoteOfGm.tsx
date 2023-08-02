import { useEffect, useState } from "react";

import { 
  useGeneralKeeperCastVoteOfGm,
  usePrepareGeneralKeeperCastVoteOfGm, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Box, Button, Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Toolbar, Typography } from "@mui/material";
import { HowToVote, } from "@mui/icons-material";
import { Bytes32Zero, HexType } from "../../../../interfaces";
import { EntrustDelegaterForGeneralMeeting } from "./EntrustDelegaterForGeneralMeeting";
import { VoteResult } from "../../../common/meetingMinutes/VoteResult";
import { VoteCase, getVoteResult } from "../../../../queries/meetingMinutes";
import { HexParser } from "../../../../scripts/toolsKit";

interface ProposeMotionProps {
  seqOfMotion: bigint,
  setOpen: (flag: boolean) => void,
  getMotionsList: (minutes:HexType) => any,
}

export function CastVoteOfGm({ seqOfMotion, setOpen, getMotionsList }: ProposeMotionProps) {

  const { gk, boox } = useComBooxContext();

  const [ voteResult, setVoteResult ] = useState<VoteCase[]>();

  useEffect(()=>{
    if (boox) {
      getVoteResult(boox[5], seqOfMotion).then(
        list => setVoteResult(list)
      )
    }
  }, [seqOfMotion, boox]);

  const [ attitude, setAttitude ] = useState<string>('1');
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  // const {config} = usePrepareGeneralKeeperCastVoteOfGm({
  //   address: gk,
  //   args: attitude 
  //       ? [seqOfMotion, BigInt(attitude), sigHash]
  //       : undefined,
  // });

  const {
    isLoading: castVoteLoading,
    write: castVote,
  } = useGeneralKeeperCastVoteOfGm({
    address: gk,
    args: attitude 
        ? [seqOfMotion, BigInt(attitude), sigHash]
        : undefined,
    onSuccess() {
      if (boox) {
        getVoteResult(boox[5], seqOfMotion).then(
          list => setVoteResult(list)
        );
        getMotionsList(boox[5]);
        setOpen(false);
      }
    }
  });

  const [ appear, setAppear ] = useState(false);

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Box sx={{ minWidth:200 }} >
          <Toolbar >
            <h4>Cast Vote: </h4>
          </Toolbar>
        </Box>

        <Typography>
          Vote Directly
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

        <Stack direction="row" sx={{ alignItems:'stretch' }} >

          <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="attitude-lable">Attitude</InputLabel>
            <Select
              labelId="attitude-lable"
              id="attitude-select"
              value={ attitude }
              onChange={(e) => setAttitude(e.target.value)}
              size="small"
              label="Attitude"
            >
              <MenuItem value={'1'}>Support</MenuItem>
              <MenuItem value={'2'}>Against</MenuItem>
              <MenuItem value={'3'}>Abstain</MenuItem>
            </Select>
          </FormControl>

          <TextField 
            sx={{ m: 1, minWidth: 650 }} 
            id="tfHashOfAction" 
            label="SigHash / CID in IPFS" 
            variant="outlined"
            onChange={e => setSigHash(HexParser( e.target.value ))}
            value = { sigHash }
            size='small'
          />                                            

          <Button
            disabled={ !castVote || castVoteLoading }
            variant="contained"
            endIcon={<HowToVote />}
            sx={{ m:1, minWidth:128 }}
            onClick={()=>castVote?.()}
          >
            Vote
          </Button>
        </Stack>

        {voteResult && boox && (
          <VoteResult addr={boox[5]} seqOfMotion={seqOfMotion} />
        )}

      </Collapse>

      <Collapse in={ appear } >
        <EntrustDelegaterForGeneralMeeting seqOfMotion={seqOfMotion} setOpen={setOpen} getMotionsList={getMotionsList} />
      </Collapse>

    </Paper>
  );
}



