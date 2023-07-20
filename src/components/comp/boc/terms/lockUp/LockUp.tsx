import { Dispatch, SetStateAction, useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  TextField,
  Button,
  Tooltip,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { AddrZero, HexType } from "../../../../../interfaces";

import {
  AddCircle,
  RemoveCircle,
  PlaylistAdd,
  Delete,
  ListAlt,
} from "@mui/icons-material"

import { readContract } from "@wagmi/core";

import {

  useShareholdersAgreementCreateTerm,
  useShareholdersAgreementRemoveTerm,
  useLockUpLockedShares,
  lockUpABI,
  useLockUpSetLocker,
  useLockUpRemoveKeyholder,
  useLockUpDelLocker,
  useLockUpAddKeyholder, 
} from "../../../../../generated";

import { getDocAddr } from "../../../../../queries/rc";
import { LockerOfShare } from "./LockerOfShare";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { SetShaTermProps } from "../AntiDilution/AntiDilution";

interface Locker {
  seqOfShare: number;
  dueDate: number;
  keyholders: number[];
}

async function getLocker(lu: HexType, seq: number): Promise<Locker> {
  let res = await readContract({
    address: lu,
    abi: lockUpABI,
    functionName: 'getLocker',
    args: [ BigInt(seq) ],
  });

  let locker: Locker = {
    seqOfShare: seq,
    dueDate: res[0],
    keyholders: res[1].map(v => Number(v)),
  }

  return locker;
}

async function getLockers(lu: HexType, shares: number[]): Promise<Locker[]> {
  let len = shares.length;
  let output: Locker[] = [];

  while (len > 0) {
    let seqOfShare = shares[len - 1];
    let locker = await getLocker(lu, seqOfShare);
    output.push(locker);
    len--;
  }

  return output;
}

export function LockUp({ sha, term, setTerms, isFinalized }: SetShaTermProps) {

  const [ version, setVersion ] = useState<string>();

  const {
    isLoading: createTermLoading,
    write: createTerm,
  } = useShareholdersAgreementCreateTerm({
    address: sha,
    args: version ? 
      [BigInt('26'), BigInt(version)]: 
      undefined,
    onSuccess(data) {
      getDocAddr(data.hash).
        then(addr => setTerms(v => {
          let out = [...v];
          out[2] = addr;
          return out;
        }));      
    }
  });

  const {
    isLoading: removeTermLoading,
    write: removeTerm,
  } = useShareholdersAgreementRemoveTerm({
    address: sha,
    args: [BigInt('26')],
    onSuccess() {
      setTerms(v=>{
        let out = [...v];
        out[2] = AddrZero;
        return out;
      });
    }
  });

  const [ lockers, setLockers ] = useState<Locker[]>();

  const { 
    refetch: obtainLockers 
  } = useLockUpLockedShares({
    address: term,
    onSuccess(data) {
      let ls: number[] = [];
      data.map(v => {
        ls.push(Number(v))
      })
      if (term)
        getLockers(term, ls).
          then(lks => setLockers(lks)); 
    }
  });

  const [ seqOfShare, setSeqOfShare ] = useState<string>();
  const [ dueDate, setDueDate ] = useState<number>();

  const { 
    isLoading: addLockerLoading,
    write: addLocker 
  } = useLockUpSetLocker({
    address: term,
    args: seqOfShare && dueDate
      ? [ BigInt(seqOfShare), BigInt(dueDate) ]
      : undefined,
    onSuccess() {
      obtainLockers();
    }
  });

  const { 
    isLoading: removeLockerLoading, 
    write: removeLocker 
  } = useLockUpDelLocker({
    address: term,
    args: seqOfShare ? [ BigInt(seqOfShare) ] : undefined,
    onSuccess() {
      obtainLockers();
    }
  });

  const [ keyholder, setKeyholder ] = useState<string>();

  const { 
    isLoading: addKeyholderLoading, 
    write: addKeyholder,
  } = useLockUpAddKeyholder({
    address: term,
    args: seqOfShare && keyholder
      ?  [ BigInt(seqOfShare), BigInt(keyholder) ]
      :   undefined,
    onSuccess() {
      obtainLockers();
    }
  });

  const { 
    isLoading: removeKeyholderLoading, 
    write: removeKeyholder,
  } = useLockUpRemoveKeyholder({
    address: term,
    args: seqOfShare && keyholder
      ?  [ BigInt(seqOfShare), BigInt(keyholder) ]
      :   undefined,
    onSuccess() {
      obtainLockers();
    }
  });

  const [ open, setOpen ] = useState(false);

  return (
    <>
      <Button
        disabled={ isFinalized && !term }
        variant={term != AddrZero ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Lock Up
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >

          <DialogContent>

            <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
              <Box sx={{ width:1180 }}>

                <Stack direction={'row'} sx={{ alignItems:'center', justifyContent:'space-between' }}>
                  <Toolbar>
                    <h4>Lock Up (Addr: { term })</h4>
                  </Toolbar>

                  {term == AddrZero && !isFinalized && (
                    <Stack direction={'row'} sx={{ alignItems:'center' }}>

                      <TextField 
                        variant='filled'
                        label='Version'
                        sx={{
                          m:1,
                          ml:3,
                          minWidth: 218,
                        }}
                        onChange={(e) => setVersion(e.target.value)}
                        value={ version }              
                      />

                      <Button
                        disabled={ createTermLoading }
                        variant="contained"
                        sx={{
                          height: 40,
                        }}
                        endIcon={ <PlaylistAdd /> }
                        onClick={() => createTerm?.()}
                      >
                        Create
                      </Button>

                    </Stack>
                  )}

                  {term != AddrZero && !isFinalized && (
                      <Button
                        disabled={ removeTermLoading }
                        variant="contained"
                        sx={{
                          height: 40,
                          mr: 5,
                        }}
                        endIcon={ <Delete /> }
                        onClick={() => removeTerm?.()}
                      >
                        Remove
                      </Button>
                  )}

                </Stack>

                {term != AddrZero && !isFinalized && (
                  <Stack direction={'row'} sx={{ alignItems:'center' }}>      

                    <Tooltip
                      title='Add Locker'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addLockerLoading }
                        sx={{width: 20, height: 20, m: 1, ml: 5 }} 
                        onClick={ () => addLocker?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>
                    </Tooltip>

                    <TextField 
                      variant='filled'
                      label='SeqOfShare'
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setSeqOfShare(e.target.value)}
                      value={ seqOfShare }              
                    />

                    <DateTimeField
                      label='TriggerDate'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }} 
                      size="small"
                      value={ dayjs.unix(dueDate ?? 0) }
                      onChange={(date) => setDueDate(date?.unix() ?? undefined)}
                      format='YYYY-MM-DD HH:mm:ss'
                    />

                    <Tooltip
                      title='Remove Locker'
                      placement="top-end"
                      arrow
                    >           
                      <IconButton
                        disabled={ removeLockerLoading } 
                        sx={{width: 20, height: 20, m: 1, mr: 10, }} 
                        onClick={ () => removeLocker?.() }
                        color="primary"
                      >
                        <RemoveCircle/>
                      </IconButton>
                    </Tooltip>

                    <Tooltip
                      title='Add Keyholder'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addKeyholderLoading }
                        sx={{width: 20, height: 20, m: 1, ml: 10,}} 
                        onClick={ () => addKeyholder?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>

                    </Tooltip>

                    <TextField 
                      variant='filled'
                      label='Keyholder'
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setKeyholder(e.target.value)}
                      value={ keyholder }              
                    />

                    <Tooltip
                      title='Remove Keyholder'
                      placement="top-end"
                      arrow
                    >

                      <IconButton
                        disabled={ removeKeyholderLoading } 
                        sx={{width: 20, height: 20, m: 1, mr: 10}} 
                        onClick={ () => removeKeyholder?.() }
                        color="primary"
                      >
                        <RemoveCircle/>
                      </IconButton>
                    
                    </Tooltip>

                  </Stack>
                )}
                
                {term && lockers?.map((v) => (
                  <LockerOfShare 
                    key={v.seqOfShare} 
                    seqOfShare={v.seqOfShare}
                    dueDate={v.dueDate}
                    keyholders={v.keyholders} 
                  />
                ))}

              </Box>
            </Paper>

          </DialogContent>


          <DialogActions>
            <Button onClick={()=>setOpen(false)}>Close</Button>
          </DialogActions>

      </Dialog>
  
    </>
  );
} 

