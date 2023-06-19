import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { AddrZero, HexType } from "../interfaces";

interface ContextType {
  gk: HexType,
  setGK: Dispatch<SetStateAction<HexType>>,
  boox: HexType[],
  setBoox: Dispatch<SetStateAction<HexType[]>>,
}

const ComBooxContext = createContext<ContextType>({
  gk: AddrZero, 
  setGK: ()=>{},
  boox: [],
  setBoox: ()=>{},
});

interface ComBooxWrapperProps {
  children: any;
}

export function ComBooxWrapper({ children }: ComBooxWrapperProps) {
  const [gk, setGK] = useState<HexType>(AddrZero);
  const [boox, setBoox] = useState<HexType[]>([]);

  return (
    <ComBooxContext.Provider value={{ gk, setGK, boox, setBoox}} >
      { children }
    </ComBooxContext.Provider >
  );
}

export function useComBooxContext() {
  return useContext(ComBooxContext);
}