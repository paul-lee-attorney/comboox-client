import { readContract } from "@wagmi/core";
import { HexType } from "../common";
import { alongsABI } from "../../generated";
import { Deal } from "./ia";

export interface StrLinkRule{
  triggerDate: number;
  effectiveDays: string;
  triggerType: string;
  shareRatioThreshold: string;
  rate: string;
  proRata: boolean;
  seq: string;
  para: string;
  argu: string;
  ref: string;
  data: string;
}

export interface LinkRule{
  triggerDate: number;
  effectiveDays: number;
  triggerType: number;
  shareRatioThreshold: number;
  rate: number;
  proRata: boolean;
  seq: number;
  para: number;
  argu: number;
  ref: number;
  data: bigint;
}

export const defaultStrLinkRule: StrLinkRule = {
  triggerDate: 0,
  effectiveDays: '0',
  triggerType: '0',
  shareRatioThreshold: '0',
  rate: '0',
  proRata: false,
  seq: '0',
  para: '0',
  argu: '0',
  ref: '0',
  data: '0'
}


export const defaultLinkRule: LinkRule = {
  triggerDate: 0,
  effectiveDays: 0,
  triggerType: 0,
  shareRatioThreshold: 0,
  rate: 0,
  proRata: false,
  seq: 0,
  para: 0,
  argu: 0,
  ref: 0,
  data: 0n
}

export function linkRuleSnParser(sn: HexType): LinkRule {
  let out: LinkRule = {
    triggerDate: parseInt(sn.substring(2, 14), 16),
    effectiveDays: parseInt(sn.substring(14, 18), 16),
    triggerType: parseInt(sn.substring(18, 20), 16),
    shareRatioThreshold: parseInt(sn.substring(20, 24), 16),
    rate: parseInt(sn.substring(24, 32), 16),
    proRata: parseInt(sn.substring(32, 34), 16) == 1,
    seq: 0,
    para: 0,
    argu: 0,
    ref: 0,
    data: 0n
  }
  return out;
}

export function linkRuleCodifier(rule: StrLinkRule): HexType {
  let out: HexType = `0x${
    rule.triggerDate.toString(16).padStart(12, '0') +
    Number(rule.effectiveDays).toString(16).padStart(4, '0') +
    Number(rule.triggerType).toString(16).padStart(2, '0') +
    Number(rule.shareRatioThreshold).toString(16).padStart(4, '0') +
    Number(rule.rate).toString(16).padStart(8, '0') +
    (rule.proRata ? '01' : '00') +
    '0'.padEnd(32, '0')
  }`;
  return out;
}

export interface AlongLink {
  drager: string;
  linkRule: LinkRule;
  followers: string[];
}

export const defaultFollowers: string[] = [];

export const defaultLink: AlongLink ={
  drager: '0',
  linkRule: defaultLinkRule,
  followers: defaultFollowers,
} 

export const triggerTypes = [
  'NoCondition', 'CtrlChanged', 'CtrlChanged+Price', 'CtrlChanged+ROE'
]

// ==== Funcs ====

export async function isDragger(addr: HexType, dragger: number): Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: alongsABI,
    functionName: 'isDragger',
    args: [ BigInt(dragger)],
  })

  return res;
}

export async function getLinkRule(addr: HexType, dragger: string): Promise<LinkRule>{
  let res = await readContract({
    address: addr,
    abi: alongsABI,
    functionName: 'getLinkRule',
    args: [ BigInt(dragger)],
  })

  // let out: LinkRule = {
  //   triggerDate: res.triggerDate,
  //   effectiveDays: res.effectiveDays,
  //   triggerType: res.triggerType,
  //   shareRatioThreshold: res.shareRatioThreshold,
  //   rate: res.rate,
  //   proRata: res.proRata,
  //   seq: res.seq,
  //   para: res.para,
  //   argu: res.argu,
  //   ref: res.ref,
  //   data: res.data,   
  // }

  return res;
}

export async function isFollower(addr: HexType, dragger: number, follower: number): Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: alongsABI,
    functionName: 'isFollower',
    args: [ BigInt(dragger), BigInt(follower)],
  })

  return res;
}

export async function getDraggers(addr: HexType): Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: alongsABI,
    functionName: 'getDraggers',
  })

  return res;
}

export async function getFollowers(addr: HexType, dragger: string): Promise<readonly bigint[]>{
  let res = await readContract({
    address: addr,
    abi: alongsABI,
    functionName: 'getFollowers',
    args: [ BigInt(dragger)],
  })

  return res;
}

export async function priceCheck(addr: HexType, deal: Deal): Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: alongsABI,
    functionName: 'priceCheck',
    args: [ deal ],
  })

  return res;
}

export async function isTriggered(addr: HexType, ia: HexType, deal: Deal): Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: alongsABI,
    functionName: 'isTriggered',
    args: [ ia, deal ],
  })

  return res;
}

// ==== Special Funcs ====

export async function getLinks(addr: HexType): Promise<AlongLink[]> {

  let draggers = await getDraggers(addr);

  let len = draggers.length;
  let output: AlongLink[] = [];

  while (len > 0) {

    let drager = draggers[len - 1].toString();
    let linkRule = await getLinkRule(addr, drager);
    let followers = await getFollowers(addr, drager);
    
    let item: AlongLink = {
      drager: drager,
      linkRule: linkRule,
      followers: followers.map(v=>v.toString()),
    }

    output.push(item);

    len--;
  }

  return output;
}



