import { useState, useEffect } from 'react';

import { 
  TextField, 
  Paper,
  Stack,
  Divider,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';

import { AddCircle, ArrowDownward, ArrowUpward, RemoveCircle }  from '@mui/icons-material';


import { useRegisterOfSharesIssueShare, useRegisterOfSharesDecreaseCapital } from '../../../generated';

import { HexType, MaxData, MaxPrice, MaxSeqNo, MaxUserNo, booxMap } from '../../../scripts/common';

import { useComBooxContext } from '../../../scripts/common/ComBooxContext';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';

import { SharesList } from './SharesList';
import { Share, StrShare, codifyHeadOfStrShare, defStrShare, getSharesList, } from '../../../scripts/comp/ros';
import { FormResults, defFormResults, hasError, onlyInt, onlyNum, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { InitCompProps } from '../gk/SetCompInfo';
import { LoadingButton } from '@mui/lab';

export function InitBos({nextStep}: InitCompProps) {
  const { boox } = useComBooxContext();

  const [sharesList, setSharesList] = useState<readonly Share[]>();
  const [share, setShare] = useState<StrShare>(defStrShare);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [time, setTime] = useState(0);

  const [ loadingAdd, setLoadingAdd ] = useState<boolean>(false);
  const refreshAdd = () => {
    setTime(Date.now());
    setLoadingAdd(false);
  }

  const {
    isLoading: issueShareLoading,
    write: issueShare,
  } = useRegisterOfSharesIssueShare({
    address: boox ? boox[booxMap.ROS] : undefined,
    args: share.body.payInDeadline && share.body.paid &&
          share.body.par 
      ? [ 
          codifyHeadOfStrShare(share.head),
          BigInt((share.body.payInDeadline ?? 0)),
          BigInt((Number(share.body.paid) ?? 0) * 100),
          BigInt((Number(share.body.par) ?? 0) * 100)
        ] 
      : undefined,
    onSuccess(data) {
      setLoadingAdd(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refreshAdd);
    }    
  });

  const [ loadingRemove, setLoadingRemove ] = useState<boolean>(false);
  const refreshRemove = () => {
    setTime(Date.now());
    setLoadingRemove(false);
  }

  const {
    isLoading: delShareLoading,
    write: delShare
  } = useRegisterOfSharesDecreaseCapital({
    address: boox ? boox[booxMap.ROS] : undefined,
    args: share.head.seqOfShare && share.body.paid && 
          share.body.par
        ? [ 
            BigInt(share.head.seqOfShare ?? 0), 
            BigInt((Number(share.body.paid) ?? 0)* 100), 
            BigInt((Number(share.body.par) ?? 0) * 100) 
          ]
        : undefined,
    onSuccess(data) {
      setLoadingRemove(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refreshRemove);
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

            <LoadingButton
              sx={{m:1, mx:3, px:3, py:1}}
              variant='contained'
              startIcon={<AddCircle />}
              loading={loadingAdd}
              loadingPosition='start'
              disabled={!issueShare || issueShareLoading || hasError(valid) }
              onClick={()=>issueShare?.()}
              size="small"
            >
              Add Share
            </LoadingButton>

            <Divider orientation='vertical' sx={{m:2}} flexItem />

            <Stack direction={'column'} sx={{m:1, p:1, justifyContent:'center'}}>

              <Stack direction={'row'} sx={{alignItems:'center' }}>

                <TextField 
                  sx={{ m: 1, width: 188 }} 
                  id="tfClass" 
                  label="ClassOfShare" 
                  variant="outlined"
                  error={ valid['ClassOfShare']?.error }
                  helperText={ valid['ClassOfShare']?.helpTx ?? ' ' }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyInt('ClassOfShare', input, MaxSeqNo, setValid);
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
                  helperText={ valid['Shareholder']?.helpTx ?? ' ' }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyInt('Shareholder', input, MaxUserNo, setValid);
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
                  label="PriceOfPaid" 
                  variant="outlined"
                  error={ valid['PriceOfPaid']?.error }
                  helperText={ valid['PriceOfPaid']?.helpTx ?? ' ' }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('PriceOfPaid', input, MaxPrice, 2, setValid);
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
                  label="PriceOfPar" 
                  variant="outlined"
                  error={ valid['PriceOfPar']?.error }
                  helperText={ valid['PriceOfPar']?.helpTx ?? ' ' }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('PriceOfPar', input, MaxPrice, 2, setValid);
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

                <TextField
                  variant="outlined"
                  label="SeqOfShare"
                  color='warning'
                  error={ valid['SeqOfShare']?.error }
                  helperText={ valid['SeqOfShare']?.helpTx ?? ' ' }
                  sx={{
                    m:1,
                    width: 188
                  }}
                  onChange={(e)=>{
                    let input = e.target.value;
                    onlyInt('SeqOfShare', input, MaxPrice, setValid);
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

              </Stack>

              <Stack direction={'row'} sx={{alignItems:'center' }}>

                <DateTimeField
                  label='IssueDate'
                  helperText=' '
                  sx={{m:1, width:188 }}
                  value={ dayjs.unix(share.head.issueDate) }
                  onChange={(date) => setShare((v) => ({
                    head: {
                      ...v.head,
                      issueDate: date ? date.unix() : 0 ,
                    },
                    body: v.body,
                  }))}
                  format='YYYY-MM-DD HH:mm:ss'
                  size='small'
                />

                <DateTimeField
                  label='PayInDeadline'
                  helperText=' '
                  sx={{m:1, width:188 }}
                  value={ dayjs.unix(share.body.payInDeadline) }
                  onChange={(date) => setShare((v) => ({
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
                  sx={{ m: 1, width: 188 }} 
                  id="tfPaid" 
                  label="Paid" 
                  variant="outlined"
                  color='warning'
                  error={ valid['Paid']?.error }
                  helperText={ valid['Paid']?.helpTx ?? ' ' }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('Paid', input, MaxData, 2, setValid);
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
                  label="Par" 
                  variant="outlined"
                  color='warning'
                  error={ valid['Par']?.error }
                  helperText={ valid['Par']?.helpTx ?? ' ' }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyNum('Par', input, MaxData, 2, setValid);
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
                  helperText={ valid['VotingWeight']?.helpTx ?? ' ' }
                  onChange={(e) => {
                    let input = e.target.value;
                    onlyInt('VotingWeight', input, MaxSeqNo, setValid);
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

              <LoadingButton
                sx={{m:1, p:1}}
                variant='contained'
                loading={ loadingRemove }
                loadingPosition='end'
                endIcon={<RemoveCircle />}
                disabled={ !delShare || delShareLoading || hasError(valid) }
                onClick={()=>delShare?.()}
                size="small"
              >
                Remove Share
              </LoadingButton>

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
