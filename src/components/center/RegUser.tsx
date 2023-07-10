
import { Button, Paper, Toolbar } from '@mui/material';

import { 
  usePrepareRegCenterRegUser, 
  useRegCenterRegUser
} from '../../generated';

import { AddrOfRegCenter } from '../../interfaces';
import { BorderColor, Create } from '@mui/icons-material';

interface RegUserProps {
  getMyUserNo: () => void,
  getUser: () => void,
}

export function RegUser({ getMyUserNo, getUser }:RegUserProps) {
  
  const { config } = usePrepareRegCenterRegUser({
    address: AddrOfRegCenter
  })  

  const { isLoading, write: regUser } = useRegCenterRegUser({
    ...config,
    onSuccess() {
      getMyUserNo();
      getUser();
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Toolbar sx={{ textDecoration:'underline', color:'black' }} >
        <h4>Register User</h4>
      </Toolbar>

      <Button 
        size="small"
        disabled={ !regUser || isLoading } 
        onClick={() => {
          regUser?.()
        }}
        variant='contained'
        sx={{ m:1, ml:2, minWidth:128 }} 
        endIcon={<BorderColor />}       
      >
        {isLoading ? 'Loading...' : 'Register'}
      </Button>
    </Paper>
  )
}
