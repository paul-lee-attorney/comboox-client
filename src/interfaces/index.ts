
import { BigNumber } from "ethers";

export const AddrOfRegCenter:HexType = "0xA56F946D6398Dd7d9D4D9B337Cf9E0F68982ca5B";

export const DocTypeOfGeneralKeeper: number = 20;

export const Bytes32Zero:HexType = `0x${'0'.padEnd(64,'0')}`;

export const SeqZero:string = '0'.padEnd(4,'0');
export const AcctZero:string = '0'.padEnd(10,'0');
export const DateZero:string = '0'.padEnd(12,'0');
export const DataZero:string = '0'.padEnd(16,'0');

export const AddrZero:HexType = `0x${'0'.padEnd(40,'0')}`;

export type HexType = `0x${string}`;

export type ContractProps = {
  addr: HexType
}

export interface SigPageProps {
  addr: HexType,
  initPage: boolean,
}

export interface ShaRuleInputProps{
  sha: HexType,
  seqList: number[],
}

export interface FileHistoryProps {
  addr: HexType,
  setNextStep: (nextStep:number ) => void,
}



export interface VotingRuleType {
  seqOfRule: number;
  qtyOfSubRule: number;
  seqOfSubRule: number;
  authority: number;
  headRatio: number;
  amountRatio: number;
  onlyAttendance: boolean;
  impliedConsent: boolean;
  partyAsConsent: boolean;
  againstShallBuy: boolean;
  shaExecDays: number;
  reviewDays: number;
  reconsiderDays: number;
  votePrepareDays: number;
  votingDays: number;
  execDaysForPutOpt: number;
  vetoers1: number;
  vetoers2: number;
}

export interface FirstRefusalRuleType {
  seqOfRule: number;
  qtyOfSubRule: number;
  seqOfSubRule: number;
  typeOfDeal: number;
  membersEqual: boolean;
  proRata: boolean;
  basedOnPar: boolean;
  rightholder1: number;
  rightholder2: number;
  rightholder3: number;
  rightholder4: number;
}

export interface SetShaRuleProps {
  sha: HexType,
  qty: number,
  seq: number,
}


export type GKInfo = {
  sn?: string | undefined,
  creator?: string | undefined,
  addrOfGK?: HexType | undefined,
}

