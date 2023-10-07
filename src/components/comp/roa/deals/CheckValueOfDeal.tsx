import { useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@mui/material";
import { Help } from "@mui/icons-material";
import { useInvestmentAgreementCheckValueOfDeal } from "../../../../generated";
import { getEthPart, getGWeiPart, getWeiPart, weiToEth } from "../../../../scripts/common/toolsKit";
import { HexType } from "../../../../scripts/common";
import { Deal } from "../../../../scripts/comp/ia";

interface CheckValueOfDealProps {
  ia: HexType;
  deal: Deal;
}

export function CheckValueOfDeal({ia, deal}: CheckValueOfDealProps) {

  const [ value, setValue ] = useState<bigint>(BigInt(0));

  const {
    refetch: checkValueOfDeal
  } = useInvestmentAgreementCheckValueOfDeal({
    address: ia,
    args: [BigInt(deal.head.seqOfDeal)],
    onSuccess(res) {
      setValue(res);
    }
  })

  const [ open, setOpen ] = useState<boolean>(false);

  const handleClick = () => {
    checkValueOfDeal();
    setOpen(true);
  }


  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<Help />}
        sx={{ m:1, height: 40 }}
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
          <b>Value Of Deal - {deal.head.seqOfDeal}</b>
        </DialogTitle>

        <DialogContent>

          <Paper elevation={3} sx={{ m:1, p:3, border:1, borderColor:'divider' }} >

            <Typography variant="h6">
              {'ETH: ' + getEthPart(value.toString())}
            </Typography>

            <Typography variant="h6">
              {'Gwei: ' + getGWeiPart(value.toString())}
            </Typography>

            <Typography variant="h6">
              {'Wei: ' + getWeiPart(value.toString())}
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