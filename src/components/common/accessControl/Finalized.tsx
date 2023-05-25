import { useEffect } from "react";

import { HexType } from "../../../interfaces";

import { readContract } from "@wagmi/core";

import { 
  accessControlABI,
} from "../../../generated";

async function isFinalized(addr:HexType): Promise<boolean> {
  let flag = await readContract({
    address: addr,
    abi: accessControlABI,
    functionName: 'finalized',
  })
  return flag;
}

interface FinalizedProps {
  addr: HexType,
  setFinalized: (flag: boolean) => void,
}

export function Finalized({addr, setFinalized}:FinalizedProps) {

  useEffect(()=>{
    if (addr) {
      isFinalized(addr).then(
        flag => setFinalized(flag)
      )
    }
  }, [ addr, setFinalized ]);

  return (
    <></>
  )
} 