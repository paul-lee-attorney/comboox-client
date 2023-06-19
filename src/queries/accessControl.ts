import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { accessControlABI } from "../generated";
import { BigNumber } from "ethers";

export async function getOwner(addr: HexType): Promise<number> {
  let owner = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'getOwner',
  });

  return owner;
}

export async function getGeneralCounsel(addr: HexType): Promise<number> {
  let gc = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'getGeneralCounsel',
  });

  return gc;
}

export async function getBookeeper(addr: HexType): Promise<HexType>{
  let keeper: HexType = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'getBookeeper',
  })

  return keeper;
}

export async function finalized(addr: HexType): Promise<boolean>{
  let flag: boolean = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'finalized',
  })
  
  return flag;
}

export async function hasRole(addr: HexType, role: HexType, acct: string): Promise<boolean> {
  let flag = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'hasRole',
    args: [role, BigNumber.from(acct)],
  });

  return flag;
}