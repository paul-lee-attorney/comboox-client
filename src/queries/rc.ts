import { readContract, getWalletClient, getContract, getPublicClient, waitForTransaction } from "@wagmi/core";
import { AddrOfRegCenter, AddrZero, Bytes32Zero, HexType, SelectorZero } from "../interfaces";
import { regCenterABI } from "../generated";

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
  seqOfKey: number;
  dataOfKey: number;
  dateOfKey: number;
}

export interface User {
  isCOA: boolean;
  counterOfV: number;
  balance: bigint;
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
  ceiling: bigint;
  floor: bigint;
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
    args: [BigInt(acct)],
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

  // let res = await readContract({
  //   address: addr,
  //   abi: regCenterABI,
  //   functionName: 'getUser'
  // });

  // return res;
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


  // let res = await readContract({
  //   address: addr,
  //   abi: regCenterABI,
  //   functionName: 'getMyUserNo'
  // });
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
    args: [ BigInt(typeOfDoc), BigInt(version) ]
  });

  return res;
}

export async function getSNList(addr: HexType, typeOfDoc: string, version:string): Promise<readonly HexType[]>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getSNList',
    args: [ BigInt(typeOfDoc), BigInt(version) ]
  });

  return res;
}

export async function getDocsList(addr: HexType, typeOfDoc: string, version:string): Promise<readonly Doc[]>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getDocsList',
    args: [ BigInt(typeOfDoc), BigInt(version) ]
  });

  return res;
}

export async function getTempsList(addr: HexType, typeOfDoc: string): Promise<readonly Doc[]>{
  let res = await readContract({
    address: addr,
    abi: regCenterABI,
    functionName: 'getTempsList',
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
