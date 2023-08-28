import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { AddrZero, HexType } from ".";

interface ContextType {
  userNo: number | undefined,
  setUserNo: Dispatch<SetStateAction<number | undefined>>,
  gk: HexType | undefined,
  setGK: Dispatch<SetStateAction<HexType | undefined>>,
  boox: HexType[] | undefined,
  setBoox: Dispatch<SetStateAction<HexType[] | undefined>>,
}

const ComBooxContext = createContext<ContextType>({
  userNo: undefined,
  setUserNo: ()=>{}, 
  gk: undefined, 
  setGK: ()=>{},
  boox: undefined,
  setBoox: ()=>{},
});

interface ComBooxWrapperProps {
  children: any;
}

export function ComBooxWrapper({ children }: ComBooxWrapperProps) {
  const [userNo, setUserNo] = useState<number>();
  const [gk, setGK] = useState<HexType>();
  const [boox, setBoox] = useState<HexType[]>();

  return (
    <ComBooxContext.Provider value={{userNo, setUserNo, gk, setGK, boox, setBoox}} >
      { children }
    </ComBooxContext.Provider >
  );
}

export function useComBooxContext() {
  return useContext(ComBooxContext);
}