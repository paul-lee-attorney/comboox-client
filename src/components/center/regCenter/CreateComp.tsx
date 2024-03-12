import { useRouter } from 'next/navigation';

import { 
  FormControl, 
  FormHelperText, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  OutlinedInput, 
  Stack, 
  Tooltip 
} from '@mui/material';

import { BorderColor } from '@mui/icons-material';

import { 
  useCreateNewCompCreateComp,
} from '../../../generated';

import { 
  AddrOfCNC,
  HexType,
} from '../../../scripts/common';

import { useComBooxContext } from '../../../scripts/common/ComBooxContext';
import { getDocAddr } from '../../../scripts/center/rc';
import { useState } from 'react';
import { FormResults, HexParser, defFormResults, hasError, onlyHex } from '../../../scripts/common/toolsKit';
import { waitForTransaction } from '@wagmi/core';

export function CreateComp() {
  const { setGK, setErrMsg } = useComBooxContext();
  const router = useRouter();

  const [ dk, setDK ] = useState<HexType>();
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  
  const [ loading, setLoading ] = useState(false);

  const {
    isLoading: createCompLoading, 
    write: createComp,
  } = useCreateNewCompCreateComp({
    address: AddrOfCNC,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      waitForTransaction({hash}).then(
        res => {
          console.log("Receipt: ", res);
          getDocAddr(hash).then(
            addrOfGK => {
              setGK(addrOfGK);
              router.push('/comp/HomePage');
            }
          );
          setLoading(false);
        }
      );
    }
  })

  const createCompClick = ()=>{
    if (dk) 
      createComp({
        args: [dk], 
      });
  }

  return (
    <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

      <FormControl size='small' sx={{ m: 1, width: 488 }} variant="outlined">
        <InputLabel size='small' htmlFor="setBookeeper-input" >PrimeKey Of Secretary</InputLabel>
        <OutlinedInput
          size='small'
          id="setBookeeper-input"
          aria-describedby='setBookeeper-input-helper-text'
          label='PrimeKey Of Secretary'
          error={ valid['Bookeeper']?.error }
          sx={{ height:40 }}
          endAdornment={
            <InputAdornment position="end">
              <Tooltip title={"Register My Company"} placement='right' arrow >
                <span>
                  <IconButton
                    disabled={ createCompLoading || hasError(valid) || loading}
                    color='primary'
                    onClick={ createCompClick }
                    edge="end"
                  >
                    <BorderColor />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          }
          onChange={(e) => {
            let input = HexParser(e.target.value);
            onlyHex('Bookeeper', input, 40, setValid);
            setDK(input);
          }}
          value={ dk }
        />
        <FormHelperText id='setBookeeper-input-helper-text'>
          { valid['Bookeeper']?.helpTx ?? ' ' }
        </FormHelperText>
      </FormControl>

    </Stack> 
  )
}
