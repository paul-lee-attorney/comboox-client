import { Dispatch, SetStateAction } from "react";
import { Deal, defaultDeal } from "../../../../scripts/comp/ia";
import { useInvestmentAgreementDelDeal } from "../../../../generated";
import { HexType } from "../../../../scripts/common";
import { Button } from "@mui/material";
import { Delete } from "@mui/icons-material";


interface DeleteDealProps {
  addr: HexType;
  seqOfDeal: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  setTime: Dispatch<SetStateAction<number>>;
}

export function DeleteDeal({addr, seqOfDeal, setOpen, setDeal, setTime}:DeleteDealProps) {

  const {
    write: deleteDeal
  } = useInvestmentAgreementDelDeal({
    address: addr,
    args: [ BigInt(seqOfDeal) ],
    onSuccess() {
      setDeal(defaultDeal);
      setTime(Date.now());
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