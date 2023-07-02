import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { bookOfDirectorsABI } from "../generated";

export interface Position {
  title: number;
  seqOfPos: number;
  acct: number;
  nominator: number;
  startDate: number;
  endDate: number;
  seqOfVR: number;
  titleOfNominator: number;
  argu: number;  
}

export async function getDirectorsFullPosInfo(addr:HexType):Promise<readonly Position[]>{

  let list = await readContract({
    address: addr,
    abi: bookOfDirectorsABI,
    functionName: 'getDirectorsFullPosInfo',
  });

  return list;
}

export async function getManagersFullPosInfo(addr:HexType):Promise<readonly Position[]>{

  let list = await readContract({
    address: addr,
    abi: bookOfDirectorsABI,
    functionName: 'getManagersFullPosInfo',
  });

  return list;
}