import { readContract } from "@wagmi/core";
import { Bytes32Zero, HexType } from "../common";
import { investmentAgreementABI } from "../../generated";

export const TypeOfDeal = [
  'CapitalIncrease', 
  'ShareTransfer(External)', 
  'ShareTransfer(Internal)', 
  'PreEmptive', 
  'TagAlong', 
  'DragAlong', 
  'FirstRefusal', 
  'FreeGift'
];

export const TypeOfIa = [
  'NaN',
  'CapitalIncrease',
  'ShareTransfer(External)',
  'ShareTransfer(Internal)',
  'CI & STint',
  'SText & STint',
  'CI & SText & STint',
  'CI & SText'
]

export const StateOfDeal = [
  'Drafting',
  'Locked',
  'Cleared',
  'Closed',
  'Terminated'
];

export interface Head {
  typeOfDeal: number,
  seqOfDeal: number,
  preSeq: number,
  classOfShare: number,
  seqOfShare: number,
  seller: number,
  priceOfPaid: number,
  priceOfPar: number,
  closingDeadline: number,
  votingWeight: number,
}

export const defaultHead: Head = {
  typeOfDeal: 2,
  seqOfDeal: 0,
  preSeq: 0,
  classOfShare: 0,
  seqOfShare: 0,
  seller: 0,
  priceOfPaid: 100,
  priceOfPar: 100,
  closingDeadline: 0,
  votingWeight: 100,  
}

export interface Body {
  buyer: number,
  groupOfBuyer: number,
  paid: bigint,
  par: bigint,
  state: number,
  para: number,
  argu: number,
  flag: boolean,
}

export const defaultBody: Body = {
  buyer: 0,
  groupOfBuyer: 0,
  paid: BigInt(0),
  par: BigInt(0),
  state: 0,
  para: 0,
  argu: 0,
  flag: false,  
}

export const defaultDeal: Deal ={
  head: defaultHead,
  body: defaultBody,
  hashLock: Bytes32Zero,
}

export interface Deal {
  head: Head;
  body: Body;
  hashLock: HexType;
}

export async function getTypeOfIA(ia: HexType):Promise<number>{
  let typeOfIa = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getTypeOfIA',
  });

  return typeOfIa;
}

export async function getDeal(ia: HexType, seq:bigint):Promise<Deal>{
  let deal = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getDeal',
    args: [seq],
  });

  return deal;
}

export async function getSeqList(ia: HexType):Promise<readonly bigint[]>{
  let list = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getSeqList',
  });

  return list;
}

export async function checkValueOfSwap(ia: HexType, seqOfDeal: number, seqOfSwap: number): Promise<bigint> {
  let res = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'checkValueOfSwap',
    args: [BigInt(seqOfDeal), BigInt(seqOfSwap)],
  });

  return res;
}
