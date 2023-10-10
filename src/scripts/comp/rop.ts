import { Bytes32Zero, HexType } from "../common";
import { readContract } from "@wagmi/core";
import { registerOfPledgesABI } from "../../generated";

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

export interface Body{
  paid: bigint;
  par: bigint;
  guaranteedAmt: bigint;
  preSeq: number;
  execDays: number;
  para: number;
  argu: number;
}

export const defaultBody: Body = {
  paid: BigInt('0'),
  par: BigInt('0'),
  guaranteedAmt: BigInt('0'),
  preSeq: 0,
  execDays: 0,
  para: 0,
  argu: 0,
}

export interface Pledge{
  head: Head;
  body: Body;
  hashLock: HexType;
}

export const defaultPledge: Pledge = {
  head: defaultHead,
  body: defaultBody,
  hashLock: Bytes32Zero,
}

export function parseSnOfPledge(sn:HexType): Head {

  let head: Head = {
    seqOfShare: parseInt(sn.substring(2, 10), 16),
    seqOfPld: parseInt(sn.substring(10,14), 16),
    createDate: parseInt(sn.substring(14, 26), 16),
    daysToMaturity: parseInt(sn.substring(26, 30), 16),
    guaranteeDays: parseInt(sn.substring(30, 34), 16),
    creditor: parseInt(sn.substring(34, 44), 16),
    debtor: parseInt(sn.substring(44, 54), 16),
    pledgor: parseInt(sn.substring(54, 64), 16),
    state: parseInt(sn.substring(64, 66), 16),
  }

  return head;
}

export function codifyHeadOfPledge(head: Head): HexType {
  let sn: HexType = `0x${
    head.seqOfShare.toString(16).padStart(8, '0') +
    head.seqOfPld.toString(16).padStart(4, '0') +
    head.createDate.toString(16).padStart(12, '0') +
    head.daysToMaturity.toString(16).padStart(4, '0') +
    head.guaranteeDays.toString(16).padStart(4, '0') +
    head.creditor.toString(16).padStart(10, '0') +
    head.debtor.toString(16).padStart(10, '0') +
    head.pledgor.toString(16).padStart(10, '0') +
    head.state.toString(16).padStart(2, '0')
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
  let pld = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'getPledge',
    args: [BigInt(seqOfShare), BigInt(seqOfPld)],
  });

  return pld;
}

export async function getPledgesOfShare(addr: HexType, seqOfShare:string):Promise<readonly Pledge[]>{
  let pld = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'getPledgesOfShare',
    args: [BigInt(seqOfShare)],
  });

  return pld;
}

export async function getAllPledges(addr: HexType):Promise<readonly Pledge[]>{
  let pld = await readContract({
    address: addr,
    abi: registerOfPledgesABI,
    functionName: 'getAllPledges',
  });

  return pld;
}


