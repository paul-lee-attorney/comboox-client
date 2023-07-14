import { useEffect, useState } from "react";


import { HexType } from "../../../../interfaces";


import { getSeqList } from "../../../../queries/ia";
import { Deals } from "../deals/Deals";

interface IaBodyTermsProps {
  ia: HexType;
  isFinalized: boolean;
}

function IaBodyTerms({ia, isFinalized}: IaBodyTermsProps) {

  const [ seqList, setSeqList ] = useState<number[]>();

  useEffect(()=>{
    const obtainSeqList = async () => {
      let list:number[] = [];
      let seqList = await getSeqList(ia);
      seqList.forEach(v => {
        list.push(Number(v))
      });
      setSeqList(list);
    }

    obtainSeqList();
  });

  return (
    <Deals ia={ ia } seqList={ seqList } isFinalized={ isFinalized } /> 
  );
} 

export default IaBodyTerms;