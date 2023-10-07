import { ChangeEvent, useState } from "react";

import { HexType, booxMap } from "../../../../scripts/common";

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
import { Body, Head, TypeOfDeal, defaultBody, defaultHead } from "../../../../scripts/comp/ia";
import { getShare } from "../../../../scripts/comp/ros";

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
    (head.votingWeight.toString(16).padStart(4, '0'))
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
      getShare(boox[booxMap.ROS], seq).then(
        res => {
          if (res)
            setHead(v => ({
              ...v,
              classOfShare: res.head.class,
              seqOfShare: seq,
              seller: res.head.shareholder,
              votingWeight: res.head.votingWeight,
            }));
        }
      )
    } else {
      setHead(v => ({
        ...v,
        classOfShare: 0,
        seqOfShare: 0,
        seller: 0,
        votingWeight: 100,
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
              label='PriceOfPar (Cent)'
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


            <TextField 
              variant='outlined'
              size="small"
              label='PriceOfPaid (Cent)'
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
                buyer: parseInt(e.target.value ?? '0'),
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
                groupOfBuyer: parseInt(e.target.value ?? '0'),
                }))
              }
              value={ body.groupOfBuyer }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='Par (Cent)'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                par: BigInt(e.target.value ?? '0'),
                }))
              }
              value={ body.par.toString() }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='Paid (Cent)'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setBody((v) => ({
                ...v,
                paid: BigInt(e.target.value ?? '0'),
                }))
              }
              value={ body.paid.toString() }
            />

            <TextField 
              variant='outlined'
              size="small"
              label='VotingWeight (%)'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setHead((v) => ({
                ...v,
                votingWeight: parseInt(e.target.value ?? '0'),
                }))
              }
              value={ head.votingWeight.toString() }
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



