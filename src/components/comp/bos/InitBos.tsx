import { useState, useEffect } from 'react';

import { 
  TextField, 
  Button,
  Paper,
  Stack,
  Divider,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';

import { AddCircle, ArrowDownward, ArrowUpward, RemoveCircle }  from '@mui/icons-material';


import {
  useBookOfSharesIssueShare,
  useBookOfSharesDecreaseCapital,
} from '../../../generated';


import { Bytes32Zero } from '../../../interfaces';

import { useComBooxContext } from '../../../scripts/ComBooxContext';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { SharesList } from './SharesList';
import { Share, codifyHeadOfShare, getSharesList, } from '../../../queries/bos';
import { getShareNumbersList } from '../../../queries/bom';


const defaultShare: Share = {
  sn: Bytes32Zero,
  head: {
    seqOfShare: 0,
    preSeq: 0,
    class: 1,
    issueDate: 0,
    shareholder: 0,
    priceOfPaid: 100,
    priceOfPar: 100,
  },
  body: {
    payInDeadline: 0,
    paid: BigInt(0),
    par: BigInt(0),
    cleanPaid: BigInt(0),
    state: 0,
  },
}

interface InitBosProps {
  nextStep: (next: number) => void;
}

export function InitBos({nextStep}: InitBosProps) {
  const { boox } = useComBooxContext();

  const [sharesList, setSharesList] = useState<Share[]>();
  const [share, setShare] = useState<Share>(defaultShare);

  const {
    isLoading: issueShareLoading,
    write: issueShare,
  } = useBookOfSharesIssueShare({
    address: boox ? boox[10] : undefined,
    args: share.head.class && share.head.issueDate &&
          share.head.shareholder && share.head.priceOfPaid && 
          share.head.priceOfPar && share.body.payInDeadline &&
          share.body.paid && share.body.par 
      ? [ codifyHeadOfShare(share.head),
          BigInt(share.body.payInDeadline),
          share.body.paid,
          share.body.par  ] 
      : undefined,
  });

  const {
    isLoading: delShareLoading,
    write: delShare
  } = useBookOfSharesDecreaseCapital({
    address: boox ? boox[10] : undefined,
    args: share.head.seqOfShare > 0
        ? [ BigInt(share.head.seqOfShare), 
            share.body.paid, 
            share.body.par ]
        : undefined,
  })

  


  useEffect(()=>{
    if (boox) {
      getShareNumbersList(boox[4]).then(
        list => getSharesList(boox[10], list).then(
            ls => setSharesList(ls)
      ))
    }
  }, [boox, issueShare, delShare]);

  return (

    <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }} >

      <Stack direction='row' sx={{alignItems:'start', justifyContent:'start', alignContent:'start'}}>

        <Stack direction='column' sx={{ height:'100%' }} >

          <Tooltip title='Prev Step' placement='left' arrow >
            <IconButton
              size='large'
              color='primary'
              onClick={()=>nextStep(1)}
            >
              <ArrowUpward />
            </IconButton>
          </Tooltip>

          <Divider flexItem />

          <Tooltip title='Next Step' placement='left' arrow >

            <IconButton
              size='large'
              color='primary'
              onClick={()=>nextStep(3)}
            >
              <ArrowDownward />
            </IconButton>

          </Tooltip>

        </Stack>

        <Divider sx={{m:1}} orientation='vertical' flexItem />

        <Stack direction='column' sx={{m:1, alignItems:'start', justifyItems:'start'}} >    

          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }} >
            <b>Book Of Shares</b>
          </Typography>
          
          <Stack direction={'row'} sx={{ alignItems:'center' }} >

            <Button
              sx={{m:1, mx:3, px:3, py:1}}
              variant='contained'
              startIcon={<AddCircle />}
              disabled={!issueShare || issueShareLoading}
              onClick={()=>issueShare?.()}
              size="small"
            >
              Add Share
            </Button>

            <Divider orientation='vertical' sx={{m:2}} flexItem />

            <Stack direction={'column'} sx={{m:1, p:1, justifyContent:'center'}}>

              <Stack direction={'row'} sx={{alignItems:'center' }}>

                <TextField 
                  sx={{ m: 1, minWidth: 120 }} 
                  id="tfClass" 
                  label="ClassOfShare" 
                  variant="outlined"
                  helperText="Integer < 2^16 (e.g. '5')"
                  onChange={(e) => {
                    setShare(v => ({
                      sn: v.sn,
                      head: {
                        ...v.head,
                        class: parseInt(e.target.value),
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.class}
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, minWidth: 120 }} 
                  id="tfShareholder" 
                  label="Shareholder" 
                  variant="outlined"
                  helperText="Integer < 2^40 (e.g. '12345')"
                  onChange={(e) => {
                    setShare(v => ({
                      sn: v.sn,
                      head: {
                        ...v.head,
                        shareholder: parseInt(e.target.value), 
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.shareholder}
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, minWidth: 120 }} 
                  id="tfPriceOfPaid" 
                  label="PriceOfPaid" 
                  variant="outlined"
                  helperText="Integer < 2^32 (e.g. '12345')"
                  onChange={(e) => {
                    setShare(v => ({
                      sn: v.sn,
                      head: {
                        ...v.head,
                        priceOfPaid: parseInt(e.target.value),
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.priceOfPaid}
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, minWidth: 120 }} 
                  id="tfPriceOfPar" 
                  label="PriceOfPar" 
                  variant="outlined"
                  helperText="Integer < 2^32 (e.g. '12345')"
                  onChange={(e) => {
                    setShare(v => ({
                      sn: v.sn,
                      head: {
                        ...v.head,
                        priceOfPar: parseInt(e.target.value),
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.priceOfPar}
                  size='small'
                />

              </Stack>

              <Stack direction={'row'} sx={{alignItems:'center' }}>

                <DateTimeField
                  label='IssueDate'
                  sx={{m:1}}
                  helperText="Date & Time in UTC"
                  value={ dayjs.unix(share.head.issueDate) }
                  onChange={(date) => setShare((v) => ({
                    sn: v.sn,
                    head: {
                      ...v.head,
                      issueDate: date ? date.unix() : 0,
                    },
                    body: v.body,
                  }))}
                  format='YYYY-MM-DD HH:mm:ss'
                  size='small'
                />

                <DateTimeField
                  label='PayInDeadline'
                  helperText="Date & Time in UTC"
                  sx={{m:1}}
                  value={ dayjs.unix(share.body.payInDeadline) }
                  onChange={(date) => setShare((v) => ({
                    sn: v.sn,
                    head: v.head,
                    body: {
                      ...v.body,
                      payInDeadline: date ? date.unix() : 0,
                    },
                  }))}
                  format='YYYY-MM-DD HH:mm:ss'
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, minWidth: 120 }} 
                  id="tfPaidAmount" 
                  label="PaidAmount" 
                  variant="outlined"
                  helperText="Number < 2^64 (e.g. '18000')"
                  onChange={(e) => {
                    setShare(v => ({
                      sn: v.sn,
                      head: v.head,
                      body: {
                        ...v.body,
                        paid: BigInt(e.target.value),
                      },
                    }));
                  }}
                  value = {share.body.paid.toString()}
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, minWidth: 120 }} 
                  id="tfPar" 
                  label="ParAmount" 
                  variant="outlined"
                  helperText="Number < 2^64 (e.g, '18000')"
                  onChange={(e) => {
                    setShare(v => ({
                      sn: v.sn,
                      head: v.head,
                      body: {
                        ...v.body,
                        par: BigInt(e.target.value),
                      },
                    }));
                  }}
                  value = {share.body.par.toString()}
                  size='small'
                />

              </Stack>

            </Stack>

            <Divider orientation='vertical' sx={{m:2}} flexItem />

            <Stack direction='row' sx={{m:1, p:1, alignItems:'center'}}>

              <TextField
                variant="outlined"
                label="SeqOfShare"
                sx={{
                  m:1,
                  minWidth: 218
                }}
                onChange={(e)=>setShare(v => ({
                  ...v,
                  head: {
                    ...v.head,
                    seqOfShare: parseInt(e.target.value),
                  }
                }))}
                value={ share.head.seqOfShare.toString() }
                size='small'
              />

              <Button
                sx={{m:1, p:1}}
                variant='contained'
                endIcon={<RemoveCircle />}
                disabled={ !delShare || delShareLoading }
                onClick={()=>delShare?.()}
                size="small"
              >
                Remove Share
              </Button>

            </Stack>


          </Stack>
          
          <Divider sx={{m:1, width:'100%'}} />

          {sharesList && (
            <SharesList list={sharesList} setShare={()=>{}} setOpen={(flag: boolean)=>{}} />
          )}

        </Stack>

      </Stack>

    </Paper>

  )
}
