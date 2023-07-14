
import { Button, Paper, Toolbar } from '@mui/material';

import { 
  useRegCenterRegUser
} from '../../generated';

import { AddrOfRegCenter } from '../../interfaces';
import { BorderColor, Create } from '@mui/icons-material';

interface RegUserProps {
  getUser: () => void,
}

export function RegUser({ getUser }:RegUserProps) {
  
  // const {
  //   isSuccess: regUserConfig
  // } = usePrepareRegCenterRegUser({
  //   address: AddrOfRegCenter,
  // })

  const {
    isLoading: regUserLoading,
    write: regUser
  } = useRegCenterRegUser({
    address: AddrOfRegCenter,
    onSuccess() {
      getUser;
    }
  })


  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Toolbar sx={{ textDecoration:'underline', color:'black' }} >
        <h4>Register User</h4>
      </Toolbar>

      <Button 
        size="small"
        disabled={ regUserLoading } 
        onClick={() => {
          regUser?.()
        }}
        variant='contained'
        sx={{ m:1, ml:2, minWidth:128 }} 
        endIcon={<BorderColor />}       
      >
        {regUserLoading ? 'Loading...' : 'Register'}
      </Button>
    </Paper>
  )
}
