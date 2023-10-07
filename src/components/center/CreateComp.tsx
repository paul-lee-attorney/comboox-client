import { useRouter } from 'next/navigation';

import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Tooltip } from '@mui/material';
import { BorderColor } from '@mui/icons-material';

import { 
  useRegCenterCreateComp,
} from '../../generated';

import { 
  AddrOfRegCenter, HexType,
} from '../../scripts/common';

import { useComBooxContext } from '../../scripts/common/ComBooxContext';
import { getDocAddr } from '../../scripts/center/rc';
import { useState } from 'react';
import { HexParser } from '../../scripts/common/toolsKit';

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
    onSuccess(data:any) {
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
        <InputLabel size='small' htmlFor="setGC-input">PrimeKey Of Secretary</InputLabel>
        <OutlinedInput
          size='small'
          id="setGC-input"
          label='PrimeKey Of Secretary'
          sx={{ height:40 }}
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
                    <BorderColor />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          }
          onChange={(e) => setDK( HexParser(e.target.value) )}
          value={ dk }
        />
      </FormControl>

    </Stack> 
  )
}
