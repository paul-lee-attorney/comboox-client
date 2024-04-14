import { readContract } from "@wagmi/core";
import { listOfOrdersABI } from "../../../../../generated";
import { HexType } from "../../common";


export const statesOfInvestor = [
  'Pending',
  'Approved',
  'Revoked'
]

export const statesOfOrder = [
  'Active',
  'Closed',
  'Terminated'
]

export interface InitOffer{
  seqOfOrder: string;
  classOfShare: string;
  seqOfShare: string;
  execHours: string;
  paid: string;
  price: string;
  seqOfLR: string;
}

export const defaultOffer: InitOffer = {
  seqOfOrder: '0',
  classOfShare: '0',
  seqOfShare: '0',
  execHours: '0',
  paid: '0',
  price: '0',
  seqOfLR: '1024',
}

export interface Order {
  prev: number;
  next: number;
  seqOfShare: number;
  paid: bigint;
  price: number;
  expireDate: number;
  votingWeight: number;
  distrWeight: number;
}

export interface OrderWrap {
  seq: number;
  node: Order;
}

export const defaultOrder: Order = {
  prev: 0,
  next: 0,
  seqOfShare: 0,
  paid: 0n,
  price: 0,
  expireDate: 0,
  votingWeight: 100,
  distrWeight: 100,
}

export const defaultOrderWrap: OrderWrap = {
  seq: 0,
  node: defaultOrder,
}

export interface Investor {
  userNo: number;
  groupRep: number;
  regDate: number;
  verifier: number;
  approveDate: number;
  state: number;
  idHash: HexType;
}

export interface Deal {
  classOfShare: number;
  seqOfShare: number;
  buyer: number;
  groupRep: number;
  paid: bigint;
  price: number;
  votingWeight: number;
  distrWeight: number;
}

export const defaultDeal: Deal = {
  classOfShare: 0,
  seqOfShare: 0,
  buyer: 0,
  groupRep: 0,
  paid: 0n,
  price: 0,
  votingWeight: 0,
  distrWeight: 0,
}

export async function isInvestor(addr: HexType,  userNo: number):Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'isInvestor',
    args: [ BigInt(userNo) ]
  });

  return res;
}

export async function getInvestor(addr: HexType,  userNo: number):Promise<Investor>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getInvestor',
    args: [ BigInt(userNo) ]
  });

  return res;
}

export async function getQtyOfInvestors(addr: HexType):Promise<bigint>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getQtyOfInvestors',
  });

  return res;
}

export async function investorList(addr: HexType):Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'investorList',
  });

  return res;
}

export async function investorInfoList(addr: HexType):Promise<readonly Investor[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'investorInfoList',
  });

  return res;
}

// ==== Deals ====

export async function counterOfOffers(addr: HexType, classOfShare:number):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'counterOfOffers',
    args: [ BigInt(classOfShare) ]
  });

  return res;
}

export async function headOfList(addr: HexType, classOfShare:number):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'headOfList',
    args: [ BigInt(classOfShare) ]
  });

  return res;
}

export async function tailOfList(addr: HexType, classOfShare:number):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'tailOfList',
    args: [ BigInt(classOfShare) ]
  });

  return res;
}

export async function lengthOfList(addr: HexType, classOfShare:number):Promise<bigint>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'lengthOfList',
    args: [ BigInt(classOfShare) ]
  });

  return res;
}

export async function getSeqList(addr: HexType, classOfShare:number):Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getSeqList',
    args: [ BigInt(classOfShare) ]
  });

  return res;
}

export async function getChain(addr: HexType, classOfShare:number):Promise<readonly OrderWrap[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getChain',
    args: [ BigInt(classOfShare) ]
  });

  return res;
}

// ==== Order ====


export async function isOrder(addr: HexType, classOfShare:number, seqOfOrder: number):Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'isOrder',
    args: [ BigInt(classOfShare), BigInt(seqOfOrder) ]
  });

  return res;
}

export async function getOrder(addr: HexType, classOfShare:number, seqOfOrder: number):Promise<Order>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getOrder',
    args: [ BigInt(classOfShare), BigInt(seqOfOrder) ]
  });

  return res;
}

export async function isClass(addr: HexType, classOfShare:number):Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'isClass',
    args: [ BigInt(classOfShare) ]
  });

  return res;
}

export async function getClassesList(addr: HexType):Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getClassesList',
  });

  return res;
}



