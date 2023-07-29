import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { bookOfConstitutionABI } from "../generated";


export async function getSha(boc: HexType): Promise<HexType> {
  let sha = readContract({
    address: boc,
    abi: bookOfConstitutionABI,
    functionName: "pointer",
  });

  return sha;
} 



