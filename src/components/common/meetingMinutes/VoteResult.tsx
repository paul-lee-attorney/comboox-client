import { Stack } from "@mui/material";

import { BallotsList } from "./BallotsList";
import { HexType } from "../../../interfaces";
import { VoteCase } from "../../../queries/meetingMinutes";

interface VoteResultProps {
  addr: HexType;
  seqOfMotion: BigInt;
  voteResult: VoteCase[];
}

export function VoteResult({ addr, seqOfMotion, voteResult }: VoteResultProps) {

  return (
    <Stack direction={'row'} sx={{m:1, p:1, alignItems:'center'}}>

          <BallotsList 
            addr={addr} 
            seqOfMotion={seqOfMotion}
            attitude={ 1 } 
            allVote={voteResult[0]} 
            voteCase={voteResult[1]} 
          />

          <BallotsList 
            addr={addr} 
            seqOfMotion={seqOfMotion}
            attitude ={ 3 } 
            allVote={voteResult[0]} 
            voteCase={voteResult[3]} 
          />

          <BallotsList 
            addr={addr} 
            seqOfMotion={seqOfMotion}
            attitude = { 2 } 
            allVote={voteResult[0]} 
            voteCase={voteResult[2]} 
          />
    </Stack>
  )

}