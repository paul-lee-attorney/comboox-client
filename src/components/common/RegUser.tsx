
import { Button } from '@mui/material';

import { 
  usePrepareRegCenterRegUser, 
  useRegCenterRegUser
} from '../../generated';

import { AddrOfRegCenter } from '../../interfaces';

export function RegUser() {
  
  const { config, isLoading } = usePrepareRegCenterRegUser({
    address: AddrOfRegCenter
  })  

  const { write: regUser } = useRegCenterRegUser(config)

  return (
    <div>
      <Button 
        disabled={ !regUser } 
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
