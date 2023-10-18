import { useGeneralKeeperExecPledge } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { DoneOutline } from "@mui/icons-material";
import { ActionsOfPledgeProps } from "../ActionsOfPledge";
import { useEffect, useState } from "react";

import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { HexType, MaxData, MaxUserNo, booxMap } from "../../../../scripts/common";
import { getShare } from "../../../../scripts/comp/ros";
import { StrBody, StrHead, codifyHeadOfDeal, defaultStrBody, defaultStrHead } from "../../../../scripts/comp/ia";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function ExecPledge({pld, setOpen, refresh}:ActionsOfPledgeProps) {

  const { gk, boox } = useComBooxContext();
  
  const [ head, setHead ] = useState<StrHead>(defaultStrHead);
  const [ body, setBody ] = useState<StrBody>(defaultStrBody);
  const [ version, setVersion ] = useState<string>('1');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);



  useEffect(()=>{
    if (boox) {
      getShare(boox[booxMap.ROS], pld.head.seqOfShare.toString()).then(
        res => {
          setHead(v => ({
            ...v,
            classOfShare: res.head.class.toString(),
            seqOfShare: pld.head.seqOfShare.toString(),
            seller: res.head.shareholder.toString(),
          }));
          setBody(v => ({
            ...v,
            paid: pld.body.paid.toString(),
            par: pld.body.par.toString(),
          }))
        }
      );
    }
  });

  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: execPledgeLoading,
    write: execPledge,
  } = useGeneralKeeperExecPledge({
    address: gk,
    args: !hasError(valid)
        ? [ codifyHeadOfDeal(head),
            BigInt(pld.head.seqOfPld),
            BigInt(version),
            BigInt(body.buyer),
            BigInt(body.groupOfBuyer) 
          ]
        : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }    
  });
        
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='Buyer'
          error={ valid['Buyer']?.error }
          helperText={ valid['Buyer']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Buyer', input, MaxUserNo, setValid);
            setBody(v=>({
              ...v,
              buyer: e.target.value,
            }));
          }}
          value={ body.buyer }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='GroupRepOfBuyer'
          error={ valid['GroupOfBuyer']?.error }
          helperText={ valid['GroupOfBuyer']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('GroupOfBuyer', input, MaxUserNo, setValid);
            setBody(v=>({
              ...v,
              groupOfBuyer: e.target.value,
            }));
          }}
          value={ body.groupOfBuyer }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='PriceOfPaid'
          error={ valid['PriceOfPaid']?.error }
          helperText={ valid['PriceOfPaid']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('PriceOfPaid', input, MaxData, setValid);
            setHead(v=>({
              ...v,
              priceOfPaid: e.target.value,
            }));
          }}
          value={ head.priceOfPaid }
          size='small'
        />

        <TextField 
          variant='outlined'
          label='PriceOfPar'
          error={ valid['PriceOfPar']?.error }
          helperText={ valid['PriceOfPar']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('PriceOfPar', input, MaxData, setValid);
            setHead(v=>({
              ...v,
              priceOfPar: e.target.value,
            }));
          }}
          value={ head.priceOfPar }
          size='small'
        />

        <DateTimeField
          label='ClosingDeadline'
          sx={{
            m:1,
            minWidth: 218,
          }} 
          value={ dayjs.unix(head.closingDeadline) }
          onChange={(date) => setHead((v) => ({
            ...v,
            closingDeadline: date ? date.unix() : 0,
          }))}
          format='YYYY-MM-DD HH:mm:ss'
          size="small"
        />

        <LoadingButton 
          disabled={ execPledgeLoading || hasError(valid) }
          loading = {loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <DoneOutline /> }
          onClick={()=>execPledge?.() }
          size='small'
        >
          Exercise
        </LoadingButton>        

      </Stack>
    </Paper>
  );

}


