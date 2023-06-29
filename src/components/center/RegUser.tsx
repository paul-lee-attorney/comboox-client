
import { Button } from '@mui/material';

import { 
  usePrepareRegCenterRegUser, 
  useRegCenterRegUser
} from '../../generated';

import { AddrOfRegCenter } from '../../interfaces';

interface RegUserProps {
  closeDialog: () => void,
}

export function RegUser({ closeDialog }:RegUserProps) {
  
  const { config } = usePrepareRegCenterRegUser({
    address: AddrOfRegCenter
  })  

  const { isLoading, write: regUser } = useRegCenterRegUser({
    ...config,
    onSuccess() {
      closeDialog();
    }
  })

  return (
    <div>
      <Button 
        disabled={ !regUser || isLoading } 
        onClick={() => {
          regUser?.()
        }}
        variant='text'        
      >
        {isLoading ? 'Loading...' : 'RegUser'}
      </Button>
    </div>
  )
}
