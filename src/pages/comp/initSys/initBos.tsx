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

type ShareArgsType = {
  class?: string | undefined,
  issueDate?: string | undefined,
  shareholder?: string | undefined,
  priceOfPaid?: string | undefined,
  priceOfPar?: string | undefined,  
  payInDeadline?: string | undefined,
  paid?: string | undefined,
  par?: string | undefined,  
}

function InitBosPage() {
  const { gk, boox } = useComBooxContext();

  const [sharesList, setSharesList] = useState<readonly HexType[]>();

  const [shareArgs, setShareArgs] = useState<ShareArgsType>();

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
            parseInt(shareArgs.class).toString(16).padStart(4, '0') + 
            BigNumber.from(shareArgs.issueDate).toHexString().substring(2).padStart(12, '0') + 
            BigNumber.from(shareArgs.shareholder).toHexString().substring(2).padStart(10, '0') + 
            BigNumber.from(shareArgs.priceOfPaid).toHexString().substring(2).padStart(8, '0') + 
            BigNumber.from(shareArgs.priceOfPar).toHexString().substring(2).padStart(8, '0') +
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
                  class: e.target.value,
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
                  shareholder: e.target.value,
                }));
              }}

              value = {shareArgs?.shareholder}
              size='small'
            />

            <br />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfIssueDate" 
              label="IssueDateOfShare" 
              variant="outlined"
              helperText="Timestamp (in 's')"
              onChange={(e) => {
                setShareArgs(v => ({
                  ...v,
                  issueDate: e.target.value,
                }));
              }}

              value = {shareArgs?.issueDate}
              size='small'
            />

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="tfPayInDeadline" 
              label="PayInDeadline" 
              variant="outlined"
              helperText="Timestamp (in 's')"
              onChange={(e) => {
                setShareArgs(v => ({
                  ...v,
                  payInDeadline: e.target.value,
                }));
              }}

              value = {shareArgs?.payInDeadline}
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
                  priceOfPaid: e.target.value,
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
                  priceOfPar: e.target.value,
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
            minHeight: 486,            
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