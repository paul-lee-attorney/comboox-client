import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { shareholdersAgreementABI } from "../generated";
import { BigNumber } from "ethers";

export async function obtainRules(sha: HexType): Promise<number[]> {
  let list = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'rules',
  });

  let output: number[] = [];
  list.forEach(v => output.push(v.toNumber()));

  return output;
}

export async function obtainTitles(sha: HexType): Promise<number[]> {
  let list = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'titles',
  });

  let output: number[] = [];
  list.forEach(v => output.push(v.toNumber()));

  return output;
}


export async function getRule(sha: HexType, seq: number): Promise<HexType> {
  let rule = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'getRule',
    args: [BigNumber.from(seq)],
  });

  return rule;
}

export async function getTerm(addr: HexType, title: number): Promise<HexType> {

  let addrOfTerm = await readContract({
    address: addr,
    abi: shareholdersAgreementABI,
    functionName: 'getTerm',
    args: [BigNumber.from(title)],
  });

  return addrOfTerm;
}


