import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { 
  useGeneralKeeperCastVoteOfGm,
} from "../../../../generated";

import { Bytes32Zero, HexType, booxMap } from "../../../../scripts/common";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { HowToVote } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import { VoteResult } from "../../../common/meetingMinutes/VoteResult";
import { VoteCase, getVoteResult } from "../../../../scripts/common/meetingMinutes";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../../scripts/common/toolsKit";

interface VoteForDocOfGMProps {
  seqOfMotion: bigint;
  setNextStep: Dispatch<SetStateAction<number>>;
}

export function VoteForDocOfGm( { seqOfMotion }: VoteForDocOfGMProps ) {

  const [ voteResult, setVoteResult ] = useState<VoteCase[]>();
  const { gk, boox } = useComBooxContext();

  const [ attitude, setAttitude ] = useState<string>('1');
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const updateResults = ()=>{
    if (boox)
      getVoteResult(boox[booxMap.GMM], seqOfMotion).then(
        list => setVoteResult(list)
      );
  }

  const {
    isLoading: castVoteLoading,
    write: castVote,
  } = useGeneralKeeperCastVoteOfGm({
    address: gk,
    args: attitude && sigHash
        ? [ seqOfMotion, BigInt(attitude), sigHash ]
        : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return (
    <Stack direction='column' sx={{m:1, p:1, justifyContent:'center'}} >

      <Stack direction={'row'} sx={{m:1, p:1, alignItems:'stretch'}}>

        <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
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
          error={ valid['SigHash']?.error }
          helperText={ valid['SigHash']?.helpTx }

          onChange={e => {
            let input = HexParser( e.target.value );
            onlyHex('SigHash', input, 64, setValid);
            setSigHash(input);
          }}
          value = { sigHash }
          size='small'
        />                                            

        <Button
          disabled={!castVote || castVoteLoading || hasError(valid)} 
          variant="contained"
          endIcon={<HowToVote />}
          sx={{ m:1, minWidth:218 }}
          onClick={()=>castVote?.()}
        >
          Cast Vote
        </Button>

      </Stack>

      {voteResult && boox && (
        <VoteResult addr={boox[booxMap.GMM]} seqOfMotion={seqOfMotion} />
      )}

    </Stack>
  )

}