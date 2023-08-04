import { useBookOfSharesGetShare, useGeneralKeeperExecPledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { DoneOutline } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { useState } from "react";
import { Body, Head, defaultBody, defaultHead } from "../../../../queries/ia";
import { codifyHeadOfDeal } from "../../roa/deals/CreateDeal";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export function ExecPledge({pld, setOpen, getAllPledges}:ActionsOfPledgeProps) {

  const { gk, boox } = useComBooxContext();
  
  const [ head, setHead ] = useState<Head>(defaultHead);
  const [ body, setBody ] = useState<Body>(defaultBody);
  const [ version, setVersion ] = useState<number>(1);
  
  useBookOfSharesGetShare({
    address: boox ? boox[10] : undefined,
    args: [BigInt(pld.head.seqOfShare)],
    onSuccess(res) {
      setHead(v => ({
        ...v,
        classOfShare: res.head.class,
        seqOfShare: pld.head.seqOfShare,
        seller: res.head.shareholder,
      }));
      setBody(v => ({
        ...v,
        paid: pld.body.paid,
        par: pld.body.par,
      }))
    }
  })

  const {
    isLoading: execPledgeLoading,
    write: execPledge,
  } = useGeneralKeeperExecPledge({
    address: gk,
    args: [ codifyHeadOfDeal(head),
            BigInt(pld.head.seqOfPld),
            BigInt(version),
            BigInt(body.buyer),
            BigInt(body.groupOfBuyer) ],
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      {/* <Toolbar>
        <h4>Exercise Pledge</h4>
      </Toolbar> */}

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='Buyer'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setBody(v=>({
            ...v,
            buyer: parseInt(e.target.value ?? '0'),
          }))}
          value={ body.buyer.toString() }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='GroupRepOfBuyer'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setBody(v=>({
            ...v,
            groupOfBuyer: parseInt(e.target.value ?? '0'),
          }))}
          value={ body.groupOfBuyer.toString() }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='PriceOfPaid'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setHead(v=>({
            ...v,
            priceOfPaid: parseInt(e.target.value ?? '0'),
          }))}
          value={ head.priceOfPaid.toString() }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='PriceOfPar'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setHead(v=>({
            ...v,
            priceOfPar: parseInt(e.target.value ?? '0'),
          }))}
          value={ head.priceOfPar.toString() }
          size='small'
        />

        <DateTimeField
          label='ClosingDeadline'
          sx={{
            m:1,
            minWidth: 218,
          }} 
          value={ dayjs.unix(head ? head.closingDeadline : 0) }
          onChange={(date) => setHead((v) => ({
            ...v,
            closingDeadline: date ? date.unix() : 0,
          }))}
          format='YYYY-MM-DD HH:mm:ss'
          size="small"
        />

        <Button 
          disabled={ execPledgeLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <DoneOutline /> }
          onClick={()=>execPledge?.() }
          size='small'
        >
          Exercise
        </Button>        

      </Stack>
    </Paper>
  );

}


