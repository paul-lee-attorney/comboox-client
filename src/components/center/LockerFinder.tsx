import { useState } from "react";
import { useRegCenterGetLocker } from "../../generated";
import { AddrOfRegCenter, HexType } from "../../scripts/common";
import { Locker, getLocker } from "../../scripts/comp/rc";
import { Button, Stack, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { splitPayload } from "../../scripts/common/toolsKit";



interface LockerFinderProps{
  setLocker: (locker: Locker) => void;
  setOpen: (flag: boolean) => void;
}


export function LockerFinder({setLocker, setOpen}: LockerFinderProps) {

  const [ strLock, setStrLock ] = useState<string>();
  const [ hashLock, setHashLock ] = useState<HexType>();

  useRegCenterGetLocker({
    address: AddrOfRegCenter,
    args: hashLock
        ? [ hashLock ]
        : undefined,
    onSuccess(target) {
      if (hashLock && target) {
        let locker:Locker = {
          hashLock: hashLock,
          head: target.head,
          body: {
            counterLocker: target.body.counterLocker,
            selector: `0x${target.body.payload.substring(2,10)}`,
            paras: splitPayload(target.body.payload.substring(10)),
          }
        };
        setLocker(locker);
      }
    }
  })  

  const searchLocker = ()=>{
    if (strLock) {
      setHashLock(`0x${strLock}`);
      setOpen(true);
    }
  }


  return(
    <Stack direction='row' sx={{ alignItems:'center' }} >

      <TextField 
        sx={{ m: 1, minWidth: 685 }} 
        id="tfStrLock" 
        label="StrLock" 
        variant="outlined"
        onChange={(e) => setStrLock(e.target.value ?? '')}
        value = { strLock }
        size='small'
      />

      <Button 
        disabled={ !strLock }
        sx={{ m: 1, minWidth: 168, height: 40 }} 
        variant="contained" 
        endIcon={ <Search /> }
        onClick={ searchLocker }
        size='small'
      >
        Search
      </Button>

    </Stack>
  );
}