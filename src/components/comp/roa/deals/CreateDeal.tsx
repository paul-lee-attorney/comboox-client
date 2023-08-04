import { ChangeEvent, useEffect, useState } from "react";

import { Bytes32Zero, HexType } from "../../../../interfaces";

import { 
  useInvestmentAgreementAddDeal, 
} from "../../../../generated";

import { 
  Box, 
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

import { AddCircle, RemoveCircle } from "@mui/icons-material";

import dayjs from 'dayjs';
import { DateTimeField } from "@mui/x-date-pickers";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Body, Deal, Head } from "../../../../queries/ia";
import { getShare } from "../../../../queries/bos";
import { isFinalized } from "../../../../queries/accessControl";

const defaultHead: Head = {
  typeOfDeal: 2,
  seqOfDeal: 0,
  preSeq: 0,
  classOfShare: 0,
  seqOfShare: 0,
  seller: 0,
  priceOfPaid: 100,
  priceOfPar: 100,
  closingDeadline: parseInt((new Date().getTime()/1000).toString()) + 90*86400,
  para: 0,
};

const defaultBody: Body = {
  buyer: 0,
  groupOfBuyer: 0,
  paid: BigInt(0),
  par: BigInt(0),
  state: 0,
  para: 0,
  argu: 0,
  flag: false,
};

const defaultDeal: Deal = {
  head: defaultHead,
  body: defaultBody,
  hashLock: Bytes32Zero,
};

export const TypeOfDeal = [
  'CapitalIncrease', 
  'ShareTransfer(External)', 
  'ShareTransfer(Internal)', 
  'PreEmptive', 
  'TagAlong', 
  'DragAlong', 
  'FirstRefusal', 
  'FreeGift'
];

export const TypeOfIa = [
  'NaN',
  'CapitalIncrease',
  'ShareTransfer(External)',
  'ShareTransfer(Internal)',
  'CI & STint',
  'SText & STint',
  'CI & SText & STint',
  'CI & SText'
]

export const StateOfDeal = [
  'Drafting',
  'Locked',
  'Cleared',
  'Closed',
  'Terminated'
];

export function codifyHeadOfDeal(head: Head): HexType {
  let hexSn:HexType = `0x${
    (head.typeOfDeal.toString(16).padStart(2, '0')) +
    (head.seqOfDeal.toString(16).padStart(4, '0')) +
    (head.preSeq.toString(16).padStart(4, '0')) +
    (head.classOfShare.toString(16).padStart(4, '0')) +
    (head.seqOfShare.toString(16).padStart(8, '0')) +
    (head.seller.toString(16).padStart(10, '0')) +
    (head.priceOfPaid.toString(16).padStart(8, '0')) +
    (head.priceOfPar.toString(16).padStart(8, '0')) +
    (head.closingDeadline.toString(16).padStart(12, '0')) + 
    '0000'
  }`;
  return hexSn;
}

interface CreateDealProps{
  ia: HexType;
  refreshDealsList: ()=>void;
}

export function CreateDeal({ia, refreshDealsList}: CreateDealProps) {

  const { boox } = useComBooxContext();

  const [ head, setHead ] = useState<Head>(defaultHead);
  const [ body, setBody ] = useState<Body>(defaultBody);

  const {
    isLoading: addDealLoading,
    write: addDeal,
  } = useInvestmentAgreementAddDeal({
    address: ia,
    args: [ codifyHeadOfDeal(head),
            BigInt(body.buyer),
            BigInt(body.groupOfBuyer),
            body.paid,
            body.par            
          ],
    onSuccess() {
      refreshDealsList()
    }
  });

  const handleSeqChanged = (e:ChangeEvent<HTMLInputElement>)=> {

    let seq = parseInt(e.target.value ?? '0');

    if (seq > 0 && boox) {
      getShare(boox[10], seq).then(
        res => {
          if (res)
            setHead(v => ({
              ...v,
              classOfShare: res.head.class,
              seqOfShare: seq,
              seller: res.head.shareholder,
            }));
        }
      )   
    }

  }


  return (
    <Paper elevation={3} sx={{p:1, m:1, border: 1, borderColor:'divider' }} >

      {/* <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >         */}
        {/* <Box sx={{ minWidth:600 }} > */}
          <Toolbar sx={{ textDecoration:'underline' }}>
            <h4>Create Deal</h4>
          </Toolbar>
        {/* </Box> */}
        
        {/* <SetTypeOfIa ia={ia} /> */}

      {/* </Stack> */}

      {/* <Divider sx={{ m:1 }} flexItem /> */}

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
                  typeOfDeal: parseInt(e.target.value.toString()),
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
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={ handleSeqChanged }
              value={ head.seqOfShare.toString() } 
            />

            <TextField 
              variant='outlined'
              size="small"
              label='ClassOfShare'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                classOfShare: parseInt(e.target.value),
                }))
              }
              value={ head.classOfShare }
            />


            <TextField 
              variant='outlined'
              size="small"
              label='PriceOfPaid'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                priceOfPaid: parseInt(e.target.value),
              }))}
              value={ head.priceOfPaid }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='PriceOfPar'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                priceOfPar: parseInt(e.target.value),
              }))}
              value={ head.priceOfPar }
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
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                buyer: parseInt(e.target.value),
                }))
              }
              value={ body.buyer }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='GroupOfBuyer'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                groupOfBuyer: parseInt(e.target.value),
                }))
              }
              value={ body.groupOfBuyer }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='QtyOfPaid'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                paid: BigInt(e.target.value),
                }))
              }
              value={ body.paid.toString() }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='QtyOfPar'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                par: BigInt(e.target.value),
                }))
              }
              value={ body.par.toString() }
            />

          </Stack>

        </Stack>

        <Divider orientation="vertical" sx={{ m:1 }} flexItem />

        <Button 
          disabled = {!addDeal || addDealLoading}
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



