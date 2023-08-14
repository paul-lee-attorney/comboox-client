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

export interface FRClaim{
  seqOfDeal: number;
  rightholder: number;
  weight: bigint;
  ratio: bigint;
  sigDate: number;
  sigHash: HexType;
}

export async function getDTClaimsOfDeal(boi: HexType, ia: HexType, seqOfDeal: number ): Promise<readonly DTClaim[]> {

  let flag = await readContract({
    address: boi,
    abi: registerOfAgreementsABI,
    functionName: 'hasDTClaims',
    args: [ia, BigInt(seqOfDeal)],
  })

  let res: readonly DTClaim[] = [];

  if (!flag) return res;

  res = await readContract({
    address: boi,
    abi: registerOfAgreementsABI,
    functionName: 'getDTClaimsOfDeal',
    args: [ia, BigInt(seqOfDeal)],
  })

  return res;
}

