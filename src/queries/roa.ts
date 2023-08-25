import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { registerOfAgreementsABI } from "../generated";


export interface DTClaim{
  typeOfClaim: number;
  seqOfShare: number;
  paid: bigint;
  par: bigint;
  claimer: number;
  sigDate: number;
  sigHash: HexType;
}

export async function getDTClaimsOfDeal(boa: HexType, ia: HexType, seqOfDeal: number ): Promise<readonly DTClaim[]> {

  let res = await readContract({
    address: boa,
    abi: registerOfAgreementsABI,
    functionName: 'getDTClaimsOfDeal',
    args: [ia, BigInt(seqOfDeal)],
  })

  return res;
}

export interface FRClaim{
  seqOfDeal: number;
  claimer: number;
  weight: bigint;
  ratio: bigint;
  sigDate: number;
  sigHash: HexType;
}

export async function getFRClaimsOfDeal(boa: HexType, ia: HexType, seqOfDeal: number ): Promise<readonly FRClaim[]> {

  let res = await readContract({
    address: boa,
    abi: registerOfAgreementsABI,
    functionName: 'getFRClaimsOfDeal',
    args: [ia, BigInt(seqOfDeal)],
  })

  return res;
}




