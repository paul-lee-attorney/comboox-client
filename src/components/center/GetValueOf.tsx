import { useState } from "react"
import { getCentPrice } from "../../scripts/comp/gk";
import { useComBooxContext } from "../../scripts/common/ComBooxContext";
import { bigIntToStrNum, isNum, strNumToBigInt } from "../../scripts/common/toolsKit";
import { Alert, Collapse, IconButton, Stack, Tooltip } from "@mui/material";
import { Close, HelpOutline } from "@mui/icons-material";

interface GetValueOfProps {
  amt: string;
}

export function GetValueOf({ amt }:GetValueOfProps ) {

  const { gk } = useComBooxContext();

  const [ value, setValue ] = useState(0n);
  const [ open, setOpen ] = useState(false);

  const handleClick = async () => {    
    if (gk) {
      let centPrice = await getCentPrice( gk );
      let output = strNumToBigInt(amt, 2) * centPrice;
      setValue(output);
      setOpen(true);
    }
  }

  return (
    <Stack direction='row' sx={{ alignItems:'start' }} >
      <Tooltip title={"Check Value In ETH"} placement='right' arrow >
        <span>
          <IconButton
            disabled={!isNum(amt)}
            color='primary'
            sx={{ mt:1 }}
            onClick={ handleClick }
            edge="end"
          >
            <HelpOutline />
          </IconButton>
        </span>
      </Tooltip>

      <Collapse in={open} sx={{ minWidth:218, m:1, mt:0.5}}>        
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

          variant='outlined' 
          severity='info'
          sx={{ height: 45,  m:1, mt:0}} 
        >
          { bigIntToStrNum((value / (10n**9n)), 9) + ' (ETH)'}
        </Alert>
      </Collapse>
    </Stack>
  )
}