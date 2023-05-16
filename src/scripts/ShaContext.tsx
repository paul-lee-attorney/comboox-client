import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { AddrZero, HexType } from "../interfaces";

type ContextType = {
  sha: HexType,
  setSha: Dispatch<SetStateAction<HexType>>,
}

const ShaContext = createContext<ContextType>({
  sha: AddrZero, 
  setSha: ()=>{},
});

interface WrapperType {
  children: any
}

export function ShaWrapper({ children }: WrapperType) {
  const [sha, setSha] = useState<HexType>(AddrZero);

  return (
    <ShaContext.Provider value={{sha, setSha}} >
      { children }
    </ShaContext.Provider >
  );
}

export function useShaContext() {
  return useContext(ShaContext);
}