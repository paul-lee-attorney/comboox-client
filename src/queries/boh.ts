import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { bookOfShaABI } from "../generated";


export async function getSha(boh: HexType): Promise<HexType> {
  let sha = readContract({
    address: boh,
    abi: bookOfShaABI,
    functionName: "pointer",
  });

  return sha;
} 



