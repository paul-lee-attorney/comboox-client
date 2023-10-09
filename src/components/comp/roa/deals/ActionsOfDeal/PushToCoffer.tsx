import { useState } from "react";
import { Bytes32Zero, HexType } from "../../../../../scripts/common";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import dayjs, { Dayjs } from "dayjs";
import { useGeneralKeeperPushToCoffer } from "../../../../../generated";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import { LockClock } from "@mui/icons-material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { HexParser } from "../../../../../scripts/common/toolsKit";

export function PushToCoffer({addr, deal, setOpen, setDeal, setTime}:ActionsOfDealProps) {

  const {gk} = useComBooxContext();

  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);
  const [ closingDate, setClosingDate ] = useState<Dayjs | null>(dayjs('2019-09-09T00:00:00Z'));

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    setTime(Date.now());
    setOpen(false);    
  }

  const {
    isLoading: pushToCofferLoading,
    write: pushToCoffer,
  } = useGeneralKeeperPushToCoffer({
    address: gk,
    args: closingDate?.unix() ? 
      [addr, BigInt(deal.head.seqOfDeal), hashLock, BigInt(closingDate.unix()) ] :
      undefined,
    onSuccess() {
      closeOrderOfDeal();
    }
  })

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
        {/* <Toolbar>
          <h4>Push To Coffer </h4>
        </Toolbar> */}

        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <TextField 
            variant='outlined'
            label='HashLock'
            size="small"
            sx={{
              m:1,
              minWidth: 685,
            }}
            onChange={(e) => setHashLock(HexParser( e.target.value ))}
            value={ hashLock }
          />

          <DateTimeField
            label='ClosingDate'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }} 
            value={ closingDate }
            onChange={(date) => setClosingDate(date)}
            format='YYYY-MM-DD HH:mm:ss'
          />

          <Button 
            disabled = {!pushToCoffer || pushToCofferLoading || deal.body.state > 1 }

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<LockClock />}
            onClick={()=> pushToCoffer?.()}
            size='small'
          >
            Lock Share
          </Button>


        </Stack>

    </Paper>



  );
  
}