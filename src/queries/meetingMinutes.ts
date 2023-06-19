import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { meetingMinutesABI } from "../generated";
import { BigNumber } from "ethers";
import { VotingRule } from "../components/comp/boh/rules/SetVotingRule";

export async function isProposed(minutes: HexType, seqOfMotion: BigNumber): Promise<boolean> {
  let flag: boolean = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'isProposed',
    args: [ seqOfMotion ],
  })

  return flag;
}

export async function voteStarted(minutes: HexType, seqOfMotion: BigNumber): Promise<boolean> {
  let flag: boolean = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'voteStarted',
    args: [ seqOfMotion ],
  })

  return flag;
}

export async function voteEnded(minutes: HexType, seqOfMotion: BigNumber): Promise<boolean> {
  let flag: boolean = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'voteEnded',
    args: [ seqOfMotion ],
  })

  return flag;
}

// ==== Delegate ====

export interface LeavesInfo {
  weight: BigNumber;
  emptyHead: number;
}

export interface Voter {
  delegate: number;
  weight: BigNumber;
  repWeight: BigNumber;
  repHead: number;
  principals: readonly number[];
}

export async function getVoterOfDelegateMap(minutes: HexType, seqOfMotion: BigNumber, acct: BigNumber): Promise<Voter> {

  let voter:Voter = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'getVoterOfDelegateMap',
    args: [ seqOfMotion, acct ],
  })

  return voter;
}

export async function getDelegateOf(minutes: HexType, seqOfMotion: BigNumber, acct: BigNumber): Promise<BigNumber> {
  
  let delegate:BigNumber = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'getDelegateOf',
    args: [ seqOfMotion, acct ],
  })

  return delegate;
}

export async function getLeavesWeightAtDate(minutes: HexType, seqOfMotion: BigNumber, acct: BigNumber, baseDate: BigNumber, rom: HexType): Promise<LeavesInfo> {

  let info:LeavesInfo = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'getLeavesWeightAtDate',
    args: [ seqOfMotion, acct, baseDate, rom ],
  })

  return info;
}

export async function getLeavesHeadcountOfDirectors(minutes: HexType, seqOfMotion: BigNumber, acct: BigNumber, bod: HexType): Promise<number> {

  let head:number = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'getLeavesHeadcountOfDirectors',
    args: [ seqOfMotion, acct, bod ],
  })

  return head;
}

// ==== Motion ====

export interface HeadOfMotion {
  typeOfMotion: number;
  seqOfMotion: BigNumber;
  seqOfVR: number;
  creator: number;
  executor: number;
  createDate: number;
  data: number;
}

export interface BodyOfMotion {
  proposer: number;
  proposeDate: number;
  shareRegDate: number;
  voteStartDate: number;
  voteEndDate: number;
  para: number;
  state: number;
}

export interface Motion {
  head: HeadOfMotion,
  body: BodyOfMotion,
  votingRule: VotingRule,
  contents: BigNumber,
}

export function motionSnParser(sn: HexType): HeadOfMotion {
  let head: HeadOfMotion = {
    typeOfMotion: parseInt(sn.substring(2, 6), 16),
    seqOfMotion: BigNumber.from(`0x${sn.substring(6, 22)}`),
    seqOfVR: parseInt(sn.substring(22, 26)),
    creator: parseInt(sn.substring(26, 36)),
    executor: parseInt(sn.substring(36, 46)),
    createDate: parseInt(sn.substring(46, 58)),
    data: parseInt(sn.substring(58, 66)),
  }
  return head;
}

export async function getMotion(bog: HexType, seq: BigNumber): Promise<Motion> {
  let motion:Motion = await readContract({
    address: bog,
    abi: meetingMinutesABI,
    functionName: 'getMotion',
    args: [seq],
  })

  return motion;
}

export async function getSeqList(minutes: HexType): Promise<readonly BigNumber[]> {
  let list: readonly BigNumber[] = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'getSeqList',
  })

  return list;  
}

export async function getMotionsList(minutes: HexType): Promise<Motion[]> {

  let seqList: readonly BigNumber[] = await getSeqList(minutes);

  let len = seqList.length;
  let ls: Motion[] = [];
  let i = len >= 100 ? len - 100 : 0;

  while( i < len ) {
    let motion = await getMotion(minutes, seqList[i]);
    ls.push(motion);
    i++;
  }

  return ls;
}

// ==== Voting ====

export interface VoteCase {
  sumOfHead: number;
  sumOfWeight: BigNumber;
  voters: readonly BigNumber[];
}

export async function isVoted(minutes: HexType, seqOfMotion: BigNumber, acct: BigNumber): Promise<boolean> {
  let flag:boolean = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'isVoted',
    args: [ seqOfMotion, acct ],
  })

  return flag;
}

export async function isVotedFor(minutes: HexType, seqOfMotion: BigNumber, acct: BigNumber, atti: BigNumber): Promise<boolean> {

  let flag:boolean = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'isVotedFor',
    args: [ seqOfMotion, acct, atti ],
  })

  return flag;
}

export async function getCaseOfAttitude(minutes: HexType, seqOfMotion: BigNumber, atti: BigNumber): Promise<VoteCase> {
  let voteCase: VoteCase = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'getCaseOfAttitude',
    args: [ seqOfMotion, atti ],
  });

  return voteCase;
}

export async function getVoteResult(minutes: HexType, seqOfMotion: BigNumber): Promise<VoteCase[]>{

  let i = 0;
  let list: VoteCase[] = [];

  while (i < 4) {
    let item = await getCaseOfAttitude(minutes, seqOfMotion, BigNumber.from(i));
    list.push(item);    
    i++;
  }

  return list;
}

// ==== Ballot ====

export interface Ballot {
  acct: number;
  attitude: number;
  head: number;
  weight: BigNumber;
  sigDate: number;
  blocknumber: BigNumber;
  sigHash: HexType;
}

export async function getBallot(minutes:HexType, seqOfMotion: BigNumber, acct: BigNumber): Promise<Ballot> {
  let ballot:Ballot = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'getBallot',
    args: [ seqOfMotion, acct ],
  });

  return ballot;
}

export async function getBallotsList(minutes: HexType, seqOfMotion: BigNumber, voters: readonly BigNumber[]): Promise<Ballot[]> {
  let list: Ballot[] = [];

  let len = voters.length;
  let i=0;

  while (i < len) {
    let ballot = await getBallot(minutes, seqOfMotion, voters[i]);
    list.push(ballot);
    i++;
  }

  return list;
}

export async function isPassed(minutes: HexType, seqOfMotion: BigNumber): Promise<boolean> {
  let flag = await readContract({
    address: minutes,
    abi: meetingMinutesABI,
    functionName: 'isPassed',
    args: [ seqOfMotion ],
  })

  return flag;
}





