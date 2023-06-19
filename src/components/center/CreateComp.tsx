
import { Button, Collapse } from '@mui/material';
import { Create, Engineering, ReadMoreOutlined, Settings } from '@mui/icons-material';
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
import { useEffect, useState } from 'react';
import { getBookeeper } from '../../queries/accessControl';
import { getKeeper } from '../../queries/gk';

async function getReceipt(hash: HexType): Promise<HexType> {
  const receipt = await waitForTransaction({
    hash: hash
  });

  return `0x${receipt.logs[0].topics[2].substring(26)}`; 
}

export function CreateComp() {
  const { gk, boox, setGK } = useComBooxContext();

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

  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    // console.log('gk: ', gk);
    if (gk != AddrZero && boox.length > 0) {
      getBookeeper(boox[8]).then(
        keeperOfRom => {
          getKeeper(gk, 8).then(
            romKeeper => {
              if (keeperOfRom != romKeeper) {
                setOpen(true);
                return;
              }
            }
          )
        } 
      );
      getBookeeper(boox[7]).then(
        keeperOfBos => {
          getKeeper(gk, 7).then(
            bosKeeper => {
              if (keeperOfBos != bosKeeper) {
                setOpen(true);
                return;
              }
            }
          )
        } 
      );
    } else {
      setOpen(false);
    }
  }, [gk, boox])

  return (
    <div>

      <Collapse in={ !open } >

        <Button 
          sx={{ m: 1, minWidth: 415, height: 40 }} 
          variant="outlined" 
          disabled={ !write || isLoading }
          endIcon={ <Create /> }
          size='small'
          onClick={() => write?.()}
        >
          {isLoading ? 'Loading...' : 'Register My Company'}
        </Button> 

      </Collapse>

      <Collapse in={open} >
        <Link
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
            endIcon={ <Settings /> }
          >
            Init System Setting
          </Button>
        </Link>
      </Collapse>

    </div>
  )
}
