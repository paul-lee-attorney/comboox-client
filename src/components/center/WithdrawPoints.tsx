
import { Button, Paper, Stack } from '@mui/material';

import { 
  useRegCenterWithdrawPoints,
} from '../../generated';

import { AddrOfRegCenter, HexType } from '../../scripts/common';
import { Undo } from '@mui/icons-material';
import { refreshAfterTx } from '../../scripts/common/toolsKit';

interface WithdrawPointsProps{
  hashLock: HexType;
  refreshList: ()=>void;
  getUser: ()=>void;
  setOpen: (flag: boolean)=>void;
}

export function WithdrawPoints({hashLock, refreshList, getUser, setOpen}:WithdrawPointsProps) {

  const updateResults = ()=>{
    refreshList();
    getUser();
    setOpen(false);
  }

  const {
    isLoading: withdrawPointsLoading,
    write: withdrawPoints
  } = useRegCenterWithdrawPoints({
    address: AddrOfRegCenter,
    args: [ hashLock ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
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
          Withdraw Points
        </Button>

      </Stack>

    </Paper>
  )
}
