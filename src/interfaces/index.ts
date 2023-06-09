
import { BigNumber } from "ethers";

export const AddrOfRegCenter:HexType = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";

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

export interface ContractEditProps {
  addr: HexType,
  finalized: boolean,
}

export interface SigPageProps {
  addr: HexType,
  initPage: boolean,
}

export interface ShaRuleInputProps{
  sha: HexType,
  seqList: number[],
  finalized: boolean,
}

export interface FileHistoryProps {
  addr: HexType,
  setNextStep: (nextStep:number ) => void,
}


export interface FirstRefusalRuleType {
  subTitle: string,
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
  finalized: boolean,
}


export type GKInfo = {
  sn?: string | undefined,
  creator?: string | undefined,
  addrOfGK?: HexType | undefined,
}

