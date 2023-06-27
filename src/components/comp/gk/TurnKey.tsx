import { useState, useEffect } from 'react';

import { 
  Grid,
  Box, 
  TextField, 
  Button,
  Paper,
  Toolbar,
  Stack,
  Divider,
  Tooltip,
  IconButton,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

import { AddCircle, ArrowBack, ArrowForward, RemoveCircle, Send }  from '@mui/icons-material';

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
  usePrepareBookOfSharesDecreaseCapital,
  useBookOfSharesDecreaseCapital,
} from '../../../generated';

import { BigNumber } from 'ethers';

import { Bytes32Zero, HexType } from '../../../interfaces';

import { DataList } from '../..';

import { useComBooxContext } from '../../../scripts/ComBooxContext';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { Share, codifyHeadOfShare, getSharesList } from '../bos/bookOfShares';
import { dateParser } from '../../../scripts/toolsKit';
import { SharesList } from '../bos/SharesList';
import { DelShare } from '../bos/DelShare';
import { getBook, getKeeper } from '../../../queries/gk';
import { getBookeeper } from '../../../queries/accessControl';


interface TurnKeyProps {
  nextStep: (next: number) => void;
}


export function TurnKey({nextStep}:TurnKeyProps) {
  const { gk, boox } = useComBooxContext();

  const [romKeeper, setRomKeeper] = useState<HexType>();
  const [dkOfRom, setDKOfRom] = useState<HexType>();

  const [bosKeeper, setBosKeeper] = useState<HexType>();
  const [dkOfBos, setDKOfBos] = useState<HexType>();

  useEffect(()=>{
    const obtainKeepers = async ()=>{
      setRomKeeper(await getKeeper(gk, 8));
      setDKOfRom(await getBookeeper(boox[8]));

      setBosKeeper(await getKeeper(gk, 7));
      setDKOfBos(await getBookeeper(boox[7]));
    }
    
    obtainKeepers();
  });

  const {
    config: setRomDKConfig,
  } = usePrepareRegisterOfMembersSetDirectKeeper({
    address: boox[8],
    args: romKeeper ? [ romKeeper ] : undefined,
  });

  const {
    isLoading: setRomDKLoading,
    write: setRomDK,
  } = useRegisterOfMembersSetDirectKeeper(setRomDKConfig);

  const {
    config: setBosDKConfig,
  } = usePrepareBookOfSharesSetDirectKeeper({
    address: boox[7],
    args: bosKeeper ? [ bosKeeper ] : undefined,
  });

  const {
    isLoading: setBosDKLoading,
    write: setBosDK
  } = useBookOfSharesSetDirectKeeper(setBosDKConfig);

  return (

    <Paper elevation={3} sx={{m:1, p:1, width:'100%', alignItems:'center', justifyContent:'center' }} >
      <Stack direction='column' sx={{m:1, p:1, alignItems:'start', justifyContent:'space-between'}} >

        <Typography variant="h5" component="div" sx={{ m:2, textDecoration:'underline' }} >
          <b>Turn Key</b>
        </Typography>

        <Card sx={{ width:'100%', }} variant='outlined'>
            <CardContent>

              <Typography variant="body1" component="div" sx={{ m:1 }} >
                <b>RomKeeper </b> : {romKeeper}
              </Typography>

              <Typography variant="body1" component="div" sx={{ m:1 }} >
                <b>KeeperOfROM</b> : {dkOfRom}
              </Typography>

              <Divider />

              <Typography variant="body1" component="div" sx={{ m:1 }} >
                <b>BosKeeper</b> : {bosKeeper}
              </Typography>

              <Typography variant="body1" component="div" sx={{ m:1 }} >
                <b>KeeperOfBOS</b> : {dkOfBos}
              </Typography>

            </CardContent>        
        </Card>
      
        <Stack direction='row' sx={{m:1, p:1}}>

          <Button 
            disabled = {!setRomDK || setRomDKLoading }

            sx={{ m: 1, mr: 5, minWidth: 120, height: 40 }} 

            variant="outlined" 

            onClick={() => { 
              setRomDK?.(); 
            }}

            size='small'
          >
            Turn Key of ROM
          </Button>

          <Button 
            disabled = {!setBosDK || setBosDKLoading }

            sx={{ m: 1, ml:5, minWidth: 120, height: 40 }} 

            variant="outlined" 

            onClick={()=> {
              setBosDK?.();
            }}

            size='small'
          >
            Turn Key of BOS
          </Button>

        </Stack>

        <Divider sx={{width:'100%'}} />

        <Stack direction='row' sx={{m:1, p:1, justifyContent:'space-between'}}>

          <Button
            variant="contained"
            sx={{
              height: 40,
              mr: 10,
            }}
            startIcon={ <ArrowBack /> }

            onClick={()=>nextStep(2)}
          >
            Prev
          </Button>

          <Button
            variant="contained"
            sx={{
              height: 40,
              ml: 10,
            }}
            endIcon={ <ArrowForward /> }

            onClick={()=>nextStep(4)}
          >
            Next
          </Button>

        </Stack>

      </Stack>
    </Paper>


  )
}
