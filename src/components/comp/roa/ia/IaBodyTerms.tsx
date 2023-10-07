import { useState } from "react";


import { HexType } from "../../../../scripts/common";


import { Deal, defaultDeal, getDeal } from "../../../../scripts/comp/ia";

import { useInvestmentAgreementGetSeqList } from "../../../../generated";
import { Paper } from "@mui/material";
import { CreateDeal } from "../deals/CreateDeal";
import { DealsList } from "../deals/DealsList";
import { OrderOfDeal } from "../deals/OrderOfDeal";


async function obtainDealsList(ia: HexType, seqList: readonly bigint[]): Promise<Deal[]> {
  let list: Deal[] = [];
  let len = seqList.length;

  while (len > 0) {
    list.push(await getDeal(ia, seqList[len - 1]));
    len--;
  }

  return list;
}

interface IaBodyTermsProps {
  ia: HexType;
  isFinalized: boolean;
}

function IaBodyTerms({ia, isFinalized}: IaBodyTermsProps) {

  const [ dealsList, setDealsList ] = useState<Deal[]>();

  const {
    refetch: getDealsList
  } = useInvestmentAgreementGetSeqList({
    address: ia,
    onSuccess(res) {
      obtainDealsList(ia, res).then(ls => {
        setDealsList(ls);        
      })
    }
  })

  const [ deal, setDeal ] = useState<Deal>(defaultDeal);
  const [ open, setOpen ] = useState<boolean>(false);

  return (
    <Paper elevation={3} sx={{p:1, m:1, border:1, borderColor:'divider' }} >
      {!isFinalized && (
        <CreateDeal ia={ia} refreshDealsList={getDealsList} />
      )}
      
      {dealsList && (
        <DealsList ia={ia} isFinalized={isFinalized} list={dealsList} setDeal={ setDeal } setOpen={ setOpen } />
      )}

      {open && (
        <OrderOfDeal ia={ia} isFinalized={isFinalized} open={ open } deal={ deal } setOpen={ setOpen } setDeal={ setDeal } refreshDealsList={ getDealsList } />
      )}

    </Paper>
  );
} 

export default IaBodyTerms;