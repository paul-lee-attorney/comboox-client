import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { registerOfDirectorsABI } from "../generated";

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

export async function getPosition(addr:HexType, seq: bigint):Promise<Position> {
  let pos = await readContract({
    address: addr,
    abi: registerOfDirectorsABI,
    functionName: 'getPosition',
    args: [seq],
  })

  return pos;
}

export async function getManagersPosList(addr:HexType):Promise<readonly bigint[]>{
  let list = await readContract({
    address: addr,
    abi: registerOfDirectorsABI,
    functionName: 'getManagersPosList',
  })

  return list;
}

export async function getManagersFullPosInfo(addr:HexType):Promise<readonly Position[]>{

  let list = await getManagersPosList(addr);
  let len = list.length;
  let output:Position[] = [];

  while (len > 0) {
    let pos = await getPosition(addr, list[len-1]);
    output.push(pos);
    len--;
  }

  return output;
}

export async function getDirectorsPosList(addr:HexType):Promise<readonly bigint[]>{
  let list = await readContract({
    address: addr,
    abi: registerOfDirectorsABI,
    functionName: 'getDirectorsPosList',
  })

  return list;
}

export async function getFullPosInfo(addr:HexType, list: readonly bigint[]):Promise<readonly Position[]>{

  // let list = await getDirectorsPosList(addr);
  let len = list.length;
  let output:Position[] = [];

  while (len > 0) {
    let pos = await getPosition(addr, list[len-1]);
    output.push(pos);
    len--;
  }

  return output;
}


