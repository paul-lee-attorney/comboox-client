import { useState } from "react";
import { useGeneralKeeperCreatePledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { StrBody, StrHead, codifyHeadOfPledge, defaultStrBody, defaultStrHead } from "../../../scripts/comp/rop";
import { Button, Divider, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { getShare } from "../../../scripts/comp/ros";
import { Create } from "@mui/icons-material";
import { HexType, MaxData, MaxPrice, MaxSeqNo, MaxUserNo, booxMap } from "../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../scripts/common/toolsKit";


async function obtainPledgor(addr:HexType, seqOfShare: string):Promise<string>{  
  let share = await getShare(addr, seqOfShare);
  return share.head.shareholder.toString();
};

interface CreatePledgeProps{
  refresh: ()=>void;
}

export function CreatePledge({refresh}:CreatePledgeProps) {

  const { gk, boox } = useComBooxContext();

  const [ head, setHead ] = useState<StrHead>(defaultStrHead);
  const [ body, setBody ] = useState<StrBody>(defaultStrBody);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: createPledgeLoading,
    write: createPledge,
  } = useGeneralKeeperCreatePledge({
    address: gk,
    args:
        [ codifyHeadOfPledge(head), 
          BigInt(body.paid),
          BigInt(body.par),
          BigInt(body.guaranteedAmt),
          BigInt(body.execDays)
        ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
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
              error={ valid['SeqOfShare']?.error }
              helperText={ valid['SeqOfShare']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('SeqOfShare', input, MaxPrice, setValid);
                if (input != '0' && boox) {
                  setHead((v) => ({
                    ...v,
                    seqOfShare: input,
                  }));
                  obtainPledgor(boox[booxMap.ROS], input).then(
                    pledgor => setHead(v => ({
                      ...v,
                      pledgor: pledgor,
                    }))
                  );
                };
              }}

              value={ head.seqOfShare }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='DaysToMaturity'
              error={ valid['DaysToMaturity']?.error }
              helperText={ valid['DaysToMaturity']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('DaysToMaturity', input, MaxSeqNo, setValid);
                setHead((v) => ({
                  ...v,
                  daysToMaturity: input,
                }));
              }}
              value={ head.daysToMaturity }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='GuaranteeDays'
              error={ valid['GuaranteeDays']?.error }
              helperText={ valid['GuaranteeDays']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('GuaranteeDays', input, MaxSeqNo, setValid);
                setHead((v) => ({
                  ...v,
                  guaranteeDays: input,
                }));
              }}
              value={ head.guaranteeDays }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='ExecDays'
              error={ valid['ExecDays']?.error }
              helperText={ valid['ExecDays']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('ExecDays', input, MaxSeqNo, setValid);
                setBody((v) => ({
                  ...v,
                  execDays: e.target.value,
                }));
              }}

              value={ body?.execDays }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='Creditor'
              error={ valid['Creditor']?.error }
              helperText={ valid['Creditor']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Creditor', input, MaxUserNo, setValid);
                setHead((v) => ({
                  ...v,
                  creditor: input,
                }));
              }}

              value={ head.creditor }
              size='small'
            />

          </Stack>

          <Stack direction='row' >

            <TextField 
              variant='outlined'
              label='Pledgor'
              error={ valid['Pledgor']?.error }
              helperText={ valid['Pledgor']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Pledgor', input, MaxUserNo, setValid);
                setHead((v) => ({
                  ...v,
                  pledgor: input,
                }));
              }}

              value={ head.pledgor }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='PledgedPaid (Cent)'
              error={ valid['PledgedPaid']?.error }
              helperText={ valid['PledgedPaid']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('PledgedPaid', input, MaxData, setValid);
                setBody((v) => ({
                  ...v,
                  paid: input,
                }));
              }}

              value={ body?.paid }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='PledgedPar (Cent)'
              error={ valid['PledgedPar']?.error }
              helperText={ valid['PledgedPar']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('PledgedPar', input, MaxData, setValid);
                setBody((v) => ({
                  ...v,
                  par: input,
                }));
              }}

              value={ body?.par }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='GuaranteedAmount (Cent)'
              error={ valid['GuaranteedAmount']?.error }
              helperText={ valid['GuaranteedAmount']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('GuaranteedAmount', input, MaxData, setValid);
                setBody((v) => ({
                  ...v,
                  guaranteedAmt: input,
                }));
              }}

              value={ body?.guaranteedAmt }
              size='small'
            />

            <TextField 
              variant='outlined'
              label='Debtor'
              error={ valid['Debtor']?.error }
              helperText={ valid['Debtor']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Debtor', input, MaxData, setValid);
                setHead((v) => ({
                  ...v,
                  debtor: input,
                }));
              }}

              value={ head.debtor }
              size='small'
            />

          </Stack>

        </Stack>

        <Divider orientation="vertical" flexItem />

        <Button 
          disabled={ createPledgeLoading || hasError(valid) }
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


