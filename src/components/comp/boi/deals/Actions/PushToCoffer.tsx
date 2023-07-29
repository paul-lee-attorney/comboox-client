import { Dispatch, SetStateAction, useState } from "react";
import { Bytes32Zero, HexType } from "../../../../../interfaces";
import { Deal, defaultDeal } from "../../../../../queries/ia";
import dayjs, { Dayjs } from "dayjs";
import { useGeneralKeeperPushToCoffer } from "../../../../../generated";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import { LockClock } from "@mui/icons-material";
import { useComBooxContext } from "../../../../../scripts/ComBooxContext";
import { ActionsOfDealProps } from "../ActionsOfDeal";



export function PushToCoffer({ia, deal, setOpen, setDeal, refreshDealsList}:ActionsOfDealProps) {

  const {gk} = useComBooxContext();

  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);
  const [ closingDate, setClosingDate ] = useState<Dayjs | null>(dayjs('2019-09-09T00:00:00Z'));

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: pushToCofferLoading,
    write: pushToCoffer,
  } = useGeneralKeeperPushToCoffer({
    address: gk,
    args: closingDate?.unix() ? 
      [ia, BigInt(deal.head.seqOfDeal), hashLock, BigInt(closingDate.unix()) ] :
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
            onChange={(e) => setHashLock(`0x${e.target.value}`)}
            value={ hashLock.substring(2) }
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