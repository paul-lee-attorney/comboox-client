import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { bookOfConstitutionABI } from "../generated";


export async function getSha(boh: HexType): Promise<HexType> {
  let sha = readContract({
    address: boh,
    abi: bookOfConstitutionABI,
    functionName: "pointer",
  });

  return sha;
} 



