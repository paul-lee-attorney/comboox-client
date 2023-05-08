
export const AddrOfRegCenter:HexType = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";

export const DocTypeOfGeneralKeeper: number = 20;

export const Bytes32Zero:string = '0'.padEnd(64,'0');

export const SeqZero:string = '0'.padEnd(4,'0');
export const AcctZero:string = '0'.padEnd(10,'0');
export const DateZero:string = '0'.padEnd(12,'0');
export const DataZero:string = '0'.padEnd(16,'0');

export const AddrZero:HexType = `0x${'0'.padEnd(40,'0')}`;

export type HexType = `0x${string}`;

export type ContractProps = {
  addr?: HexType | undefined
}

export type GKInfo = {
  sn?: string | undefined,
  creator?: string | undefined,
  addrOfGK?: HexType | undefined,
}

