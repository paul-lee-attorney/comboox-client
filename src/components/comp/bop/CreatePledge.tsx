import { useState } from "react";
import { useBookOfPledgesCreatePledge, useGeneralKeeperCreatePledge, usePrepareBookOfPledgesCreatePledge, usePrepareGeneralKeeperCreatePledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Body, Head, codifyHeadOfPledge, defaultBody, defaultHead } from "../../../queries/bop";
import { BigNumber } from "ethers";
import { Button, Divider, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getShare } from "../../../queries/bos";
import { Create } from "@mui/icons-material";
import { HexType } from "../../../interfaces";


async function obtainPledgor(addr:HexType, seqOfShare: number):Promise<number>{  
  let share = await getShare(addr, seqOfShare);
  return share.head.shareholder;
};

interface CreatePledgeProps{
  getAllPledges:()=>void;
}

export function CreatePledge({getAllPledges}:CreatePledgeProps) {

  const { gk, boox } = useComBooxContext();

  const [ head, setHead ] = useState<Head>(defaultHead);
  const [ body, setBody ] = useState<Body>(defaultBody);

  const {
    config: createPledgeConfig
  } = usePrepareGeneralKeeperCreatePledge({
    address: gk,
    args:
        [ 
          codifyHeadOfPledge(head), 
          BigNumber.from(body.creditor),
          BigNumber.from(body.guaranteeDays),
          body.paid,
          body.par,
          body.guaranteedAmt
        ],
  });

  const {
    isLoading: createPledgeLoading,
    write: createPledge,
  } = useGeneralKeeperCreatePledge({
    ...createPledgeConfig,
    onSuccess() {
      getAllPledges();
    }    
  });

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar sx={{ textDecoration:'underline' }} >
        <h4>Create Pledge</h4>
      </Toolbar>

      <Stack direction='row' sx={{m:1, p:1, alignItems:'center'}} >

        <Stack direction='column' sx={{m:1, p:1}}>

          <Stack direction='row' sx={{alignItems:'center' }} >

            <TextField 
              variant='filled'
              label='SeqOfShare'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let seq = parseInt(e.target.value);

                if (seq > 0 && boox) {
                  setHead((v) => ({
                    ...v,
                    seqOfShare: seq,
                  }));
                  obtainPledgor(boox[7], seq).then(
                    pledgor => setHead(v => ({
                      ...v,
                      pledgor: pledgor,
                    }))
                  );
                };
              }}

              value={ head?.seqOfShare }
              size='small'
            />

            <DateTimeField
              label='TriggerDate'
              sx={{
                m:1,
                minWidth: 218,
              }} 
              value={ dayjs.unix(head ? head.triggerDate : 0) }
              onChange={(date) => setHead((v) => ({
                ...v,
                triggerDate: date ? date.unix() : 0,
              }))}

              format='YYYY-MM-DD HH:mm:ss'
              size="small"
            />

            <TextField 
              variant='filled'
              label='Creditor'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                creditor: parseInt(e.target.value),
              }))}

              value={ body?.creditor }
              size='small'
            />

            <TextField 
              variant='filled'
              label='Debtor'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                debtor: parseInt(e.target.value),
              }))}

              value={ head?.debtor }
              size='small'
            />

          </Stack>

          <Stack direction='row' >

            <TextField 
              variant='filled'
              label='GuaranteeDays'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                guaranteeDays: parseInt(e.target.value),
              }))}

              value={ body?.guaranteeDays }
              size='small'
            />

            <TextField 
              variant='filled'
              label='PledgedPaid'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                paid: BigNumber.from(e.target.value),
              }))}

              value={ body?.paid.toString() }
              size='small'
            />

            <TextField 
              variant='filled'
              label='PledgedPar'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                par: BigNumber.from(e.target.value),
              }))}

              value={ body?.par.toString() }
              size='small'
            />

            <TextField 
              variant='filled'
              label='GuaranteedAmount'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                guaranteedAmt: BigNumber.from(e.target.value),
              }))}

              value={ body?.guaranteedAmt.toString() }
              size='small'
            />

          </Stack>

        </Stack>

        <Divider orientation="vertical" flexItem />

        <Button 
          disabled={ !createPledge || createPledgeLoading }
          sx={{ m: 3, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Create /> }
          onClick={ ()=>createPledge?.() }
          size='small'
        >
          Create
        </Button>        

      </Stack>
    </Paper>
  );

}


