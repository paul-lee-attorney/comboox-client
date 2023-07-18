import { readContract } from "@wagmi/core";
import { AddrZero, HexType } from "../interfaces";
import { shareholdersAgreementABI } from "../generated";

export const defaultTerms:HexType[] = [
  AddrZero, AddrZero, AddrZero,
  AddrZero, AddrZero, AddrZero
]

export async function obtainRules(sha: HexType): Promise<number[]> {
  let list = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'rules',
  });

  let output: number[] = [];
  list.forEach(v => output.push(Number(v)));

  return output;
}

export async function obtainTitles(sha: HexType): Promise<number[]> {
  let list = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'titles',
  });

  let output: number[] = [];
  list.forEach(v => output.push(Number(v)));

  return output;
}


export async function getRule(sha: HexType, seq: number): Promise<HexType> {
  let rule = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'getRule',
    args: [BigInt(seq)],
  });

  return rule;
}

export async function getTerm(addr: HexType, title: number): Promise<HexType> {

  let addrOfTerm = await readContract({
    address: addr,
    abi: shareholdersAgreementABI,
    functionName: 'getTerm',
    args: [BigInt(title)],
  });

  return addrOfTerm;
}


