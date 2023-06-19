import { useEffect } from "react";

import { HexType } from "../../../interfaces";

import { readContract } from "@wagmi/core";

import { 
  accessControlABI,
} from "../../../generated";
import { finalized } from "../../../queries/accessControl";

interface FinalizedProps {
  addr: HexType,
  setFinalized: (flag: boolean) => void,
}

export function Finalized({addr, setFinalized}:FinalizedProps) {

  useEffect(()=>{
    if (addr) {
      finalized(addr).then(
        flag => setFinalized(flag)
      )
    }
  }, [ addr, setFinalized ]);

  return (
    <></>
  )
} 