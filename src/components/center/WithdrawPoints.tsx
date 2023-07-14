
import { Button, Paper, Stack } from '@mui/material';

import { 
  useRegCenterWithdrawPoints,
} from '../../generated';

import { AddrOfRegCenter, HexType } from '../../interfaces';
import { Undo } from '@mui/icons-material';

interface WithdrawPointsProps{
  hashLock: HexType;
  refreshList: ()=>void;
  getUser: ()=>void;
  setOpen: (flag: boolean)=>void;
}

export function WithdrawPoints({hashLock, refreshList, getUser, setOpen}:WithdrawPointsProps) {

  // const {
  //   config: withdrawPointsConfig
  // } = usePrepareRegCenterWithdrawPoints({
  //   address: AddrOfRegCenter,
  //   args: [ hashLock ],
  // })

  const {
    isLoading: withdrawPointsLoading,
    write: withdrawPoints
  } = useRegCenterWithdrawPoints({
    address: AddrOfRegCenter,
    args: [ hashLock ],
    onSuccess() {
      refreshList();
      getUser();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >    
      <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >

        <Button 
          size='small'
          disabled={  withdrawPointsLoading } 
          onClick={() => {
            withdrawPoints?.()
          }}
          variant='contained'
          sx={{ m:1, minWidth:128 }} 
          endIcon={<Undo />}       
        >
          {withdrawPointsLoading ? 'Loading...' : 'Withdraw Points'}
        </Button>

      </Stack>

    </Paper>
  )
}
