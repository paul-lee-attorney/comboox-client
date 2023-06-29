import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { 
  Stack,
} from "@mui/material";

import {
  BigNumber
} from 'ethers';

import { HexType } from "../../../../interfaces";

import { readContract } from "@wagmi/core";


import { 
  investmentAgreementABI,
  useInvestmentAgreementGetSeqList,
} from "../../../../generated";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";
import { Finalized } from "../../../common/accessControl/Finalized";
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
        list.push(v.toNumber())
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