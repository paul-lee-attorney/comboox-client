import { useState, useEffect } from 'react';

import {  
  Button,
  Paper,
  Stack,
  Divider,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material';

import { ArrowBack, ArrowForward, Key }  from '@mui/icons-material';


import {
  usePrepareBookOfSharesSetDirectKeeper,
  useBookOfSharesSetDirectKeeper,
  usePrepareRegisterOfMembersSetDirectKeeper,
  useRegisterOfMembersSetDirectKeeper,
} from '../../../generated';

import { HexType } from '../../../interfaces';


import { useComBooxContext } from '../../../scripts/ComBooxContext';
import { getKeeper } from '../../../queries/gk';
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
      if (gk && boox) {
        setRomKeeper(await getKeeper(gk, 8));
        setDKOfRom(await getBookeeper(boox[8]));
  
        setBosKeeper(await getKeeper(gk, 7));
        setDKOfBos(await getBookeeper(boox[7]));
      }
    }
    
    obtainKeepers();
  });

  const {
    config: setRomDKConfig,
  } = usePrepareRegisterOfMembersSetDirectKeeper({
    address: boox ? boox[8] : undefined,
    args: romKeeper ? [ romKeeper ] : undefined,
  });

  const {
    isLoading: setRomDKLoading,
    write: setRomDK,
  } = useRegisterOfMembersSetDirectKeeper(setRomDKConfig);

  const {
    config: setBosDKConfig,
  } = usePrepareBookOfSharesSetDirectKeeper({
    address: boox ? boox[7] : undefined,
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
            disabled = {!setRomDK || setRomDKLoading }
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
