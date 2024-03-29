import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { HexType } from ".";

interface ContextType {
  userNo: number | undefined;
  setUserNo: Dispatch<SetStateAction<number | undefined>>;
  gk: HexType | undefined;
  setGK: Dispatch<SetStateAction<HexType | undefined>>;
  boox: HexType[] | undefined;
  setBoox: Dispatch<SetStateAction<HexType[] | undefined>>;
  errMsg: string | undefined;
  setErrMsg: Dispatch<SetStateAction<string | undefined>>;
}

const ComBooxContext = createContext<ContextType>({
  userNo: undefined,
  setUserNo: ()=>{}, 
  gk: undefined, 
  setGK: ()=>{},
  boox: undefined,
  setBoox: ()=>{},
  errMsg: undefined,
  setErrMsg: ()=>{},
});

interface ComBooxWrapperProps {
  children: any;
}

export function ComBooxWrapper({ children }: ComBooxWrapperProps) {
  const [userNo, setUserNo] = useState<number>();
  const [gk, setGK] = useState<HexType>();
  const [boox, setBoox] = useState<HexType[]>();
  const [ errMsg, setErrMsg ] = useState<string>();
  return (
    <ComBooxContext.Provider value={{userNo, setUserNo, gk, setGK, boox, setBoox, errMsg, setErrMsg}} >
      { children }
    </ComBooxContext.Provider >
  );
}

export function useComBooxContext() {
  return useContext(ComBooxContext);
}