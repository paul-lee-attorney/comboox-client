import { readContract } from "@wagmi/core";
import { AddrZero, Bytes32Zero, HexType } from "../interfaces";
import { shareholdersAgreementABI } from "../generated";
import { FirstRefusalRule, frParser } from "../components/comp/roc/rules/SetFirstRefusalRule";

export const defaultTerms:HexType[] = [
  AddrZero, AddrZero, AddrZero,
  AddrZero, AddrZero
]

export async function obtainRules(sha: HexType): Promise<number[]> {
  let list = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'getRules',
  });

  let output: number[] = [];
  list.forEach(v => output.push(Number(v)));

  return output;
}

export async function obtainTitles(sha: HexType): Promise<number[]> {
  let list = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'getTitles',
  });

  return list.map(v => Number(v));
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

export async function getFirstRefusalRules(sha: HexType): Promise<FirstRefusalRule[]> {

  let out: FirstRefusalRule[] = [];
  let strFr = await getRule(sha, 512);

  if ( strFr != Bytes32Zero ) {
    
    let fr = frParser(strFr);
    out.push(fr);
    let len = fr.qtyOfSubRule;

    while (len > 1) {
      out.push(frParser(await getRule(sha, 511 + len)));
      len--;
    }

  }

  return out;
}

