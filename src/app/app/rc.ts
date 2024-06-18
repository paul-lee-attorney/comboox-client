import { 
  readContract, getWalletClient, getContract, 
  waitForTransaction, fetchBalance, 
  watchContractEvent,
  getConfig,
  getPublicClient
} from "@wagmi/core";

import { AddrOfRegCenter, AddrZero, Bytes32Zero, HexType, SelectorZero } from "./common";
import { meetingMinutesABI, regCenterABI } from "../../../generated";
import { strNumToBigInt } from "./common/toolsKit";

import { publicClient } from "../_providers/WagmiProvider";
import { BlockList } from "net";

// ==== StrLocker === 

export interface StrHeadOfLocker {
  from: string;
  to: string;
  expireDate: number;
  value: string;
}

export interface HeadOfLocker {
  from: number;
  to: number;
  expireDate: number;
  value: bigint;
}

export const defaultStrHeadOfLocker:StrHeadOfLocker = {
  from: '0',
  to: '0',
  expireDate: 0,
  value: '0',
}

export interface BodyOfLocker {
  counterLocker: HexType;
  selector: HexType;
  paras: string[];
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

export const defaultLocker: Locker = {
  hashLock: Bytes32Zero,
  head: defaultHeadOfLocker,
  body: defaultBodyOfLocker,
}

export const defaultStrLocker: StrLocker = {
  hashLock: Bytes32Zero,
  head: defaultStrHeadOfLocker,
  body: defaultBodyOfLocker,
}

export interface StrLocker {
  hashLock: HexType;
  head: StrHeadOfLocker;
  body: BodyOfLocker;  
}

export interface Locker {
  hashLock: HexType;
  head: HeadOfLocker;
  body: BodyOfLocker;
}


export interface BodyOfOrgLocker {
  counterLocker: HexType;
  payload: HexType;
}
export interface OrgLocker {
  head: HeadOfLocker;
  body: BodyOfOrgLocker;
}


// ==== Locker ====

// ==== User ====

export interface StrKey {
  pubKey: HexType;
  discount: string;
  gift: string;
  coupon: string;
}

export const defaultStrKey:StrKey = {
  pubKey: AddrZero,
  discount: '0',
  gift: '0',
  coupon: '0',
}

export function codifyStrRoyaltyRule(rule: StrKey):HexType {
  let out: HexType = `0x${
    '0'.padEnd(40, '0') +
    strNumToBigInt(rule.discount, 2).toString(16).padStart(4, '0') +
    Number(rule.gift).toString(16).padStart(10, '0') +
    Number(rule.coupon).toString(16).padStart(10, '0')
  }`;

  return out;
}

// ==== Key ====
export interface Key {
  pubKey: HexType;
  discount: number;
  gift: number;
  coupon: number;
}

export const defaultKey:Key = {
  pubKey: AddrZero,
  discount: 0,
  gift: 0,
  coupon: 0,
}

export function codifyRoyaltyRule(rule: Key):HexType {
  let out: HexType = `0x${
    '0'.padEnd(40, '0') +
    rule.discount.toString(16).padStart(4, '0') +
    rule.gift.toString(16).padStart(10, '0') +
    rule.coupon.toString(16).padStart(10, '0')
  }`;

  return out;
}

export interface User {
  primeKey: Key;
  backupKey: Key;
}

// ==== RegCenter ====

export interface StrRule {
  eoaRewards: string;
  coaRewards: string;
  floor: string;
  rate: string;
  para: string;
}

export const defaultStrRule: StrRule = {
  eoaRewards: '0',
  coaRewards: '0',
  floor: '0',
  rate: '0',
  para: '0',
}

export function codifyPlatformStrRule(rule: StrRule):HexType {
  let out: HexType = `0x${
    strNumToBigInt(rule.eoaRewards, 9).toString(16).padStart(10,'0') +
    strNumToBigInt(rule.coaRewards, 9).toString(16).padStart(10, '0') +
    strNumToBigInt(rule.floor, 9).toString(16).padStart(10, '0') +
    (Number(rule.rate) * 100 ).toString(16).padStart(4, '0') +
    Number(rule.para).toString(16).padStart(4, '0') +
    '0'.padEnd(26, '0')
  }`;

  return out;
}

export interface Rule {
  eoaRewards: number;
  coaRewards: number;
  floor: number;
  rate: number;
  para: number;
}

export const defaultRule: Rule = {
  eoaRewards: 0,
  coaRewards: 0,
  floor: 0,
  rate: 0,
  para: 0,
}

export function codifyPlatformRule(rule: Rule):HexType {

  console.log("Rule: ", rule );

  let out: HexType = `0x${
    (Number(rule.eoaRewards) * (10 ** 9)).toString(16).padStart(10, '0') +
    (Number(rule.coaRewards) * (10 ** 9)).toString(16).padStart(10, '0') +
    (Number(rule.floor) * (10 ** 9)).toString(16).padStart(10, '0') +
    (Number(rule.rate) * 100).toString(16).padStart(4, '0') +
    rule.para.toString(16).padStart(4, '0') +
    '0'.padEnd(26, '0')
  }`;

  return out;
}


// ==== Doc ====

export interface HeadOfDoc {
  typeOfDoc: number;
  version: number;
  seqOfDoc: bigint;
  author: number;
  creator: number;
  createDate: number;
}

export interface Doc {
  head: HeadOfDoc;
  body: HexType;
}

export const typesOfDoc:string[] = [
  'ROCKeeper', 'RODKeeper', 'BMMKeeper', 'ROMKeeper', 'GMMKeeper', 'ROAKeeper',
  'ROOKeeper', 'ROPKeeper', 'SHAKeeper', 'LOOKeeper', 'ROC', 'ROD', 
  'MM', 'ROM', 'ROA', 'ROO', 'ROP', 'ROS', 'LOO', 'GK', 'IA', 'SHA',
  'AntiDilution', 'LockUp', 'Alongs', 'Options', 'LOP'
]

// ==== Options ====

export async function getOwner(): Promise<HexType>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getOwner'
  });

  return res;
}

export async function getBookeeper(): Promise<HexType>{
  let res = await readContract({
    address: AddrOfRegCenter,
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

export async function getPriceFeed(seq: bigint): Promise<HexType>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    args: [ seq ],
    functionName: 'getPriceFeed'
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

export async function getCounterOfUsers(): Promise<number>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'counterOfUsers'
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

export async function getMyUserNo(acct: HexType): Promise<number>{

  const res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getMyUserNo',
    account: acct
  })

  return res;
}


export async function getRoyaltyRule(author: bigint): Promise<Key>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getRoyaltyRule',
    args: [author]
  });

  return res;
}

// ==== Docs ====

export async function counterOfTypes(): Promise<number>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'counterOfTypes',
  });

  return res;
}

export async function counterOfVersions(addr: HexType, typeOfDoc: bigint): Promise<number>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'counterOfVersions',
    args: [ typeOfDoc ]
  });

  return res;
}

export async function counterOfDocs(addr: HexType, typeOfDoc: bigint, version: bigint): Promise<bigint>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'counterOfDocs',
    args: [ typeOfDoc, version ]
  });

  return res;
}

export async function docExist(body: HexType): Promise<boolean>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'docExist',
    args: [body]
  });

  return res;
}

export async function getAuthor(type:bigint, version: bigint): Promise<number>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getAuthor',
    args: [type, version]
  });

  return res;
}

export async function getAuthorByBody(body: HexType): Promise<number>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getAuthorByBody',
    args: [body]
  });

  return res;
}

export async function getHeadByBody(body: HexType): Promise<HeadOfDoc>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getHeadByBody',
    args: [body]
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

export async function getDocByUserNo(acct: bigint): Promise<Doc>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getDocByUserNo',
    args: [ acct ]
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

export async function getVersionsList(typeOfDoc:bigint): Promise<readonly Doc[]>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getVersionsList',
    args: [ typeOfDoc ]
  });

  return res;
}

export async function getTempsList(): Promise<Doc[]>{

  let out: Doc[] = [];
  let i = 1;

  while (i < 28) {
    let ls: readonly Doc[] = await getVersionsList(BigInt(i));
    out = out.concat(ls);
    i++;
  }

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

export function parseOrgLocker(hashLock: HexType, input: OrgLocker): StrLocker {

  let lk: StrLocker = {
    hashLock: hashLock,
    head: {
      from: input.head.from.toString(),
      to: input.head.to.toString(),
      expireDate: input.head.expireDate,
      value: input.head.value.toString(),
    },
    body: 
      { 
        counterLocker: input.body.counterLocker,
        selector: `0x${input.body.payload.substring(2,10)}`,
        paras: parasParser(input.body.payload.substring(10)),
      }
  };

  return lk;
}

export async function getLocker(hashLock: HexType): Promise<StrLocker>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getLocker',
    args: [ hashLock ]
  });

  return parseOrgLocker( hashLock, res);
}

export async function getLocksList(): Promise<readonly HexType[]>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getLocksList'
  });

  return res;
}

// ==== CBP ====

export async function name(): Promise<string>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'name'
  });

  return res;
}

export async function symbol(): Promise<string>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'symbol'
  });

  return res;
}

export async function getTotalSupply(): Promise<bigint>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'totalSupply'
  });

  return res;
}

export async function balanceOf(acct:HexType, blk:bigint|undefined): Promise<bigint>{
  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'balanceOf',
    blockNumber: blk,
    args: [ acct ]
  });

  return res;
}

export async function balanceOfWei(addr: HexType):Promise<bigint>{
  let res = await fetchBalance({
    address: addr,
    formatUnits: 'wei'
  })

  return res.value;
}

export async function getCentPriceInWei(curr:number): Promise<bigint>{

  let res = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getCentPriceInWei',
    args: [ BigInt(curr) ]
  });

  return res;
}

