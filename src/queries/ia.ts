import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { investmentAgreementABI } from "../generated";

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
  para: number,
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

export interface Deal {
  head: Head,
  body: Body,
  hashLock: HexType,
}

export async function getTypeOfIA(ia: HexType):Promise<number>{
  let typeOfIa = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getTypeOfIA',
  });

  return typeOfIa;
}

export async function counterOfDeal(ia: HexType):Promise<number>{
  let counter = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'counterOfDeal',
  });

  return counter;
}

export async function counterOfClosedDeal(ia: HexType):Promise<number>{
  let counter = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'counterOfClosedDeal',
  });

  return counter;
}

export async function isDeal(ia: HexType, seq:number):Promise<boolean>{
  let flag = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'isDeal',
    args: [BigInt(seq)],
  });

  return flag;
}

export async function getHeadOfDeal(ia: HexType, seq:number):Promise<Head>{
  let head = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getHeadOfDeal',
    args: [BigInt(seq)],
  });

  return head;
}

export async function getBodyOfDeal(ia: HexType, seq:number):Promise<Body>{
  let body = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getBodyOfDeal',
    args: [BigInt(seq)],
  });

  return body;
}

export async function getHashLockOfDeal(ia: HexType, seq:number):Promise<HexType>{
  let lock = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getHashLockOfDeal',
    args: [BigInt(seq)],
  });

  return lock;
}

export async function getDeal(ia: HexType, seq:number):Promise<Deal>{
  let deal = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getDeal',
    args: [BigInt(seq)],
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

