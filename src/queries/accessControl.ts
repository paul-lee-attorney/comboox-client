import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { accessControlABI } from "../generated";
import { ATTORNEYS } from "../components/common/accessControl/RemoveAttorney";

export async function getOwner(addr: HexType): Promise<HexType> {
  let owner = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'getOwner',
  });

  return owner;
}

export async function getGeneralCounsel(addr: HexType): Promise<HexType> {
  let gc = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'getRoleAdmin',
    args: [ATTORNEYS]
  });

  return gc;
}

export async function getDK(addr: HexType): Promise<HexType>{
  let keeper: HexType = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'getDK',
  })

  return keeper;
}

export async function isFinalized(addr: HexType): Promise<boolean>{
  let flag: boolean = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'isFinalized',
  })
  
  return flag;
}

export async function hasRole(addr: HexType, role: HexType, acct: HexType): Promise<boolean> {
  let flag = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'hasRole',
    args: [role, acct],
  });

  return flag;
}