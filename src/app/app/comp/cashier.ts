import { readContract } from "@wagmi/core";
import { HexType } from "../common";
import { cashierABI } from "../../../../generated";


export async function custodyOf(addr:HexType, acct:HexType): Promise<bigint> {

  let res = await readContract({
     address: addr,
     abi: cashierABI,
     functionName: 'custodyOf',
     args: [acct]
   })
 
   return res; 
}


export async function totalCustody(addr:HexType): Promise<bigint> {

  let res = await readContract({
     address: addr,
     abi: cashierABI,
     functionName: 'totalCustody',
   })
 
   return res; 
}

export async function balanceOfComp(addr:HexType): Promise<bigint> {

  let res = await readContract({
     address: addr,
     abi: cashierABI,
     functionName: 'balanceOfComp',
   })
 
   return res; 
}

