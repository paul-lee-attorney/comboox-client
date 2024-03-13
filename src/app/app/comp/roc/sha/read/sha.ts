import { readContract } from "@wagmi/core";
import { AddrZero, Bytes32Zero, HexType } from "../../../../read";
import { shareholdersAgreementABI } from "../../../../../../generated";

export const defaultTerms:HexType[] = [
  AddrZero, AddrZero, AddrZero,
  AddrZero, AddrZero
]

export async function hasTitle(sha: HexType, title: number): Promise<boolean> {
  let res = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'hasTitle',
    args: [ BigInt(title) ]
  });

  return res;
}

export async function qtyOfTerms(sha: HexType): Promise<bigint> {
  let res = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'qtyOfTerms',
  });

  return res;
}

export async function getTitles(sha: HexType): Promise<readonly bigint[]> {
  let res = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'getTitles',
  });

  return res;
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

export async function hasRule(sha: HexType, seq: number): Promise<boolean> {
  let res = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'hasRule',
    args: [ BigInt(seq) ]
  });

  return res;
}

export async function qtyOfRules(sha: HexType): Promise<bigint> {
  let res = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'qtyOfRules',
  });

  return res;
}

export async function getRules(sha: HexType): Promise<readonly bigint[]> {
  let res = await readContract({
    address: sha,
    abi: shareholdersAgreementABI,
    functionName: 'getRules',
  });

  return res;
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

// ==== Special ====

export async function getFirstRefusalRules(sha: HexType): Promise<FirstRefusalRule[]> {

  let out: FirstRefusalRule[] = [];
  let strFr = await getRule(sha, 512);

  if ( strFr != Bytes32Zero ) {
    
    let fr = frParser(strFr);
    out.push(fr);
    let len = Number(fr.qtyOfSubRule);

    while (len > 1) {
      out.push(frParser(await getRule(sha, 511 + len)));
      len--;
    }

  }

  return out;
}

  // ==== Rules ====

  export const titleOfPositions: string[] = [
    'Shareholder', 'Chairman', 'ViceChairman', 'ManagintDirector', 'Director', 
    'CEO', 'CFO', 'COO', 'CTO', 'President', 'VicePresident', 'Supervisor', 
    'SeniorManager', 'Manager', 'ViceManager'
  ];
  

  export interface FirstRefusalRule {
    seqOfRule: string;
    qtyOfSubRule: string;
    seqOfSubRule: string;
    typeOfDeal: string;
    membersEqual: boolean;
    proRata: boolean;
    basedOnPar: boolean;
    rightholders: string[];
    para: string;
    argu: string;
  }

  export function frParser(hexRule: HexType ): FirstRefusalRule {
    let rule: FirstRefusalRule = {
      seqOfRule: parseInt(hexRule.substring(2, 6), 16).toString(), 
      qtyOfSubRule: parseInt(hexRule.substring(6, 8), 16).toString(),
      seqOfSubRule: parseInt(hexRule.substring(8, 10), 16).toString(),
      typeOfDeal: parseInt(hexRule.substring(10, 12), 16).toString(),
      membersEqual: hexRule.substring(12, 14) === '01',
      proRata: hexRule.substring(14, 16) === '01',
      basedOnPar: hexRule.substring(16, 18) === '01',
      rightholders: [
        parseInt(hexRule.substring(18, 28), 16).toString(),
        parseInt(hexRule.substring(28, 38), 16).toString(),
        parseInt(hexRule.substring(38, 48), 16).toString(),
        parseInt(hexRule.substring(48, 58), 16).toString(),
      ],
      para: parseInt(hexRule.substring(58, 62), 16).toString(),
      argu: parseInt(hexRule.substring(62, 66), 16).toString(),
    }; 
    
    return rule;
  } 

