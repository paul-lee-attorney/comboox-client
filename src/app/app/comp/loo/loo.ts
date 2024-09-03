import { readContract } from "@wagmi/core";
import { listOfOrders_2ABI } from "../../../../../generated";
import { HexType } from "../../common";
import { GetLogsReturnType } from "viem";


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

// ==== Order ====

export interface Node {
  prev: number;
  next: number;
  issuer: number;
  paid: bigint;
  price: number;
  expireDate: number;
  isOffer: boolean;
}

export const defaultNode: Node = {
  prev: 0,
  next: 0,
  issuer: 0,
  paid: 0n,
  price: 0,
  expireDate: 0,
  isOffer: false  
}

export interface Data {
  classOfShare: number;
  seqOfShare: number;
  groupRep: number;
  votingWeight: number;
  distrWeight: number;
  centPriceInWei: bigint;
  buyer: number;
  seq: number;
}

export const defaultData: Data = {
  classOfShare: 0,
  seqOfShare: 0,
  groupRep: 0,
  votingWeight: 0,
  distrWeight: 0,
  centPriceInWei: 0n,
  buyer: 0,
  seq: 0,
}

export interface Order {
  node: Node;
  data: Data;
}

export const defaultOrder: Order = {
  node: defaultNode,
  data: defaultData
}

// ==== Investor ====

export interface Investor {
  userNo: number;
  groupRep: number;
  regDate: number;
  verifier: number;
  approveDate: number;
  state: number;
  idHash: HexType;
}

// ==== Deal ====
export interface Deal {
  classOfShare: string;
  seqOfShare: string;
  buyer: string;
  groupRep: string;
  paid: bigint;
  price: bigint;
  votingWeight: string;
  distrWeight: string;
  consideration: bigint;
}

export const defaultDeal: Deal = {
  classOfShare: '0',
  seqOfShare: '0',
  buyer: '0',
  groupRep: '0',
  paid: 0n,
  price: 0n,
  votingWeight: '0',
  distrWeight: '0',
  consideration: 0n
}

export function dealParser(hexDeal: HexType):Deal {
  let deal: Deal = {
    classOfShare: parseInt(hexDeal.substring(2, 6), 16).toString(),
    seqOfShare: parseInt(hexDeal.substring(6, 14), 16).toString(),
    buyer: parseInt(hexDeal.substring(14, 24), 16).toString(),
    groupRep: parseInt(hexDeal.substring(24, 34), 16).toString(),
    paid: BigInt(`0x${hexDeal.substring(34, 50)}`),
    price: BigInt(`0x${hexDeal.substring(50, 58)}`),
    votingWeight: parseInt(hexDeal.substring(58, 62), 16).toString(),
    distrWeight: parseInt(hexDeal.substring(62, 66), 16).toString(),
    consideration: 0n,
  }
  return deal;
}

// ==== DealProps ====

export interface DealProps extends Deal {
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
}


// ==== Funcs   ====

export async function isInvestor(addr: HexType,  userNo: number):Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'isInvestor',
    args: [ BigInt(userNo) ]
  });

  return res;
}

export async function getInvestor(addr: HexType,  userNo: number):Promise<Investor>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'getInvestor',
    args: [ BigInt(userNo) ]
  });

  return res;
}

export async function getQtyOfInvestors(addr: HexType):Promise<bigint>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'getQtyOfInvestors',
  });

  return res;
}

export async function investorList(addr: HexType):Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'investorList',
  });

  return res;
}

export async function investorInfoList(addr: HexType):Promise<readonly Investor[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'investorInfoList',
  });

  return res;
}

// ==== Deals ====

export async function counterOfOrders(addr: HexType, classOfShare:number, isOffer:boolean):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'counterOfOrders',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

export async function headOfList(addr: HexType, classOfShare:number, isOffer:boolean):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'headOfList',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

export async function tailOfList(addr: HexType, classOfShare:number, isOffer:boolean):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'tailOfList',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

export async function lengthOfList(addr: HexType, classOfShare:number, isOffer:boolean):Promise<bigint>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'lengthOfList',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

export async function getSeqList(addr: HexType, classOfShare:number, isOffer:boolean):Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'getSeqList',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

// ==== Order ====


export async function isOrder(addr: HexType, classOfShare:number, seqOfOrder: number, isOffer:boolean):Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'isOrder',
    args: [ BigInt(classOfShare), BigInt(seqOfOrder), isOffer ]
  });

  return res;
}

export async function getOrder(addr: HexType, classOfShare:number, seqOfOrder: number, isOffer:boolean):Promise<Order>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'getOrder',
    args: [ BigInt(classOfShare), BigInt(seqOfOrder), isOffer ]
  });

  return res;
}

export async function getOrders(addr: HexType, classOfShare:number, isOffer:boolean):Promise<readonly Order[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'getOrders',
    args: [ BigInt(classOfShare), isOffer ],
  });

  return res;
}

export async function isClass(addr: HexType, classOfShare:number):Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'isClass',
    args: [ BigInt(classOfShare) ]
  });

  return res;
}

export async function getClassesList(addr: HexType):Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrders_2ABI,
    functionName: 'getClassesList',
  });

  return res;
}

