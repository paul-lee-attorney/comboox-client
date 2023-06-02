import { BigNumber } from "ethers";
import { Bytes32Zero, HexType } from "../../../../interfaces";
import { readContract, waitForTransaction } from "@wagmi/core";
import { investmentAgreementABI, useGeneralKeeperCloseDeal, useGeneralKeeperIssueNewShare, useGeneralKeeperPushToCoffer, useGeneralKeeperRevokeDeal, useGeneralKeeperTerminateDeal, useGeneralKeeperTransferTargetShare, useInvestmentAgreementCreateDeal, usePrepareGeneralKeeperCloseDeal, usePrepareGeneralKeeperIssueNewShare, usePrepareGeneralKeeperPushToCoffer, usePrepareGeneralKeeperRevokeDeal, usePrepareGeneralKeeperTerminateDeal, usePrepareGeneralKeeperTransferPledge, usePrepareGeneralKeeperTransferTargetShare, usePrepareInvestmentAgreementCreateDeal } from "../../../../generated";
import { useEffect, useState } from "react";
import { dealSnParser } from "../../../../pages/comp/boa/ia/bodyTerms";
import { Box, Button, Checkbox, Collapse, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Toolbar } from "@mui/material";
import { Cancel, CurrencyBitcoin, CurrencyExchange, DirectionsRun, EditNote, HighlightOff, LockClock, LockOpen, RemoveShoppingCart, RemoveShoppingCartOutlined, RocketLaunch } from "@mui/icons-material";
import { dateParser } from "../../../../scripts/toolsKit";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { getHash } from "next/dist/server/image-optimizer";

import dayjs, {Dayjs} from "dayjs";

interface ExecDealProps{
  ia: HexType,
  seq: number,
  setLock: (lock: HexType) => void,
}

export function ExecDeal({ia, seq, setLock}: ExecDealProps) {
  const {gk} = useComBooxContext();

  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);
  const [ closingDate, setClosingDate ] = useState<number>(0);
  const [ hashKey, setHashKey ] = useState<string>('Input your key string here');

  const {config} = usePrepareGeneralKeeperPushToCoffer({
    address: gk,
    args: [ia, BigNumber.from(seq), hashLock, BigNumber.from(closingDate)],
  })

  const {
    isLoading,
    write: pushToCoffer,
  } = useGeneralKeeperPushToCoffer({
    ...config,
    onSuccess(){
      setLock(hashLock)
    }
  })

  const {
    config: closeDealConfig
  } = usePrepareGeneralKeeperCloseDeal({
    address: gk,
    args: [ia, BigNumber.from(seq), hashKey],
  })
  
  const {
    isLoading: closeDealLoading,
    write: closeDeal
  } = useGeneralKeeperCloseDeal(
    closeDealConfig
  );

  const {
    config: revokeDealConfig
  } = usePrepareGeneralKeeperRevokeDeal({
    address: gk,
    args: [ia, BigNumber.from(seq), hashKey],
  })
  
  const {
    isLoading: revokeDealLoading,
    write: revokeDeal
  } = useGeneralKeeperRevokeDeal(
    revokeDealConfig
  );

  const {
    config: terminateDealConfig
  } = usePrepareGeneralKeeperTerminateDeal({
    address: gk,
    args: [ia, BigNumber.from(seq)],
  });
  
  const {
    isLoading: terminateDealLoading,
    write: terminateDeal
  } = useGeneralKeeperTerminateDeal(
    terminateDealConfig
  );

  const {
    config: issueNewShareConfig
  } = usePrepareGeneralKeeperIssueNewShare({
    address: gk,
    args: [ia, BigNumber.from(seq)],
  });
  
  const {
    isLoading: issueNewShareLoading,
    write: issueNewShare
  } = useGeneralKeeperIssueNewShare(
    issueNewShareConfig
  );

  const {
    config: transferTargetShareConfig
  } = usePrepareGeneralKeeperTransferTargetShare({
    address: gk,
    args: [ia, BigNumber.from(seq)],
  });
  
  const {
    isLoading: transferTargetShareLoading,
    write: transferTargetShare
  } = useGeneralKeeperTransferTargetShare(
    transferTargetShareConfig
  );

  const [ useLock, setUseLock ] = useState<boolean>();

  return (
    <>
      <Paper sx={{
        p:1, 
        border: 1, 
        borderColor:'divider' 
        }} 
      >
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <Box sx={{ minWidth:600 }} >
            <Toolbar>
              <h4>Execute Transaction </h4>
            </Toolbar>
          </Box>

          <FormControlLabel
          control={
            <Switch 
              color="primary" 
              onChange={(e) => setUseLock( e.target.checked )} 
              checked={ useLock } 
            />
          }
          label={useLock ? 'Via Hash Locker' : 'Direct Transfer'}
          labelPlacement="end"
          />

        </Stack>

        <Collapse in={ useLock } >
          <Stack direction={'row'} sx={{ alignItems:'center'}} >

            <Button 
              disabled = {!pushToCoffer || isLoading}

              sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
              variant="contained" 
              endIcon={<LockClock />}
              onClick={()=> pushToCoffer?.()}
              size='small'
            >
              Lock_Share
            </Button>

            <TextField 
              variant='filled'
              label='HashLock'
              sx={{
                m:1,
                minWidth: 680,
              }}
              onChange={(e) => setHashLock(`0x${e.target.value}`)}              
              value={ hashLock.substring(2) }
            />

            <TextField 
              variant='filled'
              label='ClosingDate'
              inputProps={{readOnly: true}}
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ dayjs.unix(closingDate).format('YYYY-MM-DD HH:mm:ss') }
            />

          </Stack>

          <Stack direction={'row'} sx={{ alignItems:'center'}} >

            <Button 
              disabled = {!closeDeal || closeDealLoading}

              sx={{ m: 1, minWidth: 120, height: 40, width: 218 }} 
              variant="contained" 
              endIcon={<LockOpen />}
              onClick={()=> closeDeal?.()}
              size='small'
            >
              Take_Share
            </Button>

            <TextField 
              variant='filled'
              label='HashKey'
              sx={{
                m:1,
                minWidth: 680,
              }}
              value={ hashKey }
              onChange={(e)=>setHashKey(e.target.value)}
            />

            <Button 
              disabled = {!revokeDeal || revokeDealLoading}

              sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
              variant="contained" 
              endIcon={<RemoveShoppingCartOutlined />}
              onClick={()=> revokeDeal?.()}
              size='small'
            >
              Revoke_Deal
            </Button>

          </Stack>
        </Collapse>

       <Collapse in={ !useLock } >  
        <Stack direction={'row'} sx={{ alignItems:'center' }} >
          <Button 
            disabled = {!issueNewShare || issueNewShareLoading}

            sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
            variant="contained" 
            endIcon={<RocketLaunch />}
            onClick={()=> issueNewShare?.()}
            size='small'
          >
            Issue_Share
          </Button>

          <Button 
            disabled = {!transferTargetShare || transferTargetShareLoading}

            sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
            variant="contained" 
            endIcon={<CurrencyExchange />}
            onClick={()=> transferTargetShare?.()}
            size='small'
          >
            Transfer_Share
          </Button>

          <Button 
            disabled = {!terminateDeal || terminateDealLoading}

            sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
            variant="contained" 
            endIcon={<DirectionsRun />}
            onClick={()=> terminateDeal?.()}
            size='small'
          >
            Terminate_Deal
          </Button>

        </Stack>
      </Collapse>

      </Paper>


    </>
  );
}



