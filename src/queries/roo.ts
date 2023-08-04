import { readContract } from "@wagmi/core";
import { registerOfOptionsABI } from "../generated";
import { HexType } from "../interfaces";

export interface HeadOfOpt{
  seqOfOpt: number;
  typeOfOpt: number;
  classOfShare: number;
  rate: number;
  issueDate: number;
  triggerDate: number;
  execDays: number;
  closingDays: number;
  obligor: number;
}

export const defaultHeadOfOpt: HeadOfOpt = {
  seqOfOpt: 0,
  typeOfOpt: 0,
  classOfShare: 0,
  rate: 0,
  issueDate: 0,
  triggerDate: 0,
  execDays: 0,
  closingDays: 0,
  obligor: 0,
}

export function optSnParser(sn: HexType): HeadOfOpt {
  let out: HeadOfOpt = {
    seqOfOpt: parseInt(sn.substring(2, 10), 16),
    typeOfOpt: parseInt(sn.substring(10, 12), 16),
    classOfShare: parseInt(sn.substring(12, 16), 16),
    rate: parseInt(sn.substring(16, 24), 16),
    issueDate: parseInt(sn.substring(24, 36), 16),
    triggerDate: parseInt(sn.substring(36, 48), 16),
    execDays: parseInt(sn.substring(48, 52), 16),
    closingDays: parseInt(sn.substring(52, 56), 16),
    obligor: parseInt(sn.substring(56, 66), 16),
  }
  return out;
}

export function optHeadCodifier(head: HeadOfOpt): HexType {
  let out: HexType = `0x${
    head.seqOfOpt.toString(16).padStart(8, '0') +
    head.typeOfOpt.toString(16).padStart(2, '0') +
    head.classOfShare.toString(16).padStart(4, '0') +
    head.rate.toString(16).padStart(8, '0') +
    head.issueDate.toString(16).padStart(12, '0') +
    head.triggerDate.toString(16).padStart(12, '0') +
    head.execDays.toString(16).padStart(4, '0') +
    head.closingDays.toString(16).padStart(4, '0') +
    head.obligor.toString(16).padStart(10, '0')
  }`;
  return out;
}

// ==== BodyOfOpt ====

export interface BodyOfOpt{
  closingDeadline: number;
  rightholder: number;
  paid: bigint;
  par: bigint;
  state: number;
  para: number;
  argu: number;
}

export const defaultBodyOfOpt: BodyOfOpt = {
  closingDeadline: 0,
  rightholder: 0,
  paid: BigInt(0),
  par: BigInt(0),
  state: 0,
  para: 0,
  argu: 0,
}

// ==== Cond ====

export interface Cond {
  seqOfCond: number;
  logicOpr: number;    
  compOpr1: number;    
  para1: bigint;           
  compOpr2: number;    
  para2: bigint;           
  compOpr3: number;    
  para3: bigint;                               
}

export const defaultCond: Cond = {
  seqOfCond: 0,
  logicOpr: 0,    
  compOpr1: 0,    
  para1: BigInt(0),           
  compOpr2: 0,    
  para2: BigInt(0),           
  compOpr3: 0,    
  para3: BigInt(0),                               
}

export function condSnParser(sn: HexType): Cond {
  let out: Cond = {
    seqOfCond: parseInt(sn.substring(2, 10), 16),
    logicOpr: parseInt(sn.substring(10, 12), 16),    
    compOpr1: parseInt(sn.substring(12, 14), 16),    
    para1: BigInt(parseInt(sn.substring(14, 30), 16)),           
    compOpr2: parseInt(sn.substring(30, 32), 16),    
    para2: BigInt(parseInt(sn.substring(32, 48), 16)),           
    compOpr3: parseInt(sn.substring(48, 50), 16),    
    para3: BigInt(parseInt(sn.substring(50, 66), 16)),                               
  }
  return out;
}

export function condCodifier(cond: Cond): HexType {
  let out: HexType = `0x${
    cond.seqOfCond.toString(16).padStart(8, '0') +
    cond.logicOpr.toString(16).padStart(2, '0') +
    cond.compOpr1.toString(16).padStart(2, '0') +
    cond.para1.toString(16).padStart(16, '0') +
    cond.compOpr2.toString(16).padStart(2, '0') +
    cond.para2.toString(16).padStart(16, '0') +
    cond.compOpr3.toString(16).padStart(2, '0') +
    cond.para3.toString(16).padStart(16, '0')
  }`;
  return out;
}

// ==== Option ====

export interface Option {
  head: HeadOfOpt;
  cond: Cond;
  body: BodyOfOpt;
  // obligors: number[];
}

export interface OptWrap {
  opt: Option;
  obligors: number[];
}

export const defaultOpt: Option = {
  head: defaultHeadOfOpt,
  cond: defaultCond,
  body: defaultBodyOfOpt,
}

export const defaultOptWrap: OptWrap = {
  opt: defaultOpt,
  obligors: [0],
}

export async function getOptWrap(addr: HexType, seqOfOpt: number): Promise<OptWrap>{
  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getOption',
    args: [BigInt(seqOfOpt)],
  });

  let obligors = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getObligorsOfOption',
    args: [BigInt(seqOfOpt)],
  });

  let out:OptWrap = {
    opt: res,
    obligors: obligors.map(v => Number(v)), 
  }

  return out;
}

export const typeOfOpts = [
  'Call @ Price', 'Put @ Price', 'Call @ ROE', 'Put @ ROE', 
  'Call @ Price & Cnds', 'Put @ Price & Cnds', 'Call @ ROE & Cnds', 'Put @ ROE & Cnds'
]

export const logOps = [
  '(SoleCond)', '&& (And)', '|| (Or)', '&&_||', '||_&&', '== (Equal)', '!= (NotEqual)',
  '&&_&&_&&', '||_||_||', '&&_||_||', '||_&&_||', 
  '||_||_&&', '&&_&&_||', '&&_||_&&', '||_&&_&&',
  '==_==', '==_!=', '!=_==', '!=_!='
]

export const comOps = [
  'None', '==', '!=', '>', '<', '>=', '<=' 
]

export interface CheckPoint {
  timestamp: number;
  paid: bigint;
  par: bigint;
  cleanPaid: bigint;
}

export async function getOracleAtDate(addr: HexType, seqOfOpt: number, date: number): Promise<CheckPoint>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getOracleAtDate',
    args: [ BigInt(seqOfOpt), BigInt(date) ],
  })

  return res;
}

export async function getLatestOracle(addr: HexType, seqOfOpt: number): Promise<CheckPoint>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getLatestOracle',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}

export async function getAllOraclesOfOption(addr: HexType, seqOfOpt: number): Promise<readonly CheckPoint[]>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getAllOraclesOfOption',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}

// ==== Breifs ====

export interface Brief{
  seqOfBrf: number;
  seqOfSwap: number;
  rateOfSwap: number;
  paidOfConsider: bigint;
  paidOfTarget: bigint;
  obligor: number;
  state: number; 
}

export async function counterOfBriefs(addr: HexType, seqOfOpt: number): Promise<number>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'counterOfBriefs',
    args: [ BigInt(seqOfOpt) ],
  })

  return Number(res);
}

export async function getBrief(addr: HexType, seqOfOpt: number, seqOfBrf: number): Promise<Brief>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getBrief',
    args: [ BigInt(seqOfOpt), BigInt(seqOfBrf) ],
  })

  return res;
}

export async function getAllBriefsOfOption(addr: HexType, seqOfOpt: number): Promise<readonly Brief[]>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getAllBriefsOfOption',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}



