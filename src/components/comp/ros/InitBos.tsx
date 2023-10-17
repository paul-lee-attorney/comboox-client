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
  useRegisterOfSharesIssueShare,
  useRegisterOfSharesDecreaseCapital,
} from '../../../generated';


import { HexType, MaxData, MaxPrice, MaxSeqNo, MaxUserNo, booxMap } from '../../../scripts/common';

import { useComBooxContext } from '../../../scripts/common/ComBooxContext';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { SharesList } from './SharesList';
import { Share, StrShare, codifyHeadOfStrShare, defStrShare, getSharesList, } from '../../../scripts/comp/ros';
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { InitCompProps } from '../gk/SetCompInfo';


const defaultShare: Share = {
  head: {
    seqOfShare: 0,
    preSeq: 0,
    class: 1,
    issueDate: 0,
    shareholder: 0,
    priceOfPaid: 100,
    priceOfPar: 100,
    votingWeight: 100,
  },
  body: {
    payInDeadline: 0,
    paid: BigInt(0),
    par: BigInt(0),
    cleanPaid: BigInt(0),
    state: 0,
  },
}

export function InitBos({nextStep}: InitCompProps) {
  const { boox } = useComBooxContext();

  const [sharesList, setSharesList] = useState<readonly Share[]>();
  const [share, setShare] = useState<StrShare>(defStrShare);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  
  const [time, setTime] = useState(0);

  const refresh = () => {
    setTime(Date.now());
  }

  const {
    isLoading: issueShareLoading,
    write: issueShare,
  } = useRegisterOfSharesIssueShare({
    address: boox ? boox[booxMap.ROS] : undefined,
    args: share.head.class && share.head.issueDate &&
          share.head.shareholder && share.head.priceOfPaid && 
          share.head.priceOfPar && share.body.payInDeadline &&
          share.body.paid && share.body.par && share.head.votingWeight
      ? [ codifyHeadOfStrShare(share.head),
          BigInt(share.body.payInDeadline),
          BigInt(share.body.paid),
          BigInt(share.body.par)  ] 
      : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }    
  });
  
  const {
    isLoading: delShareLoading,
    write: delShare
  } = useRegisterOfSharesDecreaseCapital({
    address: boox ? boox[booxMap.ROS] : undefined,
    args: Number(share.head.seqOfShare) > 0
        ? [ BigInt(share.head.seqOfShare), 
            BigInt(share.body.paid), 
            BigInt(share.body.par) ]
        : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }    
  });

  useEffect(()=>{
    if (boox) {
      getSharesList(boox[booxMap.ROS]).then(
          ls => setSharesList(ls)
      )
    }
  }, [boox, time]);

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
            <b>Register Of Shares</b>
          </Typography>
          
          <Stack direction={'row'} sx={{ alignItems:'center' }} >

            <Button
              sx={{m:1, mx:3, px:3, py:1}}
              variant='contained'
              startIcon={<AddCircle />}
              disabled={!issueShare || issueShareLoading || hasError(valid) }
              onClick={()=>issueShare?.()}
              size="small"
            >
              Add Share
            </Button>

            <Divider orientation='vertical' sx={{m:2}} flexItem />

            <Stack direction={'column'} sx={{m:1, p:1, justifyContent:'center'}}>

              <Stack direction={'row'} sx={{alignItems:'center' }}>

                <TextField 
                  sx={{ m: 1, width: 188 }} 
                  id="tfClass" 
                  label="ClassOfShare" 
                  variant="outlined"
                  error={ valid['ClassOfShare']?.error }
                  helperText={ valid['ClassOfShare']?.helpTx }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('ClassOfShare', input, MaxSeqNo, setValid);
                    setShare(v => ({
                      head: {
                        ...v.head,
                        class: input,
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.class}
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, width: 188 }} 
                  id="tfShareholder" 
                  label="Shareholder" 
                  variant="outlined"
                  error={ valid['Shareholder']?.error }
                  helperText={ valid['Shareholder']?.helpTx }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('Shareholder', input, MaxUserNo, setValid);
                    setShare(v => ({
                      head: {
                        ...v.head,
                        shareholder: input, 
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.shareholder}
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, width: 188 }} 
                  id="tfPriceOfPaid" 
                  label="PriceOfPaid (Cent)" 
                  variant="outlined"
                  error={ valid['PriceOfPaid']?.error }
                  helperText={ valid['PriceOfPaid']?.helpTx }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('PriceOfPaid', input, MaxPrice, setValid);
                    setShare(v => ({
                      head: {
                        ...v.head,
                        priceOfPaid: input,
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.priceOfPaid }
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, width: 188 }} 
                  id="tfPriceOfPar" 
                  label="PriceOfPar (Cent)" 
                  variant="outlined"
                  error={ valid['PriceOfPar']?.error }
                  helperText={ valid['PriceOfPar']?.helpTx }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('PriceOfPar', input, MaxPrice, setValid);
                    setShare(v => ({
                      head: {
                        ...v.head,
                        priceOfPar: input,
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.priceOfPar }
                  size='small'
                />

              </Stack>

              <Stack direction={'row'} sx={{alignItems:'center' }}>

                <DateTimeField
                  label='IssueDate'
                  sx={{m:1, width:188 }}
                  value={ dayjs.unix(Number(share.head.issueDate)) }
                  onChange={(date) => setShare((v) => ({
                    head: {
                      ...v.head,
                      issueDate: date ? date.unix().toString() : '0',
                    },
                    body: v.body,
                  }))}
                  format='YYYY-MM-DD HH:mm:ss'
                  size='small'
                />

                <DateTimeField
                  label='PayInDeadline'
                  sx={{m:1, width:188 }}
                  value={ dayjs.unix(Number(share.body.payInDeadline)) }
                  onChange={(date) => setShare((v) => ({
                    head: v.head,
                    body: {
                      ...v.body,
                      payInDeadline: date ? date.unix().toString() : '0',
                    },
                  }))}
                  format='YYYY-MM-DD HH:mm:ss'
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, width: 188 }} 
                  id="tfPaid" 
                  label="Paid (Cent)" 
                  variant="outlined"
                  error={ valid['Paid']?.error }
                  helperText={ valid['Paid']?.helpTx }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('Paid', input, MaxData, setValid);
                    setShare(v => ({
                      head: v.head,
                      body: {
                        ...v.body,
                        paid: input,
                      },
                    }));
                  }}
                  value = {share.body.paid}
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, width: 188 }} 
                  id="tfPar" 
                  label="Par (Cent)" 
                  variant="outlined"
                  error={ valid['Par']?.error }
                  helperText={ valid['Par']?.helpTx }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('Par', input, MaxData, setValid);
                    setShare(v => ({
                      head: v.head,
                      body: {
                        ...v.body,
                        par: input,
                      },
                    }));
                  }}
                  value = {share.body.par}
                  size='small'
                />

                <TextField 
                  sx={{ m: 1, width: 188 }} 
                  id="tfVotingWeight" 
                  label="VotingWeight (%)" 
                  variant="outlined"
                  error={ valid['VotingWeight']?.error }
                  helperText={ valid['VotingWeight']?.helpTx }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('VotingWeight', input, MaxSeqNo, setValid);
                    setShare(v => ({
                      head: {
                        ...v.head,
                        votingWeight: input,
                      },
                      body: v.body,
                    }));
                  }}
                  value = {share.head.votingWeight}
                  size='small'
                />

              </Stack>

            </Stack>

            <Divider orientation='vertical' sx={{m:2}} flexItem />

            <Stack direction='row' sx={{m:1, p:1, alignItems:'center'}}>

              <TextField
                variant="outlined"
                label="SeqOfShare"
                error={ valid['SeqOfShare']?.error }
                helperText={ valid['SeqOfShare']?.helpTx }
                sx={{
                  m:1,
                  width: 188
                }}
                onChange={(e)=>{
                  let input = e.target.value;
                  onlyNum('SeqOfShare', input, MaxPrice, setValid);
                  setShare(v => ({
                    ...v,
                    head: {
                      ...v.head,
                      seqOfShare: input,
                    }
                  }));
                }}
                value={ share.head.seqOfShare }
                size='small'
              />

              <Button
                sx={{m:1, p:1}}
                variant='contained'
                endIcon={<RemoveCircle />}
                disabled={ !delShare || delShareLoading || hasError(valid) }
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
