import { useRouter } from 'next/navigation';

import { Button } from '@mui/material';
import { Create } from '@mui/icons-material';

import { waitForTransaction } from '@wagmi/core'

import { 
  usePrepareRegCenterCreateComp, 
  useRegCenterCreateComp,
} from '../../generated';

import { 
  AddrOfRegCenter,
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
  const { setGK } = useComBooxContext();
  const router = useRouter();

  const {
    isLoading: createCompLoading, 
    write: createComp,
  } = useRegCenterCreateComp({
    address: AddrOfRegCenter,
    onSuccess(data) {
      const initComp = async ()=>{
        let addrOfGK = await getReceipt(data.hash);
        setGK(addrOfGK);
        router.push('/comp/HomePage');
      }
      initComp();
    }
  })

  return (
    <Button 
      sx={{ m: 1, minWidth: 488, height: 40 }} 
      variant="outlined" 
      disabled={ createCompLoading }
      endIcon={ <Create /> }
      size='small'
      onClick={() => createComp?.()}
    >
      {createCompLoading ? 'Loading...' : 'Register My Company'}
    </Button> 
  )
}
