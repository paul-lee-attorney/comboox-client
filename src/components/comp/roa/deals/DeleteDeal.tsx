import { Dispatch, SetStateAction } from "react";
import { Deal, defaultDeal } from "../../../../scripts/comp/ia";
import { useInvestmentAgreement, useInvestmentAgreementDelDeal } from "../../../../generated";
import { HexType } from "../../../../scripts/common";
import { Button } from "@mui/material";
import { Delete } from "@mui/icons-material";


interface DeleteDealProps {
  ia: HexType;
  seqOfDeal: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  refreshDealsList: ()=>void;
}

export function DeleteDeal({ia, seqOfDeal, setOpen, setDeal, refreshDealsList}:DeleteDealProps) {

  const {
    write: deleteDeal
  } = useInvestmentAgreementDelDeal({
    address: ia,
    args: [ BigInt(seqOfDeal) ],
    onSuccess() {
      setDeal(defaultDeal);
      refreshDealsList();
      setOpen(false);
    }
  })

  return (
    <Button
      variant="contained" 
      endIcon={<Delete/>} 
      sx={{ mr:5 }}
      onClick={()=>deleteDeal?.()} 
    >
      Delete
    </Button>
  );  
}