import { Dispatch, SetStateAction } from "react";
import { Deal, defaultDeal } from "../../../../scripts/comp/ia";
import { useInvestmentAgreementDelDeal } from "../../../../generated";
import { HexType } from "../../../../scripts/common";
import { Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";


interface DeleteDealProps {
  addr: HexType;
  seqOfDeal: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  refresh: ()=>void;
}

export function DeleteDeal({addr, seqOfDeal, setOpen, setDeal, refresh}:DeleteDealProps) {

  const updateResults = ()=>{
    setDeal(defaultDeal);
    refresh();
    setOpen(false);
  }

  const {
    write: deleteDeal
  } = useInvestmentAgreementDelDeal({
    address: addr,
    args: [ BigInt(seqOfDeal) ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

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