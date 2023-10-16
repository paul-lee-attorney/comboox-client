import { useEffect, useState } from 'react';

import {  
  Button,
  Paper,
  Stack,
  Divider,
  Typography,
  Card,
  CardContent,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';

import { ArrowDownward, ArrowUpward, Key }  from '@mui/icons-material';


import {
  useAccessControlSetDirectKeeper,
} from '../../../generated';

import { HexType, booxMap } from '../../../scripts/common';

import { useComBooxContext } from '../../../scripts/common/ComBooxContext';
import { getKeeper } from '../../../scripts/comp/gk';
import { getDK } from '../../../scripts/common/accessControl';
import { refreshAfterTx } from '../../../scripts/common/toolsKit';
import { InitCompProps } from './SetCompInfo';

export function TurnKey({ nextStep }:InitCompProps) {
  const { gk, boox } = useComBooxContext();
  const [ time, setTime ] = useState(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

  const [romKeeper, setRomKeeper] = useState<HexType>();

  useEffect(()=>{
    if (gk) {
      getKeeper(gk, booxMap.ROM).then(
        res => {
          setRomKeeper(res);
        }
      )
    }
  }, [gk, time]);

  const {
    isLoading: setRomDKLoading,
    write: setRomDK,
  } = useAccessControlSetDirectKeeper({
    address: boox ? boox[booxMap.ROM] : undefined,
    args: romKeeper ? [ romKeeper ] : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const [dkOfRom, setDKOfRom] = useState<HexType>();

  useEffect(()=>{
    if (boox) {
      getDK(boox[booxMap.ROM]).then(
        res => {
          setDKOfRom(res);
        }
      )
    }
  }, [boox, time])

  const {
    isLoading: setRosDKLoading,
    write: setRosDK
  } = useAccessControlSetDirectKeeper({
    address: boox ? boox[booxMap.ROS] : undefined,
    args: romKeeper ? [ romKeeper ] : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const [dkOfRos, setDKOfRos] = useState<HexType>();

  useEffect(()=>{
    if (boox) {
      getDK(boox[booxMap.ROS]).then(
        res => {
          setDKOfRos(res);
        }
      )
    }
  }, [boox, time]);

  return (

    <Paper elevation={3} sx={{m:1, p:1, width:'100%', alignItems:'center', justifyContent:'center' }} >

      <Stack direction='row' sx={{alignItems:'start', justifyContent:'start', alignContent:'start'}}>

        <Stack direction='column' sx={{ height:'100%' }} >

          <Tooltip title='Prev Step' placement='left' arrow >
            <IconButton
              size='large'
              color='primary'
              onClick={()=>nextStep(2)}
            >
              <ArrowUpward />
            </IconButton>
          </Tooltip>

          <Divider flexItem />

          <Tooltip title='Next Step' placement='left' arrow >

            <IconButton
              size='large'
              color='primary'
              onClick={()=>nextStep(4)}
            >
              <ArrowDownward />
            </IconButton>

          </Tooltip>

        </Stack>

        <Divider sx={{m:1}} orientation='vertical' flexItem />

        <Stack direction='column' sx={{m:1, p:1, alignItems:'start', justifyContent:'space-between'}} >

          <Typography variant="h5" component="div" sx={{ m:2, textDecoration:'underline' }} >
            <b>Turn Key</b>
          </Typography>

          <Card sx={{ width:'100%', }} variant='outlined'>
              <CardContent>

                <Stack direction='row' >
                  <Chip
                    variant='filled'
                    color='primary'
                    label='RomKeeper'
                    sx={{width:120}}
                  />

                  <Typography variant="body1" sx={{ m:1, textDecoration:'underline' }} >
                    {romKeeper}
                  </Typography>
                </Stack>

                <Stack direction='row' >
                  <Chip
                    variant={ dkOfRom == romKeeper ? 'filled' : 'outlined' }
                    color={ dkOfRom == romKeeper ? 'primary' : 'default' }
                    label='KeeperOfRom'
                    sx={{width:120}}
                  />

                  <Typography variant="body1" sx={{ m:1, textDecoration:'underline' }} >
                    {dkOfRom}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction='row' >
                  <Chip
                    variant='filled'
                    color='success'
                    label='RosKeeper'
                    sx={{width:120}}
                  />

                  <Typography variant="body1" sx={{ m:1, textDecoration:'underline' }} >
                    {romKeeper}
                  </Typography>
                </Stack>

                <Stack direction='row' >
                  <Chip
                    variant={ dkOfRos == romKeeper ? 'filled' : 'outlined' }
                    color={ dkOfRos == romKeeper ? 'success' : 'default' }
                    label='KeeperOfRos'
                    sx={{width:120}}
                  />

                  <Typography variant="body1" sx={{ m:1, textDecoration:'underline' }} >
                    {dkOfRos}
                  </Typography>
                </Stack>

              </CardContent>        
          </Card>
        
          <Stack direction='row' sx={{m:1, p:1}}>

            <Button 
              disabled = { !setRomDK || setRomDKLoading }
              sx={{ m: 1, mr: 5, minWidth: 120, height: 40 }} 
              variant="outlined" 
              color='primary'
              startIcon={<Key />}
              onClick={() => { 
                setRomDK?.(); 
              }}
              size='small'
            >
              Turn Key of ROM
            </Button>

            <Button 
              disabled = {!setRosDK || setRosDKLoading }
              sx={{ m: 1, ml:5, minWidth: 120, height: 40 }} 
              variant="outlined" 
              color='success'
              startIcon={<Key />}
              onClick={()=> {
                setRosDK?.();
              }}
              size='small'
            >
              Turn Key of ROS
            </Button>

          </Stack>


        </Stack>

      </Stack>
    </Paper>


  )
}
