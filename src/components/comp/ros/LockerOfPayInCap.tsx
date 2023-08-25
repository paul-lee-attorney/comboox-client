import { useState } from "react";
import { Bytes32Zero, HexType } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { 
  useBookOfSharesGetLocker, 
  useGeneralKeeperRequestPaidInCapital, 
  useGeneralKeeperSetPayInAmt, 
  useGeneralKeeperWithdrawPayInAmt, 
} from "../../../generated";
import { Box, Collapse, IconButton, Paper, Stack, Switch, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { ExitToApp, IosShare, Output } from "@mui/icons-material";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Share } from "../../../queries/ros";
import { Locker, HeadOfLocker,  defaultHeadOfLocker } from "../../../queries/rc";
import { HexParser, splitPayload } from "../../../scripts/toolsKit";


interface LockerOfPayInCapProps {
  share: Share;
  obtainSharesList: ()=>any;
  setDialogOpen: (flag: boolean) => void;
}

export function LockerOfPayInCap({ share, obtainSharesList, setDialogOpen }: LockerOfPayInCapProps ) {

  const { gk, boox } = useComBooxContext();

  const [ headOfLocker, setHeadOfLocker ] = useState<HeadOfLocker>(defaultHeadOfLocker);

  const [ hashLock, setHashLock ] = useState<HexType>(Bytes32Zero);

  const [ newLocker, setNewLocker ] = useState<Locker>();

  // useEffect(()=>{
  //   if (share.head.seqOfShare && 
  //     share.head.shareholder)      
  //       setHeadOfLocker(v => ({
  //         ...v,
  //         from: share.head.seqOfShare,
  //         to: share.head.shareholder,
  //       }));  
  // }, [share]);

  // let snOfLocker: HexType = `0x${
  //   locker.from.toString().padStart(13, '0') +
  //   locker.to.toString().padStart(13, '0') +
  //   locker.expireDate.toString(16).padStart(12, '0') +
  //   locker.hashLock.substring(34)
  // }`;

  const {
    refetch: getLocker,
  } = useBookOfSharesGetLocker({
    address: boox ? boox[9] : undefined,
    args: hashLock ? [ hashLock ] : undefined,
    onSuccess(locker) {
      if (hashLock) {
        let lk: Locker = {
          hashLock: hashLock,
          head: locker.head,
          body: {
            counterLocker: locker.body.counterLocker,
            selector: `0x${locker.body.payload.substring(2,10)}`,
            paras: splitPayload(locker.body.payload.substring(10)),          
          },
        };
        setNewLocker(lk);
      }
    }
  })

  // const {
  //   config: setPayInAmtConfig,
  // } = usePrepareGeneralKeeperSetPayInAmt ({
  //   address: gk,
  //   args: headOfLocker && headOfLocker.from && 
  //         headOfLocker.value && headOfLocker.expireDate && 
  //         hashLock 
  //       ? [ BigInt(headOfLocker.from), 
  //           BigInt(headOfLocker.value), 
  //           BigInt(headOfLocker.expireDate),
  //           hashLock 
  //         ]
  //       : undefined,
  // });

  const {
    isLoading: setPayInAmtLoading,
    write: setPayInAmt,
  } = useGeneralKeeperSetPayInAmt({
    address: gk,
    args: headOfLocker && share.head.seqOfShare && 
          headOfLocker.value && headOfLocker.expireDate && 
          hashLock 
        ? [ BigInt(share.head.seqOfShare), 
            BigInt(headOfLocker.value), 
            BigInt(headOfLocker.expireDate),
            hashLock 
          ]
        : undefined,
    onSuccess() {
      getLocker();
    }
  })

  const [ key, setKey ] = useState<string>();

  // const {
  //   config: requestPaidInCapitalConfig
  // } = usePrepareGeneralKeeperRequestPaidInCapital({
  //   address: gk,
  //   args: snOfLocker && key
  //         ? [ snOfLocker, key ]
  //         : undefined,
  // })

  const {
    isLoading: requestPaidInCapitalLoading,
    write: requestPaidInCapital,
  } = useGeneralKeeperRequestPaidInCapital({
    address: gk,
    args: hashLock && key
      ? [ hashLock, key ]
      : undefined,
    onSuccess() {
      getLocker()
    }
  })

  // const {
  //   config: withdrawPayInAmtConfig,
  // } = usePrepareGeneralKeeperWithdrawPayInAmt({
  //   address: gk,
  //   args: snOfLocker 
  //         ? [snOfLocker]
  //         : undefined,
  // })

  const {
    isLoading: withdrawPayInAmtLoading,
    write: withdrawPayInAmt,     
  } = useGeneralKeeperWithdrawPayInAmt({
    address: gk,
    args: hashLock 
      ? [ hashLock, BigInt(share.head.seqOfShare) ]
      : undefined,
    onSuccess() {
      getLocker()
    }
  })

  const [ open, setOpen ] = useState<boolean>(false);

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
            onChange={(e) => setHashLock(HexParser( e.target.value ))}
            value={ hashLock }
            size="small"
          />

          <TextField 
            variant='filled'
            label='Amount'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setHeadOfLocker(v => ({
              ...v,
              value: BigInt(e.target.value ?? '0'),
            }))}
            value={ headOfLocker?.value.toString() }
            size="small"
          />

          <DateTimeField
            label='ExpireDate'
            sx={{
              m:1,
              minWidth: 218,
            }} 
            value={ dayjs.unix(headOfLocker.expireDate ?? '0') }
            onChange={(date) => setHeadOfLocker(v => ({
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
            onChange={(e) => setKey(e.target.value)}
            value={ key }
            size="small"
          />

        </Stack>
      </Collapse>

    </Paper>
  )

}





