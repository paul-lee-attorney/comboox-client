import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { registerOfMembersABI } from "../generated";



export async function controllor(addr: HexType): Promise<number> {
  let acct:number = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'controllor',
  });

  return acct;
}