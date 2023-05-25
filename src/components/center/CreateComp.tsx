import { useEffect } from 'react';

import { Button, Box, Icon } from '@mui/material';
import { Create, ReadMoreOutlined, Send } from '@mui/icons-material';
import Link from '../../scripts/Link';


import { waitForTransaction } from '@wagmi/core'

import { 
  usePrepareRegCenterCreateComp, 
  useRegCenterCreateComp,
} from '../../generated';

import { 
  AddrOfRegCenter,
  AddrZero,
  HexType
} from '../../interfaces';

import { useComBooxContext } from '../../scripts/ComBooxContext';

async function getReceipt(hash: HexType): Promise<HexType> {
  const receipt = await waitForTransaction({
    hash: hash
  });

  return `0x${receipt.logs[0].topics[2].substring(26)}`; 
}

export function CreateComp() {
  const { gk, setGK } = useComBooxContext();

  const {
    config,
  } = usePrepareRegCenterCreateComp({
    address: AddrOfRegCenter
  });  

  const {
    data, 
    isLoading, 
    write 
  } = useRegCenterCreateComp({
    ...config,
    onSuccess(data) {
      getReceipt(data.hash).then(
        addrOfGK => setGK(addrOfGK)
      )
    }
  })

  return (
    <div>

      {gk === AddrZero 
        ? ( <Button 
              sx={{ m: 1, minWidth: 415, height: 40 }} 
              variant="outlined" 
              disabled={ !write || isLoading }
              endIcon={ <Create /> }
              size='small'
              onClick={() => write?.()}
            >
              {isLoading ? 'Loading...' : 'Register My Company'}
            </Button> ) 

        : ( <Link
              href='/comp/initSys/setCompId'  
              as = '/comp/initSys/setCompId'
              variant='button'
              underline='hover'
            >

              <Button
                variant='outlined'
                sx={{
                  m: 1,
                  height: 40,
                  width: 415,
                }}
                endIcon={ <ReadMoreOutlined/> }
              >
                Init System Setting
              </Button>

            </Link>)
      }

    </div>
  )
}
