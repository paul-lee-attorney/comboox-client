import { useEffect, useState } from "react";

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

import { AddrZero, HexType } from "../../../../../scripts/common";

import {
  AddCircle,
  RemoveCircle,
  ListAlt,
} from "@mui/icons-material"

import { readContract } from "@wagmi/core";

import {
  lockUpABI,
  useLockUpSetLocker,
  useLockUpRemoveKeyholder,
  useLockUpDelLocker,
  useLockUpAddKeyholder,
  useLockUpLockedShares, 
} from "../../../../../generated";

import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { SetShaTermProps } from "../AntiDilution/AntiDilution";
import { CopyLongStrSpan } from "../../../../common/utils/CopyLongStr";
import { AddTerm } from "../AddTerm";
import { LockerOfShare } from "./LockerOfShare";
import { Locker, getLockers } from "../../../../../scripts/comp/lu";


export function LockUp({ sha, term, setTerms, isFinalized }: SetShaTermProps) {

  const [ lockers, setLockers ] = useState<Locker[]>();
  const [ seqOfShare, setSeqOfShare ] = useState<string>();
  const [ dueDate, setDueDate ] = useState<number>();
  const [ open, setOpen ] = useState(false);

  const { 
    isLoading: addLockerLoading,
    write: addLocker 
  } = useLockUpSetLocker({
    address: term,
    args: seqOfShare && dueDate
      ? [ BigInt(seqOfShare), BigInt(dueDate) ]
      : undefined,
  });

  const { 
    isLoading: removeLockerLoading, 
    write: removeLocker 
  } = useLockUpDelLocker({
    address: term,
    args: seqOfShare ? [ BigInt(seqOfShare) ] : undefined,
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
  });

  const { 
    isLoading: removeKeyholderLoading, 
    write: removeKeyholder,
  } = useLockUpRemoveKeyholder({
    address: term,
    args: seqOfShare && keyholder
      ?  [ BigInt(seqOfShare), BigInt(keyholder) ]
      :   undefined,
  });

  useEffect(()=>{
    getLockers(term).then(
      ls => setLockers(ls)
    );
  }, [term, addLocker, removeLocker, addKeyholder, removeKeyholder]);

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

                  <Stack direction={'row'} >
                    <Toolbar sx={{ textDecoration:'underline' }}>
                      <h3>Lock Up</h3>
                    </Toolbar>

                    <CopyLongStrSpan title="Addr"  src={term} />
                  </Stack>

                  { !isFinalized && (
                    <AddTerm sha={ sha } title={ 2 } setTerms={ setTerms } isCreated={ term != AddrZero } />
                  )}

                </Stack>

                {term != AddrZero && !isFinalized && (
                  <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

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
                        variant='outlined'
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
                        label='ExpireDate'
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
                        variant='outlined'
                        label='Keyholder'
                        size="small"
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
                  
                  </Paper>
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
            <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
          </DialogActions>

      </Dialog>
  
    </>
  );
} 

