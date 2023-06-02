import { useState, useEffect } from 'react';

import { 
  Grid,
  Box, 
  TextField, 
  Button,
} from '@mui/material';

import { ArrowBack, ArrowForward, Send }  from '@mui/icons-material';

import Link from '../../../scripts/Link';

import {
  useGeneralKeeperGetKeeper,
  useRegisterOfMembersSharesList,
  usePrepareBookOfSharesIssueShare,
  useBookOfSharesIssueShare,
  usePrepareBookOfSharesSetDirectKeeper,
  useBookOfSharesSetDirectKeeper,
  usePrepareRegisterOfMembersSetDirectKeeper,
  useRegisterOfMembersSetDirectKeeper,
} from '../../../generated';

import { BigNumber } from 'ethers';

import { HexType } from '../../../interfaces';

import { DataList } from '../../../components';

import { useComBooxContext } from '../../../scripts/ComBooxContext';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';


export interface ShareArgs {
  class: number,
  issueDate: number,
  shareholder: number,
  priceOfPaid: number,
  priceOfPar: number,
  payInDeadline: number,
  paid: string,
  par: string,
}

const defaultShareArgs: ShareArgs = {
  class: 1,
  issueDate: 0,
  shareholder: 0,
  priceOfPaid: 100,
  priceOfPar: 100,
  payInDeadline: 0,
  paid: '0',
  par: '0',
}

function InitBosPage() {
  const { gk, boox } = useComBooxContext();

  const [sharesList, setSharesList] = useState<readonly HexType[]>();

  const [shareArgs, setShareArgs] = useState<ShareArgs>(defaultShareArgs);

  const {
    data: romKeeper
  } = useGeneralKeeperGetKeeper({
    address: gk,
    args: [BigNumber.from(8)],
  })

  const {
    refetch: refetchSharesList
  } = useRegisterOfMembersSharesList({
    address: boox[8],
    onSuccess(ls) {
      setSharesList(ls);
    }
  });

  const {
    data: bosKeeper
  } = useGeneralKeeperGetKeeper({
    address: gk,
    args: [BigNumber.from(7)],
  })

  const {
    config
  } = usePrepareBookOfSharesIssueShare({
    address: boox[7],
    args: shareArgs?.class &&
      shareArgs?.issueDate &&
      shareArgs?.shareholder && 
      shareArgs?.priceOfPaid && 
      shareArgs?.priceOfPar && 
      shareArgs?.payInDeadline &&
      shareArgs?.paid &&
      shareArgs?.par ? 
        [
          `0x${'0'.padEnd(16, '0') + 
            shareArgs.class.toString(16).padStart(4, '0') + 
            shareArgs.issueDate.toString(16).padStart(12, '0') + 
            shareArgs.shareholder.toString(16).padStart(10, '0') + 
            shareArgs.priceOfPaid.toString(16).padStart(8, '0') + 
            shareArgs.priceOfPar.toString(16).padStart(8, '0') +
            '0'.padEnd(6, '0')
          }`,
          BigNumber.from(shareArgs.payInDeadline),
          BigNumber.from(shareArgs.paid),
          BigNumber.from(shareArgs.par)
        ] :
        undefined,
  });

  const {
    isLoading,
    write
  } = useBookOfSharesIssueShare({
    ...config,
    onSuccess() {
      refetchSharesList();
    }
  });

  const {
    config: romSetDKConfig,
  } = usePrepareRegisterOfMembersSetDirectKeeper({
    address: boox[8],
    args: romKeeper ? [ romKeeper ] : undefined,
  });

  const {
    isLoading: romSetDKIsLoading,
    write: setRomDK,
  } = useRegisterOfMembersSetDirectKeeper(romSetDKConfig);

  const {
    config: bosSetDKConfig,
  } = usePrepareBookOfSharesSetDirectKeeper({
    address: boox[7],
    args: bosKeeper ? [ bosKeeper ] : undefined,
  });

  const {
    isLoading: bosSetDKIsLoading,
    write: setBosDK
  } = useBookOfSharesSetDirectKeeper(bosSetDKConfig);


  return (
    <>
      <br />
      <br />
      <br />
      <br />

      <Grid 
        container 
        direction='row'
        justifyContent='center'
        alignItems='flex-end'
        spacing={1}
      >

        <Grid item xs={4}>
          <Box sx={{
            border: 1,
            boxShadow: 2,
            borderRadius: 1,
            p: 1,
          }} >

            <h2> Initiate BookOfShares</h2>

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfClass" 
              label="ClassOfShare" 
              variant="outlined"
              helperText="Integer < 2^16 (e.g. '5')"
              onChange={(e) => {
                setShareArgs(v => ({
                  ...v,
                  class: parseInt(e.target.value),
                }));
              }}

              value = {shareArgs?.class}
              size='small'
            />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfShareholder" 
              label="Shareholder" 
              variant="outlined"
              helperText="Integer < 2^40 (e.g. '12345')"
              onChange={(e) => {
                setShareArgs(v => ({
                  ...v,
                  shareholder: parseInt(e.target.value),
                }));
              }}

              value = {shareArgs?.shareholder}
              size='small'
            />

            <br />

            <DateTimeField
              label='IssueDateOfShare'
              sx={{m:1}}
              value={ dayjs.unix(shareArgs?.issueDate) }
              onChange={(date) => setShareArgs((v) => ({
                ...v,
                issueDate: date ? date.unix() : 0,
              }))}
              format='YYYY-MM-DD HH:mm:ss'
              size='small'
            />

            <DateTimeField
              label='PayInDeadline'
              sx={{m:1}}
              value={ dayjs.unix(shareArgs?.payInDeadline) }
              onChange={(date) => setShareArgs((v) => ({
                ...v,
                payInDeadline: date ? date.unix() : 0,
              }))}
              format='YYYY-MM-DD HH:mm:ss'
              size='small'
            />

            <br />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfPriceOfPaid" 
              label="PriceOfPaid" 
              variant="outlined"
              helperText="Integer < 2^32 (e.g. '12345')"
              onChange={(e) => {
                setShareArgs(v => ({
                  ...v,
                  priceOfPaid: parseInt(e.target.value),
                }));
              }}

              value = {shareArgs?.priceOfPaid}
              size='small'
            />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfPriceOfPar" 
              label="PriceOfPar" 
              variant="outlined"
              helperText="Integer < 2^32 (e.g. '12345')"
              onChange={(e) => {
                setShareArgs(v => ({
                  ...v,
                  priceOfPar: parseInt(e.target.value),
                }));
              }}

              value = {shareArgs?.priceOfPar}
              size='small'
            />

            <br />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfPaidAmount" 
              label="PaidAmount" 
              variant="outlined"
              helperText="Number < 2^64 (e.g. '18000')"
              onChange={(e) => {
                setShareArgs(v => ({
                  ...v,
                  paid: e.target.value,
                }));
              }}

              value = {shareArgs?.paid}
              size='small'
            />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfPar" 
              label="ParAmount" 
              variant="outlined"
              helperText="Number < 2^64 (e.g, '18000')"
              onChange={(e) => {
                setShareArgs(v => ({
                  ...v,
                  par: e.target.value,
                }));
              }}

              value = {shareArgs?.par}
              size='small'
            />

            <hr />

            <Button 
              disabled = {!write || isLoading}

              sx={{ m: 1, minWidth: 120, height: 40 }} 
              variant="contained" 
              endIcon={<Send />}
              onClick={()=> write?.()}
              size='small'
            >
              Issue
            </Button>

          </Box>
        </Grid>

        <Grid item xs={6} >
          <Box sx={{
            border: 1,
            boxShadow: 2,
            borderRadius: 1,
            p: 1,
            minHeight: 462,            
          }}>
            {sharesList && (
              <div>
                <h2>Shares List</h2>
                <hr />
                <DataList isOrdered={true} data={sharesList} />
                <br  />
              </div>
            )}
          </Box>
        
        </Grid>

        <br />

      </Grid>

      <hr />

      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='flex-end'
        spacing={1}
      >
        <Grid item>
          <Link
            href={{
              pathname: './setMaxQtyOfMembers',
            }}

            as = './setMaxQtyOfMembers'
            
            variant='button'

            underline='hover'
          >

            <Button
              variant="contained"
              sx={{
                height: 40,
                m: 1,
                mr: 10,
              }}
              startIcon={ <ArrowBack /> }
            >
              Prev
            </Button>

          </Link>          

        </Grid>

        <Grid item >
          <Button 
            disabled = {!setRomDK || romSetDKIsLoading }

            sx={{ m: 1, minWidth: 120, height: 40 }} 

            variant="outlined" 

            onClick={() => { 
              setRomDK?.(); 
            }}

            size='small'
          >
            Set ROM Keeper
          </Button>
        </Grid>

        <Grid item>
          <Button 
            disabled = {!setBosDK || bosSetDKIsLoading }

            sx={{ m: 1, minWidth: 120, height: 40 }} 

            variant="outlined" 

            onClick={()=> {
              setBosDK?.();
            }}

            size='small'
          >
            Set BOS Keeper
          </Button>
        </Grid>

        <Grid item >

          <Link
            href={{
              pathname: '../mainPage',
            }}

            as = '../mainPage'
            
            variant='button'

            underline='hover'
          >

            <Button
              variant="contained"
              sx={{
                height: 40,
                m: 1,
                ml: 10,
              }}
              endIcon={ <ArrowForward /> }
            >
              Finish
            </Button>

          </Link>

        </Grid>

      </Grid>

      <br />
      

      {`        `}


    </>    
  )
}

export default InitBosPage