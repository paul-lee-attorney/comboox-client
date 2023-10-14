import { Alert, Collapse, IconButton, Stack, Tooltip } from "@mui/material";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { Close, HelpOutline, } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getEthPart, getGEthPart, getGWeiPart, getWeiPart } from "../../../scripts/common/toolsKit";
import { depositOfMine } from "../../../scripts/comp/gk";


export function DepositOfMine() {
  
  const { gk, userNo } = useComBooxContext();

  const [ deposit, setDeposit ] = useState<string>('0');

  useEffect(()=>{
    if (gk && userNo) {
      depositOfMine(gk, userNo).then(
        res => setDeposit(res.toString())
      );
    }
  }, [ gk, userNo ]);

  const [ open, setOpen ] = useState(false);

  const handleClick = () => {
    setOpen(true);
  }

  return(
    <Stack direction='row' sx={{ alignItems:'center' }}>
      <Tooltip 
        title='Get My Deposits' 
        placement='right' 
        arrow 
      >
        <span>
          <IconButton 
            sx={{mx:1, ml: 5}}
            size="large"
            onClick={handleClick}
            color="primary"
          >
            <HelpOutline />
          </IconButton>
        </span>
      </Tooltip>

      <Collapse in={ open } sx={{ m:1 }} >
        <Alert 
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
          variant="outlined" 
          severity='info' 
          sx={{ height: 45, p:0.5 }} 
        >
          Deposit of {userNo}: {getGEthPart(deposit) != '-' ? getGEthPart(deposit) + 'GEth, ' : ''} {getEthPart(deposit) != '-' ? getEthPart(deposit) + 'Eth, ' : ''} { getGWeiPart(deposit) != '-' ? getGWeiPart(deposit) + 'GWei, ' : ''} {getWeiPart(deposit) + 'Wei'}
        </Alert>          
      </Collapse>

    </Stack>
  );
}