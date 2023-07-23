import { useState } from 'react';

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
  useBookOfSharesSetDirectKeeper,
  useBookOfMembersSetDirectKeeper,
  useGeneralKeeperGetKeeper,
  useAccessControlGetDk,
  useAccessControlSetDirectKeeper,
} from '../../../generated';

import { HexType } from '../../../interfaces';

import { useComBooxContext } from '../../../scripts/ComBooxContext';

interface TurnKeyProps {
  nextStep: (next: number) => void;
}

export function TurnKey({ nextStep }:TurnKeyProps) {
  const { gk, boox } = useComBooxContext();

  const [bomKeeper, setBomKeeper] = useState<HexType>();

  useGeneralKeeperGetKeeper({
    address: gk,
    args: [ BigInt(4) ],
    onSuccess(res) {
      setBomKeeper(res)
    }
  })

  const [dkOfBom, setDKOfBom] = useState<HexType>();

  const {
    refetch: getDkOfBom
  } = useAccessControlGetDk({
    address: boox ? boox[4] : undefined,
    onSuccess(res) {
      setDKOfBom(res)
    }
  })

  const [bosKeeper, setBosKeeper] = useState<HexType>();

  useGeneralKeeperGetKeeper({
    address: gk,
    args: [ BigInt(10) ],
    onSuccess(res) {
      setBosKeeper(res)
    }
  })

  const [dkOfBos, setDKOfBos] = useState<HexType>();

  const {
    refetch: getDkOfBos
  } = useAccessControlGetDk({
    address: boox ? boox[10] : undefined,
    onSuccess(res) {
      setDKOfBos(res)
    }
  })

  const {
    isLoading: setBomDKLoading,
    write: setBomDK,
  } = useAccessControlSetDirectKeeper({
    address: boox ? boox[4] : undefined,
    args: bomKeeper ? [ bomKeeper ] : undefined,
    onSuccess() {
      getDkOfBom();
    }
  });

  const {
    isLoading: setBosDKLoading,
    write: setBosDK
  } = useAccessControlSetDirectKeeper({
    address: boox ? boox[10] : undefined,
    args: bosKeeper ? [ bosKeeper ] : undefined,
    onSuccess() {
      getDkOfBos();
    }  
  });

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
                    label='BomKeeper'
                    sx={{width:120}}
                  />

                  <Typography variant="body1" sx={{ m:1, textDecoration:'underline' }} >
                    {bomKeeper}
                  </Typography>
                </Stack>

                <Stack direction='row' >
                  <Chip
                    variant={ dkOfBom == bomKeeper ? 'filled' : 'outlined' }
                    color={ dkOfBom == bomKeeper ? 'primary' : 'default' }
                    label='KeeperOfBom'
                    sx={{width:120}}
                  />

                  <Typography variant="body1" sx={{ m:1, textDecoration:'underline' }} >
                    {dkOfBom}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction='row' >
                  <Chip
                    variant='filled'
                    color='success'
                    label='BosKeeper'
                    sx={{width:120}}
                  />

                  <Typography variant="body1" sx={{ m:1, textDecoration:'underline' }} >
                    {bosKeeper}
                  </Typography>
                </Stack>

                <Stack direction='row' >
                  <Chip
                    variant={ dkOfBos == bosKeeper ? 'filled' : 'outlined' }
                    color={ dkOfBos == bosKeeper ? 'success' : 'default' }
                    label='KeeperOfBos'
                    sx={{width:120}}
                  />

                  <Typography variant="body1" sx={{ m:1, textDecoration:'underline' }} >
                    {dkOfBos}
                  </Typography>
                </Stack>

              </CardContent>        
          </Card>
        
          <Stack direction='row' sx={{m:1, p:1}}>

            <Button 
              disabled = { !setBomDK || setBomDKLoading }
              sx={{ m: 1, mr: 5, minWidth: 120, height: 40 }} 
              variant="outlined" 
              color='primary'
              startIcon={<Key />}
              onClick={() => { 
                setBomDK?.(); 
              }}
              size='small'
            >
              Turn Key of ROM
            </Button>

            <Button 
              disabled = {!setBosDK || setBosDKLoading }
              sx={{ m: 1, ml:5, minWidth: 120, height: 40 }} 
              variant="outlined" 
              color='success'
              startIcon={<Key />}
              onClick={()=> {
                setBosDK?.();
              }}
              size='small'
            >
              Turn Key of BOS
            </Button>

          </Stack>


        </Stack>

      </Stack>
    </Paper>


  )
}
