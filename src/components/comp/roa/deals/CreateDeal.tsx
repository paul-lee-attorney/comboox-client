import { ChangeEvent, useState } from "react";

import { HexType, MaxData, MaxPrice, MaxSeqNo, MaxUserNo, booxMap } from "../../../../scripts/common";

import { 
  useInvestmentAgreementAddDeal, 
} from "../../../../generated";

import { 
  Button, 
  Divider, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Stack, 
  TextField, 
  Toolbar 
} from "@mui/material";

import { AddCircle } from "@mui/icons-material";

import dayjs from 'dayjs';
import { DateTimeField } from "@mui/x-date-pickers";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Body, Head, StrBody, StrHead, TypeOfDeal, codifyHeadOfDeal, defaultBody, defaultHead, defaultStrBody, defaultStrHead } from "../../../../scripts/comp/ia";
import { getShare } from "../../../../scripts/comp/ros";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";

export interface CreateDealProps{
  addr: HexType;
  refresh: ()=>void;
}

export function CreateDeal({addr, refresh}: CreateDealProps) {

  const { boox } = useComBooxContext();

  const [ head, setHead ] = useState<StrHead>(defaultStrHead);
  const [ body, setBody ] = useState<StrBody>(defaultStrBody);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: addDealLoading,
    write: addDeal,
  } = useInvestmentAgreementAddDeal({
    address: addr,
    args: [ codifyHeadOfDeal(head),
            BigInt(body.buyer),
            BigInt(body.groupOfBuyer),
            BigInt(body.paid),
            BigInt(body.par)
          ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });
      
  const handleSeqChanged = (e:ChangeEvent<HTMLInputElement>)=> {

    let input = e.target.value;
    onlyNum('SeqOfShare', input, MaxPrice, setValid);

    let seq = input;

    if (Number(seq) > 0 && boox) {
      getShare(boox[booxMap.ROS], seq).then(
        res => {
          if (res)
            setHead(v => ({
              ...v,
              classOfShare: res.head.class.toString(),
              seqOfShare: seq,
              seller: res.head.shareholder.toString(),
              votingWeight: res.head.votingWeight.toString(),
            }));
        }
      )
    } else {
      setHead(v => ({
        ...v,
        classOfShare: '0',
        seqOfShare: '0',
        seller: '0',
        votingWeight: '100',
      }));
    }
  }

  return (
    <Paper elevation={3} sx={{p:1, m:1, border: 1, borderColor:'divider' }} >
      <Toolbar sx={{ textDecoration:'underline' }}>
        <h3>Create Deal</h3>
      </Toolbar>

      <Stack direction='row' sx={{ alignItems:'center' }} >

        <Stack direction='column' >

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
              <InputLabel id="typeOfDeal-label">TypeOfDeal</InputLabel>
              <Select
                labelId="typeOfDeal-label"
                id="typeOfDeal-select"
                label="TypeOfDeal"
                value={ head.typeOfDeal }
                onChange={(e) => setHead((v) => ({
                  ...v,
                  typeOfDeal: e.target.value,
                }))}
              >
                {TypeOfDeal.slice(0,3).map((v,i) => (
                  <MenuItem key={v} value={i+1}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField 
              variant='outlined'
              size="small"
              label='SeqOfShare'
              error={ valid['SeqOfShare']?.error }
              helperText={ valid['SeqOfShare']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={ handleSeqChanged }
              value={ head.seqOfShare } 
            />

            <TextField 
              variant='outlined'
              size="small"
              label='ClassOfShare'
              error={ valid['ClassOfShare']?.error }
              helperText={ valid['ClassOfShare']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('ClassOfShare', input, MaxSeqNo, setValid);
                setHead((v) => ({
                  ...v,
                  classOfShare: input,
                  }));
              }}
              value={ head.classOfShare }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='PriceOfPar (Cent)'
              error={ valid['PriceOfPar']?.error }
              helperText={ valid['PriceOfPar']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('PriceOfPar', input, MaxData, setValid);
                setHead((v) => ({
                  ...v,
                  priceOfPar: input,
                }));
              }}
              value={ head.priceOfPar }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='PriceOfPaid (Cent)'
              error={ valid['PriceOfPaid']?.error }
              helperText={ valid['PriceOfPaid']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('PriceOfPaid', input, MaxData, setValid);
                setHead((v) => ({
                  ...v,
                  priceOfPaid: input,
                }));
              }}
              value={ head.priceOfPaid }
            />

          </Stack>

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            <DateTimeField
              label='ClosingDeadline'
              size="small"
              sx={{
                m:1,
                minWidth: 218,
              }} 
              value={ dayjs.unix(head?.closingDeadline) }
              onChange={(date) => setHead((v) => ({
                ...v,
                closingDeadline: date ? date.unix() : 0,
              }))}
              format='YYYY-MM-DD HH:mm:ss'
            />

            <TextField 
              variant='outlined'
              size="small"
              label='Buyer'
              error={ valid['Buyer']?.error }
              helperText={ valid['Buyer']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Buyer', input, MaxUserNo, setValid);
                setBody((v) => ({
                ...v,
                buyer: input,
                }));
              }}
              value={ body.buyer }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='GroupOfBuyer'
              error={ valid['GroupOfBuyer']?.error }
              helperText={ valid['GroupOfBuyer']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('GroupOfBuyer', input, MaxUserNo, setValid);
                setBody((v) => ({
                ...v,
                groupOfBuyer: input,
                }));
              }}
              value={ body.groupOfBuyer }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='Par (Cent)'
              error={ valid['Par']?.error }
              helperText={ valid['Par']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Par', input, MaxData, setValid);
                setBody((v) => ({
                ...v,
                par: input,
                }))
              }}
              value={ body.par }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='Paid (Cent)'
              error={ valid['Paid']?.error }
              helperText={ valid['Paid']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Paid', input, MaxData, setValid);
                setBody((v) => ({
                ...v,
                paid: input,
                }));
              }}
              value={ body.paid }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='VotingWeight (%)'
              error={ valid['VotingWeight']?.error }
              helperText={ valid['VotingWeight']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('VotingWeight', input, MaxSeqNo, setValid);
                setHead((v) => ({
                  ...v,
                  votingWeight: input,
                }));
              }}
              value={ head.votingWeight }
            />

          </Stack>

        </Stack>

        <Divider orientation="vertical" sx={{ m:1 }} flexItem />

        <Button 
          disabled = {!addDeal || addDealLoading || hasError(valid)}
          sx={{ m:1, mr:5, p:1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<AddCircle />}
          onClick={()=> addDeal?.()}
          size='small'
        >
          Add Deal
        </Button>

      </Stack>

    </Paper>
  );
}



