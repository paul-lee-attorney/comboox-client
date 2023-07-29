import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import BookOfIA from "../pages/comp/boi/BookOfIA";
import { bookOfIaABI } from "../generated";


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

export async function getDTClaimsForDeal(boi: HexType, ia: HexType, seqOfDeal: number ): Promise<readonly DTClaim[]> {

  let res = await readContract({
    address: boi,
    abi: bookOfIaABI,
    functionName: 'getDTClaimsForDeal',
    args: [ia, BigInt(seqOfDeal)],
  })

  return res;
}

export async function claimsOfFR(boi: HexType, ia: HexType, seqOfDeal: number): Promise<readonly FRClaim[]>{

  let res = await readContract({
    address: boi,
    abi: bookOfIaABI,
    functionName: 'claimsOfFR',
    args: [ia, BigInt(seqOfDeal)],
  })

  return res;
}
