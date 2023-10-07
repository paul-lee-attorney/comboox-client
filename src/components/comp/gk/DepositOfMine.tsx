import { Alert, Collapse, IconButton, Stack, Tooltip } from "@mui/material";
import { useGeneralKeeperDepositOfMine } from "../../../generated";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { Close, HelpOutline, } from "@mui/icons-material";
import { useState } from "react";
import { getEthPart, getGEthPart, getGWeiPart, getWeiPart } from "../../../scripts/common/toolsKit";


export function DepositOfMine() {
  
  const { gk, userNo } = useComBooxContext();

  // const [ myNo, setMyNo] = useState<number>();
  const [ deposit, setDeposit ] = useState<string>('0');
  const [ open, setOpen ] = useState(false);

  const {
    refetch: depositOfMine
  } = useGeneralKeeperDepositOfMine({
    address: gk,
    args: userNo 
      ? [ BigInt(userNo) ]
      : undefined,
    onSuccess(res) {
        setDeposit(res.toString());
        setOpen(true);
    }
  })

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
            onClick={()=>depositOfMine?.()}
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