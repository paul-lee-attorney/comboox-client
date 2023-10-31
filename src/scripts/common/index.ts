import Smart from "./contracts-address.json";
// import Smart from "../../../../comboox/server/src/contracts/contracts-address.json";

export const AddrOfRegCenter:HexType = process.env.NODE_ENV == 'test'
                                    ? `0x${'AA2997e98504048492046a4D2946CbD9477Fe4E8'}`
                                    : `0x${Smart.RegCenter.substring(2)}`;

export const Bytes32Zero:HexType = `0x${'0'.padEnd(64,'0')}`;
export const AddrZero:HexType = `0x${'0'.padEnd(40,'0')}`;
export const SelectorZero:HexType = `0x${'0'.padStart(8,'0')}`;

export const SeqZero:string = '0'.padEnd(4,'0');
export const AcctZero:string = '0'.padEnd(10,'0');
export const DateZero:string = '0'.padEnd(12,'0');
export const DataZero:string = '0'.padEnd(16,'0');

export const MaxLockValue: bigint = 2n**128n-1n;
export const MaxData: bigint = 2n**64n-1n;
export const MaxPrice: bigint = 2n**32n-1n;
export const MaxUserNo: bigint = 2n**40n-1n;
export const MaxSeqNo: bigint = 2n**16n-1n;
export const MaxRatio: bigint = 10000n;
export const MaxByte: bigint = 255n;

export type HexType = `0x${string}`;

interface BooxMap {
  ROC: number;
  ROD: number;
  BMM: number;
  ROM: number;
  GMM: number;
  ROA: number;
  ROO: number;
  ROP: number;
  ROS: number;
  LOO: number;
}

export const booxMap:BooxMap = {
  ROC: 1,
  ROD: 2,
  BMM: 3,
  ROM: 4,
  GMM: 5, 
  ROA: 6,
  ROO: 7,
  ROP: 8,
  ROS: 9,
  LOO: 10,
}


