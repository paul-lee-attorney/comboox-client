import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { HexType } from "../app/common";

type ContextType = {
  userNo: number | undefined;
  setUserNo: Dispatch<SetStateAction<number | undefined>>;
  gk: HexType | undefined;
  setGK: Dispatch<SetStateAction<HexType | undefined>>;
  boox: HexType[] | undefined;
  setBoox: Dispatch<SetStateAction<HexType[] | undefined>>;
  errMsg: string | undefined;
  setErrMsg: Dispatch<SetStateAction<string | undefined>>;
  onPar: boolean | undefined;
  setOnPar: Dispatch<SetStateAction<boolean | undefined>>;
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
  onPar: undefined,
  setOnPar: ()=>{},
});

type ProviderType = {
  children: React.ReactNode
}

const ComBooxContextProvider = ({ children }: ProviderType) => {
  const [userNo, setUserNo] = useState<number>();
  const [gk, setGK] = useState<HexType>();
  const [boox, setBoox] = useState<HexType[]>();
  const [ errMsg, setErrMsg ] = useState<string>();
  const [ onPar, setOnPar ] = useState<boolean>();

  return (
    <ComBooxContext.Provider value={{userNo, setUserNo, gk, setGK, boox, setBoox, errMsg, setErrMsg, onPar, setOnPar}} >
      { children }
    </ComBooxContext.Provider >
  );
}

const useComBooxContext = () => {
  return useContext(ComBooxContext);
}

export { ComBooxContextProvider, useComBooxContext };