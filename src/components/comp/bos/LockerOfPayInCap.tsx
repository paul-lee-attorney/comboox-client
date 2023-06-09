import { useEffect, useState } from "react";
import { Bytes32Zero, HexType } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";

import { 
  useBookOfSharesGetLocker, 
  useGeneralKeeperRequestPaidInCapital, 
  useGeneralKeeperSetPayInAmt, 
  useGeneralKeeperWithdrawPayInAmt, 
  usePrepareGeneralKeeperRequestPaidInCapital, 
  usePrepareGeneralKeeperSetPayInAmt, 
  usePrepareGeneralKeeperWithdrawPayInAmt
} from "../../../generated";
import { Box, Collapse, IconButton, Paper, Stack, Switch, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { Download, ExitToApp, IosShare, Output, Upload } from "@mui/icons-material";
import { Share } from "../../../pages/comp/bos/bookOfShares";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export interface Locker {
  from: number;
  to: number;
  expireDate: number;
  hashLock: HexType;
}

const defaultLocker: Locker = {
  from: 0,
  to: 0,
  expireDate: 0,
  hashLock: Bytes32Zero,
}


interface LockerOfPayInCapProps {
  share: Share;
  obtainSharesList: ()=>any;
  setDialogOpen: (flag: boolean) => void;
}

export function LockerOfPayInCap({ share, obtainSharesList, setDialogOpen }: LockerOfPayInCapProps ) {

  const { gk, boox } = useComBooxContext();
  const [ locker, setLocker ] = useState<Locker>(defaultLocker);
  const [ amount, setAmount ] = useState<string>();

  const [ newAmt, setNewAmt ] = useState<string>();

  useEffect(()=>{
    setLocker(v => ({
      ...v,
      from: share.head.seqOfShare,
      to: share.head.shareholder,
    }));  
  }, [share]);

  let snOfLocker: HexType = `0x${
    locker.from.toString(16).padStart(10, '0') +
    locker.to.toString(16).padStart(10, '0') +
    locker.expireDate.toString(16).padStart(12, '0') +
    locker.hashLock.substring(34)
  }`;

  const {
    refetch: getLocker,
  } = useBookOfSharesGetLocker({
    address: boox[7],
    args: snOfLocker 
          ? [ snOfLocker ]
          : undefined,
    onSuccess(amount) {
      setNewAmt(amount.toString())
    }
  })

  const {
    config: setPayInAmtConfig,
  } = usePrepareGeneralKeeperSetPayInAmt ({
    address: gk,
    args: snOfLocker && amount 
          ? [snOfLocker, BigNumber.from(amount)]
          : undefined,
  });

  const {
    isLoading: setPayInAmtLoading,
    write: setPayInAmt,
  } = useGeneralKeeperSetPayInAmt({
    ...setPayInAmtConfig,
    onSuccess() {
      getLocker();
    }
  })

  const [ key, setKey ] = useState<string>();

  const {
    config: requestPaidInCapitalConfig
  } = usePrepareGeneralKeeperRequestPaidInCapital({
    address: gk,
    args: snOfLocker && key
          ? [ snOfLocker, key ]
          : undefined,
  })

  const {
    isLoading: requestPaidInCapitalLoading,
    write: requestPaidInCapital,
  } = useGeneralKeeperRequestPaidInCapital({
    ...requestPaidInCapitalConfig,
    onSuccess() {
      getLocker()
    }
  })

  const {
    config: withdrawPayInAmtConfig,
  } = usePrepareGeneralKeeperWithdrawPayInAmt({
    address: gk,
    args: snOfLocker 
          ? [snOfLocker]
          : undefined,
  })

  const {
    isLoading: withdrawPayInAmtLoading,
    write: withdrawPayInAmt,     
  } = useGeneralKeeperWithdrawPayInAmt({
    ...withdrawPayInAmtConfig,
    onSuccess() {
      getLocker()
    }
  })

  const [ open, setOpen ] = useState<boolean>(false);

  return (
    <Paper sx={{
      p:1, m:1,
      border: 1, 
      borderColor:'divider' 
      }} 
    >

      <Stack direction={'row'} sx={{ alignItems:'center'}} >

        <Box sx={{ minWidth:600 }} >
          <Toolbar>
            <h4>Pay In Capital </h4>
          </Toolbar>
        </Box>

        <Switch 
          color="primary" 
          onChange={(e) => setOpen( e.target.checked )} 
          checked={ open } 
        />

        <Typography>
          Edit
        </Typography>

      </Stack>

      <Collapse in={ open } >
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <Tooltip
            title='LockAmt'
            placement="top-start"
            arrow
          >
            <span>
              <IconButton
                disabled={ !setPayInAmt || setPayInAmtLoading }
                sx={{width: 20, height: 20, m: 1, p: 1}} 
                onClick={ () => setPayInAmt?.() }
                color="primary"            
              >
                < ExitToApp />
              </IconButton>
            </span>
          </Tooltip>

          <TextField 
            variant='filled'
            label='HashLock'
            sx={{
              m:1,
              minWidth: 618,
            }}
            onChange={(e) => setLocker(v => ({
              ...v,
              hashLock: `0x${e.target.value}`,
            }))}
            value={ locker.hashLock.substring(2) }
            size="small"
          />

          <TextField 
            variant='filled'
            label='Amount'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setAmount(e.target.value)}
            value={ amount }
            size="small"
          />

          <DateTimeField
            label='ExpireDate'
            sx={{
              m:1,
              minWidth: 218,
            }} 
            value={ dayjs.unix(locker.expireDate) }
            onChange={(date) => setLocker(v => ({
              ...v,
              expireDate: date ? date.unix(): 0,
            }))}
            format='YYYY-MM-DD HH:mm:ss'
            size="small"
          />

          <Tooltip
            title='WithdrawAmt'
            placement="top-end"
            arrow
          >
            <span>
              <IconButton
                disabled={ !withdrawPayInAmt || withdrawPayInAmtLoading }
                sx={{width: 20, height: 20, m: 1, p: 1}} 
                onClick={ () => withdrawPayInAmt?.() }
                color="primary"            
              >
                <Output />
              </IconButton>
            </span>
          </Tooltip>

        </Stack>
      </Collapse>

      <Collapse in={ open } >
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <Tooltip
            title='TakeAmt'
            placement="top-start"
            arrow
          >
            <span>
              <IconButton
                disabled={ !requestPaidInCapital || requestPaidInCapitalLoading }
                sx={{width: 20, height: 20, m: 1, p: 1}} 
                onClick={ () => requestPaidInCapital?.() }
                color="primary"            
              >
                < IosShare />
              </IconButton>
            </span>
          </Tooltip>


          <TextField 
            variant='filled'
            label='HashKey'
            sx={{
              m:1,
              minWidth: 618,
            }}
            onChange={(e) => setKey(e.target.value)}
            value={ key }
            size="small"
          />

        </Stack>
      </Collapse>

    </Paper>
  )

}





