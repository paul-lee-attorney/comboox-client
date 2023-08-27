import { Box, Stack } from "@mui/material";

import { BallotsList } from "./BallotsList";
import { HexType } from "../../../interfaces";
import { VoteCase, defaultVoteCase } from "../../../queries/meetingMinutes";
import { useMeetingMinutes, useMeetingMinutesGetCaseOfAttitude } from "../../../generated";
import { useState } from "react";

interface VoteResultProps {
  addr: HexType;
  seqOfMotion: bigint;
  // voteResult: VoteCase[];
}

export function VoteResult({ addr, seqOfMotion }: VoteResultProps) {

  const [ voteResult, setVoteReselt ] = useState<VoteCase[]>([
      defaultVoteCase, 
      defaultVoteCase, 
      defaultVoteCase, 
      defaultVoteCase
  ]);

  useMeetingMinutesGetCaseOfAttitude({
    address: addr,
    args: [ seqOfMotion, BigInt(0) ],
    onSuccess(res) {
      setVoteReselt(v => {
        let out = [...v];
        out[0] = res;
        return out;
      })      
    }
  })

  useMeetingMinutesGetCaseOfAttitude({
    address: addr,
    args: [ seqOfMotion, BigInt(1) ],
    onSuccess(res) {
      setVoteReselt(v => {
        let out = [...v];
        out[1] = res;
        return out;
      })      
    }
  })

  useMeetingMinutesGetCaseOfAttitude({
    address: addr,
    args: [ seqOfMotion, BigInt(2) ],
    onSuccess(res) {
      setVoteReselt(v => {
        let out = [...v];
        out[2] = res;
        return out;
      })      
    }
  })

  useMeetingMinutesGetCaseOfAttitude({
    address: addr,
    args: [ seqOfMotion, BigInt(3) ],
    onSuccess(res) {
      setVoteReselt(v => {
        let out = [...v];
        out[3] = res;
        return out;
      })      
    }
  })

  return (
    // <Stack direction={'row'} sx={{ alignItems:'center', width:'100%' }}>

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