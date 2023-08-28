import { Dispatch, SetStateAction, useState } from "react";
import { Bytes32Zero, HexType } from "../../../../../scripts/common";
import { Deal, defaultDeal } from "../../../../../scripts/comp/ia";
import dayjs, { Dayjs } from "dayjs";
import { useGeneralKeeperExecAntiDilution, useGeneralKeeperPushToCoffer } from "../../../../../generated";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import { LocalDrinkOutlined, LockClock, WaterDropOutlined } from "@mui/icons-material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { HexParser } from "../../../../../scripts/common/toolsKit";



export function ExecAntiDilution({ia, deal, setOpen, setDeal, refreshDealsList}:ActionsOfDealProps) {

  const {gk} = useComBooxContext();

  const [ seqOfShare, setSeqOfShare ] = useState<number>(0);
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: execAntiDilutionLoading,
    write: execAntiDilution,
  } = useGeneralKeeperExecAntiDilution({
    address: gk,
    args: [ ia, 
            BigInt(deal.head.seqOfDeal), 
            BigInt(seqOfShare),
            sigHash 
          ],
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
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <TextField 
            variant='outlined'
            label='SeqOfTargetShare'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setSeqOfShare(parseInt(e.target.value ?? '0'))}
            value={ seqOfShare.toString() }
          />

          <TextField 
            variant='outlined'
            label='SigHash'
            size="small"
            sx={{
              m:1,
              minWidth: 685,
            }}
            onChange={(e) => setSigHash(HexParser( e.target.value ))}
            value={ sigHash }
          />

          <Button 
            disabled = {!execAntiDilution || execAntiDilutionLoading || deal.body.state > 1 }

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<LocalDrinkOutlined />}
            onClick={()=> execAntiDilution?.()}
            size='small'
          >
            Anti Dilution
          </Button>

        </Stack>

    </Paper>



  );
  
}