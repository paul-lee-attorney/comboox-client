import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HexType, MaxData, booxMap } from "../../../scripts/common";
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
import { StrLocker, defaultStrLocker } from "../../../scripts/center/rc";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyNum, refreshAfterTx } from "../../../scripts/common/toolsKit";

interface LockerOfPayInCapProps {
  share: Share;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  refresh: ()=>void;
}

export function LockerOfPayInCap({ share, setDialogOpen, refresh }: LockerOfPayInCapProps ) {

  const { gk, boox } = useComBooxContext();
  const [ time, setTime ] = useState(0);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const refreshLockers = ()=>{
    setTime(Date.now());
  }

  const [ locker, setLocker ] = useState<StrLocker>(defaultStrLocker);
  const [ key, setKey ] = useState<string>();

  const [ open, setOpen ] = useState<boolean>(false);

  const {
    isLoading: setPayInAmtLoading,
    write: setPayInAmt,
  } = useGeneralKeeperSetPayInAmt({
    address: gk,
    args: !hasError(valid) 
        ? [ BigInt(share.head.seqOfShare), 
            BigInt(locker.head.value), 
            BigInt(locker.head.expireDate),
            locker.hashLock
          ]
        : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refreshLockers);
    }    
  });
    
  const updateResults = ()=>{
    refresh();
    setDialogOpen(false);
  }

  const {
    isLoading: requestPaidInCapitalLoading,
    write: requestPaidInCapital,
  } = useGeneralKeeperRequestPaidInCapital({
    address: gk,
    args: locker.hashLock && key && !hasError(valid)
      ? [ locker.hashLock, key ]
      : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }    
  });

  const {
    isLoading: withdrawPayInAmtLoading,
    write: withdrawPayInAmt,     
  } = useGeneralKeeperWithdrawPayInAmt({
    address: gk,
    args: locker.hashLock && !hasError(valid)
      ? [ locker.hashLock, BigInt(share.head.seqOfShare) ]
      : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refreshLockers);
    }    
  });

  useEffect(()=>{
    if (boox && locker.hashLock ) {
      getLocker(boox[booxMap.ROS], locker.hashLock).then(
        res => setLocker(res)
      );
    }
  }, [boox, locker.hashLock, time]);

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
                disabled={ setPayInAmtLoading || hasError(valid) }
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
            error={ valid['HashLock']?.error }
            helperText={ valid['HashLock']?.helpTx }    
            sx={{
              m:1,
              minWidth: 618,
            }}
            onChange={(e) => {
              let input = HexParser( e.target.value );
              onlyHex('HashLock', input, 64, setValid);
              setLocker(v => ({
                ...v,
                hashLock: input,
              }));
            }}
            value={ locker.hashLock }
            size="small"
          />

          <TextField 
            variant='filled'
            label='Amount'
            error={ valid['Amount']?.error }
            helperText={ valid['Amount']?.helpTx }    
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => {
              let input = e.target.value;
              onlyNum('Amount', input, MaxData, setValid);
              setLocker(v => {
                let lk = v;
                lk.head.value = input;
                return lk;
              });
            }}

            value={ locker.head.value }
            size="small"
          />

          <DateTimeField
            label='ExpireDate'
            sx={{
              m:1,
              minWidth: 218,
            }} 
            value={ dayjs.unix(locker.head.expireDate) }
            onChange={(date) => setLocker(v => {
              let lk = v;
              lk.head.expireDate = date 
                    ? date.unix() 
                    : 0;
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
                disabled={ withdrawPayInAmtLoading || valid['HashLock']?.error }
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
                disabled={ requestPaidInCapitalLoading || valid['HashLock']?.error}
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





