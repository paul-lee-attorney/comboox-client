import { readContract } from "@wagmi/core";
import { Bytes32Zero, HexType } from "../../read";
import { registerOfPledgesABI } from "../../../../generated";

export interface StrHead {
  seqOfShare: string;
  seqOfPld: string;
  createDate: string;
  daysToMaturity: string;
  guaranteeDays: string;
  creditor: string;
  debtor: string;
  pledgor: string;
  state: string;
}

export interface Head {
  seqOfShare: number;
  seqOfPld: number;
  createDate: number;
  daysToMaturity: number;
  guaranteeDays: number;
  creditor: number;
  debtor: number;
  pledgor: number;
  state: number;
}

// export function parseOrgHead(head: OrgHead): Head {
//   let out:Head ={
//     seqOfShare: head.seqOfShare.toString(),
//     seqOfPld: head.seqOfPld.toString(),
//     createDate: head.createDate,
//     daysToMaturity: head.daysToMaturity.toString(),
//     guaranteeDays: head.guaranteeDays.toString(),
//     creditor: head.creditor.toString(),
//     debtor: head.debtor.toString(),
//     pledgor: head.pledgor.toString(),
//     state: head.state,
//   };
//   return out;
// }

export const defaultStrHead: StrHead = {
  seqOfShare: '0',
  seqOfPld: '0',
  createDate: '0',
  daysToMaturity: '0',
  guaranteeDays: '0',
  creditor: '0',
  debtor: '0',
  pledgor: '0',
  state: '0',
}

export const defaultHead: Head = {
  seqOfShare: 0,
  seqOfPld: 0,
  createDate: 0,
  daysToMaturity: 0,
  guaranteeDays: 0,
  creditor: 0,
  debtor: 0,
  pledgor: 0,
  state: 0,
}

export interface StrBody{
  paid: string;
  par: string;
  guaranteedAmt: string;
  preSeq: string;
  execDays: string;
  para: string;
  argu: string;
}

export interface Body{
  paid: bigint;
  par: bigint;
  guaranteedAmt: bigint;
  preSeq: number;
  execDays: number;
  para: number;
  argu: number;
}



// export function parseOrgBody(body: OrgBody): Body {
//   let out: Body = {
//     paid: body.paid.toString(),
//     par: body.par.toString(),
//     guaranteedAmt: body.guaranteedAmt.toString(),
//     preSeq: body.preSeq.toString(),
//     execDays: body.execDays.toString(),
//     para: body.para.toString(),
//     argu: body.argu.toString(),
//   };
//   return out;
// }

export const defaultStrBody: StrBody = {
  paid: '0',
  par: '0',
  guaranteedAmt: '0',
  preSeq: '0',
  execDays: '0',
  para: '0',
  argu: '0',
}

export const defaultBody: Body = {
  paid: 0n,
  par: 0n,
  guaranteedAmt: 0n,
  preSeq: 0,
  execDays: 0,
  para: 0,
  argu: 0,
}

export interface StrPledge{
  head: StrHead;
  body: StrBody;
  hashLock: HexType;
}

export interface Pledge{
  head: Head;
  body: Body;
  hashLock: HexType;
}


// export function parseOrgPledge(pld: OrgPledge): Pledge {
//   let out: Pledge = {
//     head: parseOrgHead(pld.head),
//     body: parseOrgBody(pld.body),
//     hashLock: pld.hashLock,
//   };

//   return out;
// }

export const defaultPledge: Pledge = {
  head: defaultHead,
  body: defaultBody,
  hashLock: Bytes32Zero,
}

// export function parseSnOfPledge(sn:HexType): Head {

//   let head: Head = {
//     seqOfShare: parseInt(sn.substring(2, 10), 16),
//     seqOfPld: parseInt(sn.substring(10,14), 16),
//     createDate: parseInt(sn.substring(14, 26), 16),
//     daysToMaturity: parseInt(sn.substring(26, 30), 16),
//     guaranteeDays: parseInt(sn.substring(30, 34), 16),
//     creditor: parseInt(sn.substring(34, 44), 16),
//     debtor: parseInt(sn.substring(44, 54), 16),
//     pledgor: parseInt(sn.substring(54, 64), 16),
//     state: parseInt(sn.substring(64, 66), 16),
//   }

//   return head;
// }

export function codifyHeadOfPledge(head: StrHead): HexType {
  let sn: HexType = `0x${
    Number(head.seqOfShare).toString(16).padStart(8, '0') +
    Number(head.seqOfPld).toString(16).padStart(4, '0') +
    Number(head.createDate).toString(16).padStart(12, '0') +
    Number(head.daysToMaturity).toString(16).padStart(4, '0') +
    Number(head.guaranteeDays).toString(16).padStart(4, '0') +
    Number(head.creditor).toString(16).padStart(10, '0') +
    Number(head.debtor).toString(16).padStart(10, '0') +
    Number(head.pledgor).toString(16).padStart(10, '0') +
    Number(head.state).toString(16).padStart(2, '0')
  }`;

  return sn;
}

// ==== Read Funcs ====

export async function counterOfPledges(addr: HexType, seqOfShare:string):Promise<number>{
  let res = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'counterOfPledges',
    args: [BigInt(seqOfShare)],
  });

  return res;
}

export async function isPledge(addr: HexType, seqOfShare:string, seqOfPld:string):Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'isPledge',
    args: [BigInt(seqOfShare), BigInt(seqOfPld)],
  });

  return res;
}

export async function getSNList(addr: HexType):Promise<readonly HexType[]>{
  let res = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'getSNList',
  });

  return res;
}

export async function getPledge(addr: HexType, seqOfShare:string, seqOfPld:string):Promise<Pledge>{
  let res = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'getPledge',
    args: [BigInt(seqOfShare), BigInt(seqOfPld)],
  });

  return res;
}

export async function getPledgesOfShare(addr: HexType, seqOfShare:string):Promise<readonly Pledge[]>{
  let res = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'getPledgesOfShare',
    args: [BigInt(seqOfShare)],
  });

  return res;
}

export async function getAllPledges(addr: HexType):Promise<readonly Pledge[]>{
  let res = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'getAllPledges',
  });

  return res;
}


