import { Dispatch, SetStateAction, useState } from "react";
import { Deal, defaultDeal } from "../../../../scripts/comp/ia";
import { useInvestmentAgreementDelDeal } from "../../../../generated";
import { HexType } from "../../../../scripts/common";
import { Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";


interface DeleteDealProps {
  addr: HexType;
  seqOfDeal: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  refresh: ()=>void;
}

export function DeleteDeal({addr, seqOfDeal, setOpen, setDeal, refresh}:DeleteDealProps) {

  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    setDeal(defaultDeal);
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    write: deleteDeal
  } = useInvestmentAgreementDelDeal({
    address: addr,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    deleteDeal({
      args: [ BigInt(seqOfDeal) ],
    })
  }

  return (
    <LoadingButton
      variant="contained" 
      loading={loading}
      loadingPosition="end"
      endIcon={<Delete/>} 
      sx={{ mr:5 }}
      onClick={ handleClick } 
    >
      Delete
    </LoadingButton>
  );  
}