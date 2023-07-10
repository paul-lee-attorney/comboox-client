import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { regCenterABI } from "../generated";
import { BigNumber } from "ethers";

// ==== Locker ====

export interface HeadOfLocker {
  from: number;
  to: number;
  expireDate: number;
  value: BigNumber;
}

export interface BodyOfLocker {
  counterLocker: HexType;
  selector: string;
  data: BigNumber;
}

export interface Locker {
  head: HeadOfLocker;
  body: BodyOfLocker;
}

// ==== User ====

export interface Key {
  pubKey: HexType;
  seqOfKey: number;
  dataOfKey: number;
  dateOfKey: number;
}

export interface User {
  isCOA: boolean;
  counterOfV: number;
  balance: BigNumber;
  primeKey: Key;
  backupKey: Key;
}


// ==== RegCenter ====

export interface Reward {
  eoaRewards: number;
  coaRewards: number;
  offAmt: number;
  discRate: number;
  refundRatio: number;
  ceiling: BigNumber;
  floor: BigNumber;
}

// ==== Doc ====

export interface HeadOfDoc {
  typeOfDoc: number;
  version: number;
  seqOfDoc: BigNumber;
  creator: number;
  createDate: number;
  para: number;
  argu: number;
  data: number;
  state: number;        
}

export interface Doc {
  head: HeadOfDoc;
  body: HexType;
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

export async function getRewardSetting(addr: HexType): Promise<Reward>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getRewardSetting'
  });

  return res;
}

// ==== User ====

export async function isKey(addr: HexType, key: HexType): Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'isKey',
    args: [key],
  });

  return res;
}

export async function isCOA(addr: HexType, acct: string): Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'isCOA',
    args: [BigNumber.from(acct)],
  });

  return res;
}

export async function getUser(addr: HexType): Promise<User>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getUser'
  });

  return res;
}

export async function getMyUserNo(addr: HexType): Promise<number>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getMyUserNo'
  });

  return res;
}

// ==== Docs ====

export async function counterOfVersions(addr: HexType, typeOfDoc: string): Promise<number>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'counterOfVersions',
    args: [BigNumber.from(typeOfDoc)]
  });

  return res;
}

export async function counterOfDocs(addr: HexType, typeOfDoc: string, version: string): Promise<BigNumber>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'counterOfDocs',
    args: [BigNumber.from(typeOfDoc), BigNumber.from(version)]
  });

  return res;
}

export async function getDocKeeper(addr: HexType): Promise<HexType>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getDocKeeper'
  });

  return res;
}

// ==== SingleCheck ====

export async function getTemplate(addr: HexType, snOfDoc: HexType): Promise<Doc>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getTemplate',
    args: [ snOfDoc ]
  });

  return res;
}

export async function docExist(addr: HexType, snOfDoc: HexType): Promise<boolean>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'docExist',
    args: [ snOfDoc ]
  });

  return res;
}

export async function getDoc(addr: HexType, snOfDoc: HexType): Promise<Doc>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getDoc',
    args: [ snOfDoc ]
  });

  return res;
}

export async function getDocByUserNo(addr: HexType, acct: string): Promise<Doc>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getDocByUserNo',
    args: [ BigNumber.from(acct) ]
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

// ==== BatchQueries ====

export async function getAllDocsSN(addr: HexType): Promise<readonly HexType[]>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getAllDocsSN',
  });

  return res;
}

export async function getBodiesList(addr: HexType, typeOfDoc: string, version:string): Promise<readonly HexType[]>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getBodiesList',
    args: [ BigNumber.from(typeOfDoc), BigNumber.from(version) ]
  });

  return res;
}

export async function getSNList(addr: HexType, typeOfDoc: string, version:string): Promise<readonly HexType[]>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getSNList',
    args: [ BigNumber.from(typeOfDoc), BigNumber.from(version) ]
  });

  return res;
}

export async function getDocsList(addr: HexType, typeOfDoc: string, version:string): Promise<readonly Doc[]>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getDocsList',
    args: [ BigNumber.from(typeOfDoc), BigNumber.from(version) ]
  });

  return res;
}

export async function getTempsList(addr: HexType, typeOfDoc: string): Promise<readonly Doc[]>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getTempsList',
    args: [ BigNumber.from(typeOfDoc) ]
  });

  return res;
}

