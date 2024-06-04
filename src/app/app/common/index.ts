// import * as scReg from "../../../../../comboox/server/src/contracts/contracts-address.json";

// export const AddrOfRegCenter:HexType = `0x${scReg.RegCenter.substring(2)}`;
// export const AddrOfTank:HexType = `0x${scReg.FuelTank.substring(2)}`;
// export const AddrOfCNC:HexType = `0x${scReg.CreateNewComp.substring(2)}`;

// export const AddrOfRegCenter:HexType = `0x${'c5a5C42992dECbae36851359345FE25997F5C42d'}`;
// export const AddrOfTank:HexType = `0x${'FD471836031dc5108809D173A067e8486B9047A3'}`;
// export const AddrOfCNC:HexType = `0x${'67d269191c92Caf3cD7723F116c85e6E9bf55933'}`;

export const AddrOfRegCenter:HexType = `0x${process.env.NEXT_PUBLIC_RC_ADDR?.substring(2) ?? '0'}`;
export const AddrOfTank:HexType = `0x${process.env.NEXT_PUBLIC_FT_ADDR?.substring(2) ?? '0'}`;
export const AddrOfCNC:HexType = `0x${process.env.NEXT_PUBLIC_CNC_ADDR?.substring(2) ?? '0'}`;

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

export const currencies:string[] = [
  'USD', 'GBP', 'EUR', 'JPY', 'KRW', 'CNY',
  'AUD', 'CAD', 'CHF', 'ARS', 'PHP', 'NZD', 
  'SGD', 'NGN', 'ZAR', 'RUB', 'INR', 'BRL'
]
