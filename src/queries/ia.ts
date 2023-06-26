import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { investmentAgreementABI } from "../generated";
import { BigNumber } from "ethers";

export interface Head {
  typeOfDeal: number,
  seqOfDeal: number,
  preSeq: number,
  classOfShare: number,
  seqOfShare: number,
  seller: number,
  priceOfPaid: number,
  priceOfPar: number,
  closingDate: number,
  para: number,
}

export interface Body {
  buyer: number,
  groupOfBuyer: number,
  paid: BigNumber,
  par: BigNumber,
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
    args: [BigNumber.from(seq)],
  });

  return flag;
}

export async function getHeadOfDeal(ia: HexType, seq:number):Promise<Head>{
  let head = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getHeadOfDeal',
    args: [BigNumber.from(seq)],
  });

  return head;
}

export async function getBodyOfDeal(ia: HexType, seq:number):Promise<Body>{
  let body = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getBodyOfDeal',
    args: [BigNumber.from(seq)],
  });

  return body;
}

export async function getHashLockOfDeal(ia: HexType, seq:number):Promise<HexType>{
  let lock = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getHashLockOfDeal',
    args: [BigNumber.from(seq)],
  });

  return lock;
}

export async function getDeal(ia: HexType, seq:number):Promise<Deal>{
  let deal = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getDeal',
    args: [BigNumber.from(seq)],
  });

  return deal;
}

export async function getSeqList(ia: HexType):Promise<readonly BigNumber[]>{
  let list = await readContract({
    address: ia,
    abi: investmentAgreementABI,
    functionName: 'getSeqList',
  });

  return list;
}

