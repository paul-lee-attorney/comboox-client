import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { HexType } from "../../../scripts/common";
import { TransactionReceipt } from "viem";
import { waitForTransaction } from "@wagmi/core";

interface GetTxReceiptProps {
  hash: HexType | undefined;
  setHash: Dispatch<SetStateAction<HexType | undefined>>;
  refresh: ()=>void;
}

export function GetTxReceipt({hash, setHash, refresh}: GetTxReceiptProps) {

  const [ receipt, setReceipt ] = useState<TransactionReceipt>();
  const [ open, setOpen ] = useState<boolean>(false);
  
  useEffect(()=>{
    if (hash)
      waitForTransaction({hash}).then(
        res => {
          setReceipt(res);
          setOpen(true);
        }
      )
  }, [hash]);

  const handleClose = ()=>{
    refresh();
    setHash(undefined);
    setReceipt(undefined);    
    setOpen(false);
  }

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
        <b>Receipt Of Transaction</b>
      </DialogTitle>
      <DialogContent>
        blockHash: {receipt?.blockHash} <br/>
        blockNumber: {receipt?.blockNumber.toString()} <br/>
        contractAddress: {receipt?.contractAddress} <br/>
        cumulativeGasUsed: {receipt?.cumulativeGasUsed.toString()} <br/>
        effectiveGasPrice: {receipt?.effectiveGasPrice.toString()} <br/>
        from: {receipt?.from} <br/>
        gasUsed: {receipt?.gasUsed.toString()} <br/>
        logs: {receipt?.logs.map(v => v.topics.map(k => k + `${<br/>}` ))} <br/>
        status: {receipt?.status} <br/>
        to: {receipt?.to} <br/>
        transactionHash: {receipt?.transactionHash} <br/>
        transactionIndex: {receipt?.transactionIndex.toString()} <br/>
        type: {receipt?.type.toString()} <br/> 
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={handleClose}>Close</Button>
      </DialogActions>

    </Dialog>

  );

}