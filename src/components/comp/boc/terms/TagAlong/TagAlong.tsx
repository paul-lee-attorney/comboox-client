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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  dragAlongABI,
  useDragAlongDragers,
  useDragAlongCreateLink,
  useDragAlongRemoveDrager,
  useDragAlongAddFollower,
  useDragAlongRemoveFollower,
  useTagAlongCreateLink,
  useTagAlongRemoveDrager,
  useTagAlongAddFollower,
  useTagAlongRemoveFollower,
  useTagAlongDragers, 
} from "../../../../../generated";


import { getDocAddr } from "../../../../../queries/rc";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { SetShaTermProps } from "../AntiDilution/AntiDilution";
import { AlongLink, LinkRule, defaultLinkRule, getLinks, linkRuleCodifier, triggerTypes } from "../DragAlong/DragAlong";
import { AlongLinks } from "../DragAlong/AlongLinks";


export function TagAlong({ sha, term, setTerms, isFinalized }: SetShaTermProps) {

  const [ version, setVersion ] = useState<string>('1');

  const {
    isLoading: createTermLoading,
    write: createTerm,
  } = useShareholdersAgreementCreateTerm({
    address: sha,
    args: version ? 
      [BigInt('28'), BigInt(version)]: 
      undefined,
    onSuccess(data:any) {
      getDocAddr(data.hash).
        then(addr => setTerms(v => {
          let out = [...v];
          out[4] = addr;
          return out;
        }));      
    }
  });

  const {
    isLoading: removeTermLoading,
    write: removeTerm,
  } = useShareholdersAgreementRemoveTerm({
    address: sha,
    args: [BigInt('28')],
    onSuccess() {
      setTerms(v =>{
        let out = [...v];
        out[4] = AddrZero;
        return out;
      });
    }
  });

  const [ links, setLinks ] = useState<AlongLink[]>();

  const {
    refetch:getDragers 
  } = useTagAlongDragers({
    address: term,
    onSuccess(ls) {
      if (term)
        getLinks(term, ls).
          then(links => setLinks(links));
    }
  });

  const [ drager, setDrager ] = useState<string>('0');
  const [ rule, setRule ] = useState<LinkRule>(defaultLinkRule);

  const { 
    isLoading: addLinkLoading,
    write: addLink 
  } = useTagAlongCreateLink({
    address: term,
    args: rule && drager
      ? [ linkRuleCodifier(rule) , BigInt(drager)] 
      : undefined, 
    onSuccess() {
      getDragers();
    }
  });

  const { 
    isLoading: removeLinkLoading, 
    write: removeLink, 
  } = useTagAlongRemoveDrager({
    address: term,
    args: drager ? [BigInt(drager)] : undefined, 
    onSuccess() {
      getDragers();
    }
  });

  const [ follower, setFollower ] = useState<string>('0');

  const { 
    isLoading: addFollowerLoading, 
    write: addFollower, 
  } = useTagAlongAddFollower({
    address: term,
    args: drager && follower
      ? [ BigInt(drager ?? '0'),
          BigInt(follower ?? '0')] 
      : undefined, 
    onSuccess() {
      getDragers();
    }
  });

  const { 
    isLoading: removeFollowerLoading, 
    write: removeFollower 
  } = useTagAlongRemoveFollower({
    address: term,
    args: drager && follower 
      ? [ BigInt(drager ?? '0'), BigInt(follower ?? '0')] 
      : undefined, 
    onSuccess() {
      getDragers();
    }
  });

  const [ open, setOpen ] = useState(false);

  return (
    <>
      <Button
        disabled={ isFinalized && !term }
        variant={ term != AddrZero ? 'contained' : 'outlined' }
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Tag Along 
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
                  <h4>Tag Along   (Addr: {term?.toLowerCase()} )</h4>
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
                <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

                  <Stack direction='column' spacing={1} >

                    <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                      <DateTimeField
                        label='TriggerDate'
                        sx={{
                          m:1,
                          minWidth: 218,
                        }} 
                        size="small"
                        value={ dayjs.unix(rule.triggerDate) }
                        onChange={(date) => setRule((v) => ({
                          ...v,
                          triggerDate: date ? date.unix() : 0,
                        }))}
                        format='YYYY-MM-DD HH:mm:ss'
                      />

                      <TextField 
                        variant='filled'
                        label='EffectiveDays'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setRule((v) => ({
                          ...v,
                          effectiveDays: parseInt( e.target.value ?? '0'),
                        }))}
                        value={ rule.effectiveDays }              
                      />

                      <TextField 
                        variant='filled'
                        label='ShareRatioThreshold'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setRule((v) => ({
                          ...v,
                          shareRatioThreshold: parseInt(e.target.value ?? '0'),
                        }))}
                        value={ rule.shareRatioThreshold }              
                      />

                      <TextField 
                        variant='filled'
                        label='Rate'
                        size="small"
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => setRule((v) => ({
                          ...v,
                          rate: parseInt(e.target.value ?? '0'),
                        }))}
                        value={ rule.rate }              
                      />

                    </Stack>

                    <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                      <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="triggerType-label">TypeOfTrigger</InputLabel>
                        <Select
                          size="small"
                          labelId="triggerType-label"
                          id="triggerType-select"
                          value={ rule.triggerType }
                          onChange={(e) => setRule((v) => ({
                            ...v,
                            triggerType: Number(e.target.value),
                          }))}
                        >
                          {triggerTypes.map((v, i) => (
                            <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="proRata-label">ProRata ?</InputLabel>
                        <Select
                          labelId="proRata-label"
                          id="proRata-select"
                          size="small"
                          value={ rule.proRata ? '1' : '0' }
                          onChange={(e) => setRule((v) => ({
                            ...v,
                            proRata: e.target.value == '1',
                          }))}
                        >
                          <MenuItem value={ '1' } > True </MenuItem>  
                          <MenuItem value={ '0' } > False </MenuItem>  
                        </Select>
                      </FormControl>

                      <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="typeOfFollowers-label">TypeOfFollowers</InputLabel>
                        <Select
                          labelId="typeOfFollowers-label"
                          id="typeOfFollowers-select"
                          size="small"
                          value={ rule.typeOfFollowers }
                          onChange={(e) => setRule((v) => ({
                            ...v,
                            typeOfFollowers: Number(e.target.value),
                          }))}
                        >
                          <MenuItem value={ '1' } >Rest All Members</MenuItem>  
                          <MenuItem value={ '0' } >Specified Members</MenuItem>  
                        </Select>
                      </FormControl>                      

                    </Stack>

                  </Stack>

                  <Divider orientation="horizontal" sx={{ width:'100%', m:1 }} flexItem />


                  <Stack direction={'row'} sx={{ alignItems:'center' }}>      

                    <Tooltip
                      title='Add DragAlong'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addLinkLoading }
                        sx={{width: 20, height: 20, m: 1, ml: 5 }} 
                        onClick={ () => addLink?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>
                    </Tooltip>

                    <TextField 
                      variant='filled'
                      label='Drager'
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setDrager(e.target.value)}
                      value={ drager }              
                    />

                    <Tooltip
                      title='Remove DragAlong'
                      placement="top-end"
                      arrow
                    >           
                      <IconButton
                        disabled={ removeLinkLoading } 
                        sx={{width: 20, height: 20, m: 1, mr: 10, }} 
                        onClick={ () => removeLink?.() }
                        color="primary"
                      >
                        <RemoveCircle/>
                      </IconButton>
                    </Tooltip>

                    <Tooltip
                      title='Add Follower'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addFollowerLoading }
                        sx={{width: 20, height: 20, m: 1, ml: 10,}} 
                        onClick={ () => addFollower?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>

                    </Tooltip>

                    <TextField 
                      variant='filled'
                      label='Follower'
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => setFollower(e.target.value ?? '0')}
                      value={ follower }              
                    />

                    <Tooltip
                      title='Remove Obligor'
                      placement="top-end"
                      arrow
                    >

                      <IconButton
                        disabled={ removeFollowerLoading } 
                        sx={{width: 20, height: 20, m: 1, mr: 10}} 
                        onClick={ () => removeFollower?.() }
                        color="primary"
                      >
                        <RemoveCircle/>
                      </IconButton>
                    
                    </Tooltip>

                  </Stack>
                </Paper>
              )}

              {term != AddrZero && (
                <Paper elevation={3} sx={{ m:1, border:1, borderColor:'divider' }}>  

                  <Toolbar>
                    <h4>Tag-Alongs List</h4>
                  </Toolbar>

                  {links?.map((v) => (
                    <AlongLinks key={ v.drager } link={ v } />
                  ))}

                </Paper>
              )}

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

