import { BigNumber } from "ethers";
import { Bytes32Zero, HexType } from "../interfaces";
import { readContract } from "@wagmi/core";
import { bookOfPledgesABI } from "../generated";



export interface Head {
  seqOfShare: number;
  seqOfPld: number;
  createDate: number;
  triggerDate: number;
  pledgor: number;
  debtor: number;
  data: number;
}

export const defaultHead: Head = {
  seqOfShare: 0,
  seqOfPld: 0,
  createDate: 0,
  triggerDate: 0,
  pledgor: 0,
  debtor: 0,
  data: 0,
}

export interface Body{
  creditor: number;
  guaranteeDays: number;
  paid: BigNumber;
  par: BigNumber;
  guaranteedAmt: BigNumber;
  state: number;
}

export const defaultBody: Body = {
  creditor: 0,
  guaranteeDays: 0,
  paid: BigNumber.from('0'),
  par: BigNumber.from('0'),
  guaranteedAmt: BigNumber.from('0'),
  state: 0,
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
    triggerDate: parseInt(sn.substring(26, 38), 16),
    pledgor: parseInt(sn.substring(38, 48), 16),
    debtor: parseInt(sn.substring(48, 58), 16),
    data: parseInt(sn.substring(58, 66), 16),
  }

  return head;
}

export function codifyHeadOfPledge(head: Head): HexType {
  let sn: HexType = `0x${
    head.seqOfShare.toString(16).padStart(8, '0') +
    head.seqOfPld.toString(16).padStart(4, '0') +
    head.createDate.toString(16).padStart(12, '0') +
    head.triggerDate.toString(16).padStart(12, '0') +
    head.pledgor.toString(16).padStart(10, '0') +
    head.debtor.toString(16).padStart(10, '0') +
    head.data.toString(16).padStart(8, '0')
  }`;

  return sn;
}

export async function getPledge(addr: HexType, seqOfShare:string, seqOfPld:string):Promise<Pledge>{
  let pld = await readContract({
    address: addr,
    abi: bookOfPledgesABI,
    functionName: 'getPledge',
    args: [BigNumber.from(seqOfShare), BigNumber.from(seqOfPld)],
  });

  return pld;
}

