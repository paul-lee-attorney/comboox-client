import { BigNumber } from "ethers";
import { Bytes32Zero, HexType } from "../../../../interfaces";
import { readContract, waitForTransaction } from "@wagmi/core";
import { investmentAgreementABI, useGeneralKeeperCloseDeal, useGeneralKeeperIssueNewShare, useGeneralKeeperPushToCoffer, useGeneralKeeperRevokeDeal, useGeneralKeeperTerminateDeal, useGeneralKeeperTransferTargetShare, useInvestmentAgreementCreateDeal, usePrepareGeneralKeeperCloseDeal, usePrepareGeneralKeeperIssueNewShare, usePrepareGeneralKeeperPushToCoffer, usePrepareGeneralKeeperRevokeDeal, usePrepareGeneralKeeperTerminateDeal, usePrepareGeneralKeeperTransferPledge, usePrepareGeneralKeeperTransferTargetShare, usePrepareInvestmentAgreementCreateDeal } from "../../../../generated";
import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Collapse, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Toolbar, Typography } from "@mui/material";
import { Cancel, CurrencyBitcoin, CurrencyExchange, DirectionsRun, EditNote, HighlightOff, LockClock, LockOpen, RemoveShoppingCart, RemoveShoppingCartOutlined, RocketLaunch } from "@mui/icons-material";
import { dateParser } from "../../../../scripts/toolsKit";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { getHash } from "next/dist/server/image-optimizer";

import dayjs, {Dayjs} from "dayjs";
import { DateTimeField } from "@mui/x-date-pickers";
import { Deal } from "../../../../queries/ia";

interface ExecDealProps{
  ia: HexType;
  seq: number;
  newDeal: Deal;
  getDeal: () => any;
}

export function ExecDeal({ia, seq, newDeal, getDeal}: ExecDealProps) {
  const {gk} = useComBooxContext();

  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);
  const [ closingDate, setClosingDate ] = useState<Dayjs | null>(dayjs('2019-09-09T00:00:00Z'));
  const [ hashKey, setHashKey ] = useState<string>('Input your key string here');

  const {config} = usePrepareGeneralKeeperPushToCoffer({
    address: gk,
    args: closingDate?.unix() ? 
      [ia, BigNumber.from(seq), hashLock, BigNumber.from(closingDate.unix()) ] :
      undefined,
  })

  const {
    isLoading,
    write: pushToCoffer,
  } = useGeneralKeeperPushToCoffer({
    ...config,
    onSuccess() {
      getDeal()
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
  } = useGeneralKeeperCloseDeal({
    ...closeDealConfig,
    onSuccess() {
      getDeal()
    }
  });

  const {
    config: revokeDealConfig
  } = usePrepareGeneralKeeperRevokeDeal({
    address: gk,
    args: [ia, BigNumber.from(seq), hashKey],
  })
  
  const {
    isLoading: revokeDealLoading,
    write: revokeDeal
  } = useGeneralKeeperRevokeDeal({
    ...revokeDealConfig,
    onSuccess() {
      getDeal()
    }
  });

  const {
    config: terminateDealConfig
  } = usePrepareGeneralKeeperTerminateDeal({
    address: gk,
    args: [ia, BigNumber.from(seq)],
  });
  
  const {
    isLoading: terminateDealLoading,
    write: terminateDeal
  } = useGeneralKeeperTerminateDeal({
    ...terminateDealConfig,
    onSuccess() {
      getDeal();
    }
  });

  const {
    config: issueNewShareConfig
  } = usePrepareGeneralKeeperIssueNewShare({
    address: gk,
    args: [ia, BigNumber.from(seq)],
  });
  
  const {
    isLoading: issueNewShareLoading,
    write: issueNewShare
  } = useGeneralKeeperIssueNewShare({
    ...issueNewShareConfig,
    onSuccess() {
      getDeal()
    }
  });

  const {
    config: transferTargetShareConfig
  } = usePrepareGeneralKeeperTransferTargetShare({
    address: gk,
    args: [ia, BigNumber.from(seq)],
  });
  
  const {
    isLoading: transferTargetShareLoading,
    write: transferTargetShare
  } = useGeneralKeeperTransferTargetShare({
    ...transferTargetShareConfig,
    onSuccess() {
      getDeal()
    }
  });

  const [ useLock, setUseLock ] = useState<boolean>();

  return (
    <Paper elevation={3} sx={{
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

        <Typography>
          Direct Transfer  
        </Typography>

        <Switch 
          color="primary" 
          onChange={(e) => setUseLock( e.target.checked )} 
          checked={ useLock } 
        />

        <Typography>
          Via Hash Locker
        </Typography>

      </Stack>

      <Collapse in={ useLock } >
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <Button 
            disabled = {!pushToCoffer || isLoading || newDeal.body.state > 1 }

            sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
            variant="contained" 
            endIcon={<LockClock />}
            onClick={()=> pushToCoffer?.()}
            size='small'
          >
            Lock Share
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

          <DateTimeField
            label='ClosingDate'
            sx={{
              m:1,
              minWidth: 218,
            }} 
            value={ closingDate }
            onChange={(date) => setClosingDate(date)}
            format='YYYY-MM-DD HH:mm:ss'
          />

        </Stack>

        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <Button 
            disabled = {!closeDeal || closeDealLoading || newDeal.body.state > 2 }

            sx={{ m: 1, minWidth: 120, height: 40, width: 218 }} 
            variant="contained" 
            endIcon={<LockOpen />}
            onClick={()=> closeDeal?.()}
            size='small'
          >
            Take Share
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
            disabled = {!revokeDeal || revokeDealLoading || newDeal.body.state != 2}

            sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
            variant="contained" 
            endIcon={<RemoveShoppingCartOutlined />}
            onClick={()=> revokeDeal?.()}
            size='small'
          >
            Revoke Deal
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
          Issue Share
        </Button>

        <Button 
          disabled = {!transferTargetShare || transferTargetShareLoading || newDeal.body.state > 2}

          sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
          variant="contained" 
          endIcon={<CurrencyExchange />}
          onClick={()=> transferTargetShare?.()}
          size='small'
        >
          Transfer Share
        </Button>

        <Button 
          disabled = {!terminateDeal || terminateDealLoading || newDeal.body.state > 2}

          sx={{ m: 1, minWidth: 120, height: 40, width:218 }} 
          variant="contained" 
          endIcon={<DirectionsRun />}
          onClick={()=> terminateDeal?.()}
          size='small'
        >
          Terminate Deal
        </Button>

      </Stack>
    </Collapse>

    </Paper>
  );
}



