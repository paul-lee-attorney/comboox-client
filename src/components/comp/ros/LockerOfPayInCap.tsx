import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { booxMap } from "../../../scripts/common";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { 
  useGeneralKeeperRequestPaidInCapital, 
  useGeneralKeeperSetPayInAmt, 
  useGeneralKeeperWithdrawPayInAmt,
} from "../../../generated";
import { Box, Collapse, IconButton, Paper, Stack, Switch, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { ExitToApp, IosShare, Output } from "@mui/icons-material";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Share, getLocker } from "../../../scripts/comp/ros";
import { Locker, defaultLocker } from "../../../scripts/center/rc";
import { HexParser } from "../../../scripts/common/toolsKit";

interface LockerOfPayInCapProps {
  share: Share;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setTime: Dispatch<SetStateAction<number>>;
}

export function LockerOfPayInCap({ share, setDialogOpen, setTime }: LockerOfPayInCapProps ) {

  const { gk, boox } = useComBooxContext();

  const [ locker, setLocker ] = useState<Locker>(defaultLocker);
  const [ key, setKey ] = useState<string>();

  const [ open, setOpen ] = useState<boolean>(false);

  const {
    isLoading: setPayInAmtLoading,
    write: setPayInAmt,
  } = useGeneralKeeperSetPayInAmt({
    address: gk,
    args: locker.head && share.head.seqOfShare && 
          locker.head.value && locker.head.expireDate && 
          locker.hashLock 
        ? [ BigInt(share.head.seqOfShare), 
            BigInt(locker.head.value), 
            BigInt(locker.head.expireDate),
            locker.hashLock
          ]
        : undefined,
  })

  const {
    isLoading: requestPaidInCapitalLoading,
    write: requestPaidInCapital,
  } = useGeneralKeeperRequestPaidInCapital({
    address: gk,
    args: locker.hashLock && key
      ? [ locker.hashLock, key ]
      : undefined,
    onSuccess() {
      setTime(Date.now());
      setDialogOpen(false);  
    }
  })

  const {
    isLoading: withdrawPayInAmtLoading,
    write: withdrawPayInAmt,     
  } = useGeneralKeeperWithdrawPayInAmt({
    address: gk,
    args: locker.hashLock 
      ? [ locker.hashLock, BigInt(share.head.seqOfShare) ]
      : undefined,
  })

  useEffect(()=>{
    if (boox && locker.hashLock) {
      getLocker(boox[booxMap.ROS], locker.hashLock).then(
        res => setLocker(res)
      );
    }
  }, [boox, locker.hashLock, setPayInAmt, withdrawPayInAmt]);

  return (
    <Paper elevation={3} sx={{
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
                disabled={ setPayInAmtLoading }
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
              hashLock: HexParser( e.target.value ),
            }))}
            value={ locker.hashLock }
            size="small"
          />

          <TextField 
            variant='filled'
            label='Amount'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setLocker(v => {
              let lk = v;
              lk.head.value = BigInt(e.target.value ?? '0');
              return lk;
            })}

            value={ locker.head?.value.toString() }
            size="small"
          />

          <DateTimeField
            label='ExpireDate'
            sx={{
              m:1,
              minWidth: 218,
            }} 
            value={ dayjs.unix(locker.head.expireDate ?? '0') }
            onChange={(date) => setLocker(v => {
              let lk = v;
              lk.head.expireDate = date ? date.unix() : 0;
              return lk;
            })}
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
                disabled={ withdrawPayInAmtLoading }
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
            title='PickUpCapital'
            placement="top-start"
            arrow
          >
            <span>
              <IconButton
                disabled={ requestPaidInCapitalLoading }
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
            onChange={(e) => setKey(e.target.value ?? '')}
            value={ key }
            size="small"
          />

        </Stack>
      </Collapse>

    </Paper>
  )

}





