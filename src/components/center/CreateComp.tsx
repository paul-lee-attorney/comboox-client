import { useRouter } from 'next/navigation';

import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Tooltip } from '@mui/material';
import { Create } from '@mui/icons-material';

import { 
  useRegCenterCreateComp,
} from '../../generated';

import { 
  AddrOfRegCenter, AddrZero, HexType,
} from '../../interfaces';

import { useComBooxContext } from '../../scripts/ComBooxContext';
import { getDocAddr } from '../../queries/rc';
import { useState } from 'react';

export function CreateComp() {
  const { setGK } = useComBooxContext();
  const router = useRouter();

  const [ dk, setDK ] = useState<HexType>();

  const {
    isLoading: createCompLoading, 
    write: createComp,
  } = useRegCenterCreateComp({
    address: AddrOfRegCenter,
    args: dk && dk != '0x' 
      ? [dk] : undefined,
    onSuccess(data) {
      const initComp = async ()=>{
        let addrOfGK = await getDocAddr(data.hash);
        setGK(addrOfGK);
        router.push('/comp/HomePage');
      }
      initComp();
    }
  })

  return (
    <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >


      <FormControl size='small' sx={{ m: 1, width: 488 }} variant="outlined">
        <InputLabel size='small' htmlFor="setGC-input">PrimeKey Of General Keeper</InputLabel>
        <OutlinedInput
          size='small'
          id="setGC-input"
          label='PrimeKey Of General Keeper'
          endAdornment={
            <InputAdornment position="end">
              <Tooltip title={"Register My Company"} placement='right' arrow >
                <span>
                  <IconButton
                    disabled={ createCompLoading || dk == undefined || dk == '0x' }
                    color='primary'
                    onClick={ ()=>createComp?.() }
                    edge="end"
                  >
                    <Create />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          }
          sx={{height: 40}}
          onChange={(e) => setDK(`0x${e.target.value}`)}
          value={ dk?.substring(2) }
        />
      </FormControl>

    </Stack> 
  )
}
