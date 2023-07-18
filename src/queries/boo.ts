import { readContract } from "@wagmi/core";
import { Option } from "../components/comp/boc/terms/Options/Options";
import { bookOfOptionsABI } from "../generated";
import { HexType } from "../interfaces";

export async function getOption(addr: HexType, seqOfOpt: number): Promise<Option>{
  let res = await readContract({
    address: addr,
    abi: bookOfOptionsABI,
    functionName: 'getOption',
    args: [BigInt(seqOfOpt)],
  });

  let obligors = await readContract({
    address: addr,
    abi: bookOfOptionsABI,
    functionName: 'getObligorsOfOption',
    args: [BigInt(seqOfOpt)],
  });

  let out:Option = {
    ...res,
    obligors: obligors.map(v => Number(v)), 
  }

  return out;
}

export interface CheckPoint {
  timestamp: number;
  paid: bigint;
  par: bigint;
  cleanPaid: bigint;
}

export async function getOracleAtDate(addr: HexType, seqOfOpt: number, date: number): Promise<CheckPoint>{

  let res = await readContract({
    address: addr,
    abi: bookOfOptionsABI,
    functionName: 'getOracleAtDate',
    args: [ BigInt(seqOfOpt), BigInt(date) ],
  })

  return res;
}

export async function getLatestOracle(addr: HexType, seqOfOpt: number): Promise<CheckPoint>{

  let res = await readContract({
    address: addr,
    abi: bookOfOptionsABI,
    functionName: 'getLatestOracle',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}

export async function getAllOraclesOfOption(addr: HexType, seqOfOpt: number): Promise<readonly CheckPoint[]>{

  let res = await readContract({
    address: addr,
    abi: bookOfOptionsABI,
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
    abi: bookOfOptionsABI,
    functionName: 'counterOfBriefs',
    args: [ BigInt(seqOfOpt) ],
  })

  return Number(res);
}

export async function getBrief(addr: HexType, seqOfOpt: number, seqOfBrf: number): Promise<Brief>{

  let res = await readContract({
    address: addr,
    abi: bookOfOptionsABI,
    functionName: 'getBrief',
    args: [ BigInt(seqOfOpt), BigInt(seqOfBrf) ],
  })

  return res;
}

export async function getAllBriefsOfOption(addr: HexType, seqOfOpt: number): Promise<readonly Brief[]>{

  let res = await readContract({
    address: addr,
    abi: bookOfOptionsABI,
    functionName: 'getAllBriefsOfOption',
    args: [ BigInt(seqOfOpt) ],
  })

  return res;
}



