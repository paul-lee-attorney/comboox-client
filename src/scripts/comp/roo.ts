import { readContract } from "@wagmi/core";
import { registerOfOptionsABI } from "../../generated";
import { HexType } from "../common";

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

export const typeOfOpts = [
  'Call @ Price', 'Put @ Price', 'Call @ ROE', 'Put @ ROE', 
  'Call @ Price & Cnds', 'Put @ Price & Cnds', 'Call @ ROE & Cnds', 'Put @ ROE & Cnds'
]

export const logOps = [
  '(SoleCond)', 
  '&& (And)', '|| (Or)', '== (Equal)', '!= (NotEqual)',
  '&&_&&', '||_||', '&&_||', '||_&&', 
  '==_==', '!=_!=', '==_!=', '!=_==', 
  '&&_==', '==_&&', '||_==', '==_||', 
  '&&_!=', '!=_&&', '||_!=', '!=_||', 
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

export interface Swap{
  seqOfSwap: number;
  seqOfPledge: number;
  paidOfPledge: bigint;
  seqOfTarget: number;
  paidOfTarget: bigint;
  priceOfDeal: number;
  isPutOpt: boolean;
  state: number; 
}

// ==== Read Funcs =====

export async function counterOfOptions(addr: HexType): Promise<number>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'counterOfOptions',
  })

  return res;
}

export async function qtyOfOptions(addr: HexType): Promise<bigint>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'qtyOfOptions',
  })

  return res;
}

export async function isOption(addr: HexType, seqOfOpt: number): Promise<boolean>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'isOption',
    args: [ BigInt(seqOfOpt) ]
  })

  return res;
}

export async function getOption(addr: HexType, seqOfOpt: number): Promise<Option>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getOption',
    args: [ BigInt(seqOfOpt) ]
  })

  return res;
}

export async function getAllOptions(addr: HexType): Promise<readonly Option[]>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getAllOptions',
  })

  return res;
}

export async function isRightholder(addr: HexType, seqOfOpt: number, acct: number): Promise<boolean>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'isRightholder',
    args: [ BigInt(seqOfOpt), BigInt(acct) ]
  })

  return res;
}

export async function isObligor(addr: HexType, seqOfOpt: number, acct: number): Promise<boolean>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'isObligor',
    args: [ BigInt(seqOfOpt), BigInt(acct) ]
  })

  return res;
}

export async function getObligorsOfOption(addr: HexType, seqOfOpt: number): Promise<readonly bigint[]>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getObligorsOfOption',
    args: [ BigInt(seqOfOpt) ]
  })

  return res;
}

export async function getSeqListOfOptions(addr: HexType): Promise<readonly bigint[]>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getSeqListOfOptions',
  })

  return res;
}

// ==== Swap ====

export async function counterOfSwaps(addr: HexType, seqOfOpt: number): Promise<number>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'counterOfSwaps',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}

export async function sumPaidOfTarget(addr: HexType, seqOfOpt: number): Promise<bigint>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'sumPaidOfTarget',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}

export async function isSwap(addr: HexType, seqOfOpt: number, seqOfSwap: number): Promise<boolean>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'isSwap',
    args: [ BigInt(seqOfOpt), BigInt(seqOfSwap) ],
  })

  return res;
}

export async function getSwap(addr: HexType, seqOfOpt: number, seqOfSwap: number): Promise<Swap>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getSwap',
    args: [ BigInt(seqOfOpt), BigInt(seqOfSwap) ],
  })

  return res;
}

export async function getAllSwapsOfOption(addr: HexType, seqOfOpt: number): Promise<readonly Swap[]>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getAllSwapsOfOption',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}

export async function allSwapsClosed(addr: HexType, seqOfOpt: number): Promise<boolean>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'allSwapsClosed',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}

// ==== Oracles ====

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

// ==== Value ====

export async function checkValueOfSwap(addr: HexType, seqOfOpt: number, seqOfSwap: number): Promise<bigint>{

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'checkValueOfSwap',
    args: [ BigInt(seqOfOpt), BigInt(seqOfSwap) ],
  })

  return res;
}

// ==== Special Funcs ====

export async function getAllOpts(addr: HexType): Promise<readonly OptWrap[]>{

  let opts = await getAllOptions(addr);
  let len = opts.length;
  let out: OptWrap[] = [];

  while(len > 0) {
    let opt = opts[len - 1];
    let obligors = await getObligorsOfOption(addr, opt.head.seqOfOpt);
    let item: OptWrap = {
      opt: opt,
      obligors: obligors.map(v => Number(v)),
    };
    out.push(item);
    len--;
  }

  return out;
}

export async function getOptWrap(addr: HexType, seqOfOpt: number): Promise<OptWrap>{

  let opt = await getOption(addr, seqOfOpt);
  let obligors = await getObligorsOfOption(addr, seqOfOpt);

  let out:OptWrap = {
    opt: opt,
    obligors: obligors.map(v => Number(v)), 
  }

  return out;
}
