import { useState } from "react";
import { useGeneralKeeperCreatePledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { Body, Head, codifyHeadOfPledge, defaultBody, defaultHead } from "../../../scripts/comp/rop";
import { Button, Divider, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getShare } from "../../../scripts/comp/ros";
import { Create } from "@mui/icons-material";
import { HexType, booxMap } from "../../../scripts/common";


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
    isLoading: createPledgeLoading,
    write: createPledge,
  } = useGeneralKeeperCreatePledge({
    address: gk,
    args:
        [ codifyHeadOfPledge(head), 
          body.paid,
          body.par,
          body.guaranteedAmt,
          BigInt(body.execDays)
        ],
    onSuccess() {
      getAllPledges();
    }    
  });

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar sx={{ textDecoration:'underline' }} >
        <h3>Create Pledge</h3>
      </Toolbar>

      <Stack direction='row' sx={{m:1, p:1, alignItems:'center'}} >

        <Stack direction='column' sx={{m:1, p:1}}>

          <Stack direction='row' sx={{alignItems:'center' }} >

            <TextField 
              variant='outlined'
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
                  obtainPledgor(boox[booxMap.ROS], seq).then(
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

            <TextField 
              variant='outlined'
              label='DaysToMaturity'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                daysToMaturity: parseInt(e.target.value),
              }))}

              value={ head?.daysToMaturity }
              size='small'
            />


            <TextField 
              variant='outlined'
              label='GuaranteeDays'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                guaranteeDays: parseInt(e.target.value),
              }))}

              value={ head?.guaranteeDays }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='ExecDays'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                execDays: parseInt(e.target.value),
              }))}

              value={ body?.execDays.toString() }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='Creditor'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                creditor: parseInt(e.target.value),
              }))}

              value={ head?.creditor }
              size='small'
            />

          </Stack>

          <Stack direction='row' >

            <TextField 
              variant='outlined'
              label='Pledgor'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                pledgor: parseInt(e.target.value),
              }))}

              value={ head?.pledgor }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='PledgedPaid (Cent)'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                paid: BigInt(e.target.value),
              }))}

              value={ body?.paid.toString() }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='PledgedPar (Cent)'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                par: BigInt(e.target.value),
              }))}

              value={ body?.par.toString() }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='GuaranteedAmount (Cent)'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                guaranteedAmt: BigInt(e.target.value),
              }))}

              value={ body?.guaranteedAmt.toString() }
              size='small'
            />

            <TextField 
              variant='outlined'
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

        </Stack>

        <Divider orientation="vertical" flexItem />

        <Button 
          disabled={ createPledgeLoading }
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


