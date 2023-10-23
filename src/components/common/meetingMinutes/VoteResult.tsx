
import { BallotsList } from "./BallotsList";
import { HexType } from "../../../scripts/common";
import { VoteCase, defaultVoteCase, getCaseOfAttitude, getVoteResult } from "../../../scripts/common/meetingMinutes";
import { useEffect, useState } from "react";

interface VoteResultProps {
  addr: HexType;
  seqOfMotion: bigint;
}

export function VoteResult({ addr, seqOfMotion }: VoteResultProps) {

  const [ voteResult, setVoteResult ] = useState<VoteCase[]>([
      defaultVoteCase, 
      defaultVoteCase, 
      defaultVoteCase, 
      defaultVoteCase
  ]);

  useEffect(()=>{
    getVoteResult(addr, seqOfMotion).then(
      res => setVoteResult(res)
    );
  })

  return (
    <table>
      <tr>
        <td>
          <BallotsList 
            addr={addr} 
            seqOfMotion={seqOfMotion}
            attitude={ 1 } 
            allVote={voteResult[0]} 
            voteCase={voteResult[1]} 
          />
        </td>
        <td>
          <BallotsList 
            addr={addr} 
            seqOfMotion={seqOfMotion}
            attitude ={ 3 } 
            allVote={voteResult[0]} 
            voteCase={voteResult[3]} 
          />
        </td>
        <td>
          <BallotsList 
            addr={addr} 
            seqOfMotion={seqOfMotion}
            attitude = { 2 } 
            allVote={voteResult[0]} 
            voteCase={voteResult[2]} 
          />
        </td>
      </tr>
    </table>
  )

}