export const AddrOfRegCenter:`0x${string}` = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";

export const DocTypeOfGeneralKeeper: number = 20;

export const Bytes32Zero:string = '0'.padEnd(64,'0');

export const SeqZero:string = '0'.padEnd(4,'0');
export const AcctZero:string = '0'.padEnd(10,'0');
export const DateZero:string = '0'.padEnd(12,'0');
export const DataZero:string = '0'.padEnd(16,'0');
export const AddrZero:`0x${string}` = `0x${'0'.padEnd(40,'0')}`;

export type ContractProps = {
  addr: `0x${string}`
}
