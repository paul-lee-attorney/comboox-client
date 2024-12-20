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

// ==== Order ====

export interface Node {
  seq: number;
  prev: number;
  next: number;
  issuer: number;
  paid: bigint;
  price: number;
  expireDate: number;
  isOffer: boolean;
}

export const defaultNode: Node = {
  seq: 0,
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
  margin: bigint;
}

export const defaultData: Data = {
  classOfShare: 0,
  seqOfShare: 0,
  groupRep: 0,
  votingWeight: 0,
  distrWeight: 0,
  margin: 0n,
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
  seqOfDeal: number;
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
  seqOfDeal: 0,
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
    seqOfDeal: 0,
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

export async function counterOfOrders(addr: HexType, classOfShare:number, isOffer:boolean):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'counterOfOrders',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

export async function headOfList(addr: HexType, classOfShare:number, isOffer:boolean):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'headOfList',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

export async function tailOfList(addr: HexType, classOfShare:number, isOffer:boolean):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'tailOfList',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

export async function lengthOfList(addr: HexType, classOfShare:number, isOffer:boolean):Promise<bigint>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'lengthOfList',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

export async function getSeqList(addr: HexType, classOfShare:number, isOffer:boolean):Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getSeqList',
    args: [ BigInt(classOfShare), isOffer ]
  });

  return res;
}

// ==== Order ====


export async function isOrder(addr: HexType, classOfShare:number, seqOfOrder: number, isOffer:boolean):Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'isOrder',
    args: [ BigInt(classOfShare), BigInt(seqOfOrder), isOffer ]
  });

  return res;
}

export async function getOrder(addr: HexType, classOfShare:number, seqOfOrder: number, isOffer:boolean):Promise<Order>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getOrder',
    args: [ BigInt(classOfShare), BigInt(seqOfOrder), isOffer ]
  });
  
  let output: Order = {
    node: {
      seq: seqOfOrder,
      ...res.node,
    },
    data: {...res.data},
  };

  return output;
}

export async function getOrders(addr: HexType, classOfShare:number, isOffer:boolean):Promise<readonly Order[]>{
  let res = await readContract({
    address: addr,
    abi: listOfOrdersABI,
    functionName: 'getSeqList',
    args: [ BigInt(classOfShare), isOffer ],
  });

  let len = res.length;
  let output: Order[] = [];

  let i=0;
  while (i < len) {
    let order = await getOrder(addr, classOfShare, Number(res[i]), isOffer);
    output.push(order);
    i++;
  }
  
  return output;
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

