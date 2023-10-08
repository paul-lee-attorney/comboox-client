import { useEffect, useState } from "react";
import { HexType } from "../../scripts/common";
import { Locker, getLocker } from "../../scripts/center/rc";
import { Button, Stack, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

interface LockerFinderProps{
  setLocker: (locker: Locker) => void;
  setOpen: (flag: boolean) => void;
}

export function LockerFinder({setLocker, setOpen}: LockerFinderProps) {

  const [ strLock, setStrLock ] = useState<string>();
  const [ hashLock, setHashLock ] = useState<HexType>();

  useEffect(()=>{
    if (hashLock) {
      getLocker(hashLock).then(
        locker => setLocker(locker)
      )
    }
  }, [hashLock, setLocker]);

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