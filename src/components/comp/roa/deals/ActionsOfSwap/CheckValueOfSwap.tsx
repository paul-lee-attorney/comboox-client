import { useEffect, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@mui/material";
import { Help } from "@mui/icons-material";
import { getEthPart, getGWeiPart, getWeiPart, weiToEth } from "../../../../../scripts/common/toolsKit";
import { ActionsOfSwapProps } from "../ActionsOfSwap";
import { checkValueOfSwap } from "../../../../../scripts/comp/roo";

export function CheckValueOfSwap({addr, deal, seqOfSwap, setShow}: ActionsOfSwapProps) {

  const [ value, setValue ] = useState<bigint>(BigInt(0));

  useEffect(()=>{
    checkValueOfSwap(addr, deal.head.seqOfDeal, seqOfSwap).then(
      res => setValue(res)
    );
  },[addr, deal.head.seqOfDeal, seqOfSwap]);

  const [ open, setOpen ] = useState<boolean>(false);

  const handleClick = () => {
    setOpen(true);
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Help />}
        sx={{ m:1, height: 40, minWidth:218 }}
        onClick={ handleClick }
      >
        Value: {weiToEth(value.toString()) + ' (ETH)'}
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"
      >

        <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }} >
          <b>Value Of Swap - {seqOfSwap}</b>
        </DialogTitle>

        <DialogContent>

          <Paper elevation={3} sx={{ m:1, p:3, border:1, borderColor:'divider' }} >

            <Typography variant="h6">
              {' ETH: ' + getEthPart(value.toString())}
            </Typography>

            <Typography variant="h6">
              {'Gwei: ' + getGWeiPart(value.toString())}
            </Typography>

            <Typography variant="h6">
              {' Wei: ' + getWeiPart(value.toString())}
            </Typography>

          </Paper>

        </DialogContent>

        <DialogActions>
          <Button 
            sx={{m:1, mr:3, p:1, minWidth:128 }}
            variant="outlined"
            onClick={()=>setOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      
      </Dialog>
    </>
  );
}