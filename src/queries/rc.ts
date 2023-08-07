import { readContract, getWalletClient, getContract, getPublicClient, waitForTransaction } from "@wagmi/core";
import { AddrOfRegCenter, AddrZero, Bytes32Zero, HexType, SelectorZero } from "../interfaces";
import { regCenterABI } from "../generated";
import { toAscii, toStr } from "../scripts/toolsKit";

// ==== Locker ====

export interface HeadOfLocker {
  from: number;
  to: number;
  expireDate: number;
  value: bigint;
}

export interface BodyOfLocker {
  counterLocker: HexType;
  selector: HexType;
  paras: string[];
}

export interface Locker {
  hashLock: HexType;
  head: HeadOfLocker;
  body: BodyOfLocker;
}

export function headOfLockerCodifier(head:HeadOfLocker):HexType {
  let sn:HexType = `0x${
    (head.from.toString(16).padStart(10, '0')) +
    (head.to.toString(16).padStart(10, '0')) +
    (head.expireDate.toString(16).padStart(12, '0')) +
    (head.value.toString(16).substring(2).padStart(32, '0'))
  }`;
  return sn;
}

export function headOfLockerParser(sn:HexType):HeadOfLocker {

  let head:HeadOfLocker = {
    from: parseInt(sn.substring(2, 12), 16),
    to: parseInt(sn.substring(12, 22), 16),
    expireDate: parseInt(sn.substring(22, 34), 16),
    value: BigInt(`0x${sn.substring(34, 66)}`),
  };

  return head;
}

export const defaultHeadOfLocker:HeadOfLocker = {
  from: 0,
  to: 0,
  expireDate: 0,
  value: BigInt('0'),
}

export const defaultBodyOfLocker:BodyOfLocker = {
  counterLocker: AddrZero,
  selector: SelectorZero,
  paras: [Bytes32Zero],
}

// ==== User ====

export interface Key {
  pubKey: HexType;
  refund: number;
  discount: number;
  gift: number;
  coupon: number;
}

export const defaultKey:Key = {
  pubKey: AddrZero,
  refund: 0,
  discount: 0,
  gift: 0,
  coupon: 0,
}

export interface User {
  isCOA: boolean;
  counterOfV: number;
  balance: bigint;
  primeKey: Key;
  backupKey: Key;
}

// ==== RegCenter ====

export interface Rule {
  eoaRewards: number;
  coaRewards: number;
  ceiling: number;
  floor: number;
  rate: number;
  para: number;
  argu: number;
  seq: number;
}

// ==== Doc ====

export interface HeadOfDoc {
  typeOfDoc: number;
  version: number;
  seqOfDoc: bigint;
  creator: number;
  createDate: number;
  para: number;
  argu: number;
  state: number;        
}

export interface Doc {
  head: HeadOfDoc;
  body: HexType;
}

export function codifyUserInfo(info: string):HexType {
  let sn = '0'.padStart(40, '0') + toAscii(info);

  let len = sn.length;

  if (len < 64) sn = sn.padEnd(64, '0');
  else sn = sn.substring(0, 64);

  let out: HexType = `0x${sn}`;

  return out;
}

export function parseUserInfo(info: Key): string {
  let out = '';
  out = toStr(info.refund) + toStr(info.discount) 
      + toStr(info.gift) + toStr(info.coupon);

  return out;
}

export function codifyRoyaltyRule(rule: Key):HexType {
  let out: HexType = `0x${
    '0'.padEnd(40, '0') +
    rule.refund.toString(16).padStart(4, '0') +
    rule.discount.toString(16).padStart(4, '0') +
    rule.gift.toString(16).padStart(8, '0') +
    rule.coupon.toString(16).padStart(8, '0')
  }`;

  return out;
}

// ==== Options ====

export async function getOwner(addr: HexType): Promise<HexType>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getOwner'
  });

  return res;
}

export async function getBookeeper(addr: HexType): Promise<HexType>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getBookeeper'
  });

  return res;
}

export async function getPlatformRule(): Promise<Rule>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getPlatformRule'
  });

  return res;
}

// ==== User ====

export async function isKey(key: HexType): Promise<boolean>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'isKey',
    args: [key],
  });

  return res;
}

export async function getUser(): Promise<User>{

  const walletClient = await getWalletClient();

  const rc = getContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    walletClient: walletClient ? walletClient : undefined,
  })

  let res = await rc.read.getUser();    

  return res;
}

export async function getMyUserNo(): Promise<number>{

  const walletClient = await getWalletClient();

  console.log('walletClient: ', walletClient?.getAddresses());

  const rc = getContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    walletClient: walletClient ? walletClient : undefined,
  })
  
  let res = await rc.read.getMyUserNo();    

  return res;
}

// ==== Docs ====

export async function counterOfVersions(addr: HexType, typeOfDoc: string): Promise<number>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'counterOfVersions',
    args: [BigInt(typeOfDoc)]
  });

  return res;
}

export async function counterOfDocs(addr: HexType, typeOfDoc: string, version: string): Promise<bigint>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'counterOfDocs',
    args: [BigInt(typeOfDoc), BigInt(version)]
  });

  return res;
}

// ==== SingleCheck ====

export async function getDoc(snOfDoc: HexType): Promise<Doc>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getDoc',
    args: [ snOfDoc ]
  });

  return res;
}

export async function getDocByUserNo(acct: string): Promise<Doc>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getDocByUserNo',
    args: [ BigInt(acct) ]
  });

  return res;
}

export async function verifyDoc(addr: HexType, snOfDoc: HexType): Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'verifyDoc',
    args: [ snOfDoc ]
  });

  return res;
}

export async function getDocAddr(hash: HexType): Promise<HexType> {
  const receipt = await waitForTransaction({
    hash: hash
  });

  let out: HexType;

  if (receipt)
      out = `0x${receipt?.logs[0]?.topics[2]?.substring(26)}`;
  else out = AddrZero;

  return out; 
}

export async function getDocsList(snOfDoc: HexType): Promise<readonly Doc[]>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getDocsList',
    args: [ snOfDoc ]
  });

  return res;
}

export async function getVersionsList(typeOfDoc: string): Promise<readonly Doc[]>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getVersionsList',
    args: [ BigInt(typeOfDoc) ]
  });

  return res;
}

export function parasParser(input: string):string[] {

  let len = parseInt(`${input.length / 64}`);
  let i = 0;
  let out:string[] = [];

  while (i < len) {
    out.push(input.slice(64*i, 64*(i+1)));
    i++;
  }
  return out;
}

export async function getLocker(addr: HexType, hashLock: HexType): Promise<Locker>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getLocker',
    args: [ hashLock ]
  });

  let locker:Locker = {
    hashLock: hashLock,
    head: res.head,
    body: 
      { 
        counterLocker: res.body.counterLocker,
        selector: `0x${res.body.payload.substring(2,10)}`,
        paras: parasParser(res.body.payload.substring(10)),
      }
  }

  return locker;
}
