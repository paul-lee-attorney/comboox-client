import { useRouter } from "next/router";

import { 
  Stack,
} from "@mui/material";


import { HexType } from "../../../interfaces";
import { useState } from "react";


interface SigPageProps{
  addr: HexType;
  isFinalized: boolean;
}

export function SigPage({addr, isFinalized}:SigPageProps) {
  return (
    <Signatures addr={ sha } initPage={ true } isFinalized={isFinalized} />
  );
} 