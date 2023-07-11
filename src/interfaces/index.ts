
import { BigNumber } from "ethers";

export const AddrOfRegCenter:HexType = "0xAA5c5496e2586F81d8d2d0B970eB85aB088639c2";

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
  isFinalized: boolean,
}

export interface SigPageProps {
  addr: HexType,
  initPage: boolean,
}

export interface ShaRuleInputProps{
  sha: HexType,
  seqList: number[],
  isFinalized: boolean,
}

export interface FileHistoryProps {
  addr: HexType,
  setNextStep: (nextStep:number ) => void,
}


export type GKInfo = {
  sn?: string | undefined,
  creator?: string | undefined,
  addrOfGK?: HexType | undefined,
}

