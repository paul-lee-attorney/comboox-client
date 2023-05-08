import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { AddrZero, HexType } from "../interfaces";

type ContextType = {
  gk: HexType,
  setGK: Dispatch<SetStateAction<HexType>>,
}

const ComBooxContext = createContext<ContextType>({gk: AddrZero, setGK: ()=>{}});

type WrapperType = {
  children: any
}

export function ComBooxWrapper({ children }: WrapperType) {
  const [gk, setGK] = useState<HexType>(AddrZero);

  return (
    <ComBooxContext.Provider value={{gk, setGK}} >
      { children }
    </ComBooxContext.Provider >
  );
}

export function useComBooxContext() {
  return useContext(ComBooxContext);
}