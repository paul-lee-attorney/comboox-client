import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { 
  useGeneralKeeperCastVoteOfGm,
} from "../../../generated";

import { Bytes32Zero, HexType } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { HowToVote } from "@mui/icons-material";
import { useState } from "react";
import { VoteResult } from "../../common/meetingMinutes/VoteResult";
import { VoteCase, getVoteResult } from "../../../queries/meetingMinutes";

interface VoteForDocOfGmProps {
  seqOfMotion: bigint ;
  setNextStep: (next: number) => void;
}

export function VoteForDocOfGm({ seqOfMotion, setNextStep }: VoteForDocOfGmProps) {

  const [ voteResult, setVoteResult ] = useState<VoteCase[]>();
  const { gk, boox } = useComBooxContext();

  const [ attitude, setAttitude ] = useState<string>('1');
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  // const { 
  //   config
  // } =  usePrepareGeneralKeeperCastVoteOfGm ({
  //   address: gk,
  //   args: attitude && sigHash
  //       ? [ seqOfMotion, BigInt(attitude), sigHash ]
  //       : undefined,
  // });

  const {
    isLoading: castVoteLoading,
    write: castVote,
  } = useGeneralKeeperCastVoteOfGm({
    address: gk,
    args: attitude && sigHash
        ? [ seqOfMotion, BigInt(attitude), sigHash ]
        : undefined,
    onSuccess() {
      if (boox)
        getVoteResult(boox[5], seqOfMotion).then(
          list => setVoteResult(list)
        );
    }
  });

  return (
    <Stack direction='column' sx={{m:1, p:1, justifyContent:'center'}} >

      <Stack direction={'row'} sx={{m:1, p:1, alignItems:'center'}}>

        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
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
          onChange={e => setSigHash(`0x${e.target.value}`)}
          value = { sigHash.substring(2) }
          size='small'
        />                                            

        <Button
          disabled={!castVote || castVoteLoading}
          variant="contained"
          endIcon={<HowToVote />}
          sx={{ m:1, minWidth:218 }}
          onClick={()=>castVote?.()}
        >
          Cast Vote
        </Button>

      </Stack>

      {voteResult && boox && (
        <VoteResult addr={boox[5]} seqOfMotion={seqOfMotion} voteResult={voteResult} />
      )}

    </Stack>
  )

}