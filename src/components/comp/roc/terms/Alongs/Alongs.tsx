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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { AddrZero, MaxRatio, MaxSeqNo, MaxUserNo } from "../../../../../scripts/common";

import {
  AddCircle,
  RemoveCircle,
  ListAlt,
} from "@mui/icons-material"

import {
  useAlongsAddDragger,
  useAlongsRemoveDragger,
  useAlongsAddFollower,
  useAlongsRemoveFollower,
} from "../../../../../generated";

import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AlongLinks } from "./AlongLinks";
import { AddTerm } from "../AddTerm";
import { CopyLongStrSpan } from "../../../../common/utils/CopyLongStr";
import { AlongLink, StrLinkRule, defaultStrLinkRule, getLinks, linkRuleCodifier, triggerTypes } from "../../../../../scripts/comp/da";
import { FormResults, defFormResults, hasError, onlyNum } from "../../../../../scripts/common/toolsKit";
import { SetShaTermProps } from "../AntiDilution/AntiDilution";

interface AlongsProps extends SetShaTermProps {
  seqOfTitle: number;
}

export function Alongs({ sha, term, setTerms, isFinalized, seqOfTitle }: AlongsProps) {

  const [ links, setLinks ] = useState<AlongLink[]>();
  const [ drager, setDrager ] = useState<string>('0');
  const [ rule, setRule ] = useState<StrLinkRule>(defaultStrLinkRule);
  const [ open, setOpen ] = useState(false);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const { 
    isLoading: addLinkLoading,
    write: addLink 
  } = useAlongsAddDragger({
    address: term,
    args: rule && drager
      ? [ linkRuleCodifier(rule) , BigInt(drager)] 
      : undefined, 
  });

  const { 
    isLoading: removeLinkLoading, 
    write: removeLink, 
  } = useAlongsRemoveDragger({
    address: term,
    args: drager ? [BigInt(drager)] : undefined,
  });

  const [ follower, setFollower ] = useState<string>('0');

  const { 
    isLoading: addFollowerLoading, 
    write: addFollower, 
  } = useAlongsAddFollower({
    address: term,
    args: drager && follower
      ? [ BigInt(drager),
          BigInt(follower)] :
            undefined,
  });

  const { 
    isLoading: removeFollowerLoading, 
    write: removeFollower 
  } = useAlongsRemoveFollower({
    address: term,
    args: drager && follower 
      ? [ BigInt(drager), BigInt(follower)] 
      : undefined,
  });

  useEffect(()=>{
    getLinks(term).then(
      ls => setLinks(ls)
    );
  }, [term, addLink, removeLink, addFollower, removeFollower]);

  return (
    <>
      <Button
        disabled={ isFinalized && !term }
        variant={term != AddrZero ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        {seqOfTitle == 3 ? 'Drag Along' : 'Tag Along' } 
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
                <Stack direction={'row'}>
                  <Toolbar sx={{ textDecoration:'underline' }}>
                    <h3> {seqOfTitle == 3 ? 'Drag Along' : 'Tag Along' }</h3>
                  </Toolbar>

                  <CopyLongStrSpan title="Addr"  src={term} />
                </Stack>

                {!isFinalized && (
                  <AddTerm sha={ sha } title={ seqOfTitle } setTerms={ setTerms } isCreated={ term != AddrZero }  />
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
                        variant='outlined'
                        label='EffectiveDays'
                        size="small"
                        error={ valid['EffectiveDays']?.error }
                        helperText={ valid['EffectiveDays']?.helpTx }
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => {
                          let input = e.target.value;
                          onlyNum('EffectiveDays', input, MaxSeqNo, setValid);
                          setRule((v) => ({
                          ...v,
                          effectiveDays: input,
                        }));
                      }}
                        value={ rule.effectiveDays }              
                      />

                      <TextField 
                        variant='outlined'
                        label='ShareRatioThreshold (BP)'
                        size="small"
                        error={ valid['ShareRatioThreshold']?.error }
                        helperText={ valid['ShareRatioThreshold']?.helpTx }
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => {
                          let input = e.target.value;
                          onlyNum('ShareRatioThreshold', input, MaxRatio, setValid);
                          setRule((v) => ({
                            ...v,
                            shareRatioThreshold: input,
                          }));
                        }}
                        value={ rule.shareRatioThreshold }              
                      />

                    </Stack>

                    <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                      <FormControl variant="outlined" sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="triggerType-label">TypeOfTrigger</InputLabel>
                        <Select
                          size="small"
                          labelId="triggerType-label"
                          id="triggerType-select"
                          label="TypeOfTrigger"
                          value={ rule.triggerType }
                          onChange={(e) => setRule((v) => ({
                            ...v,
                            triggerType: e.target.value,
                          }))}
                        >
                          {triggerTypes.map((v, i) => (
                            <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                          ))}
                        </Select>
                      </FormControl>

                      <TextField 
                        variant='outlined'
                        label='Rate'
                        size="small"
                        error={ valid['Rate']?.error }
                        helperText={ valid['Rate']?.helpTx }
                        sx={{
                          m:1,
                          minWidth: 218,
                        }}
                        onChange={(e) => {
                          let input = e.target.value;
                          onlyNum('Rate', input, MaxRatio, setValid);
                          setRule((v) => ({
                            ...v,
                            rate: input,
                          }));
                        }}
                        value={ rule.rate }              
                      />

                      <FormControl variant="outlined" sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="proRata-label">ProRata ?</InputLabel>
                        <Select
                          labelId="proRata-label"
                          id="proRata-select"
                          size="small"
                          label="ProRata ?"
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

                    </Stack>

                  </Stack>

                  <Divider orientation="horizontal" sx={{ m:1 }} flexItem />


                  <Stack direction={'row'} sx={{ alignItems:'center' }}>      

                    <Tooltip
                      title='Add DragAlong'
                      placement="top-start"
                      arrow
                    >
                      <IconButton 
                        disabled={ addLinkLoading || hasError(valid)}
                        sx={{width: 20, height: 20, m: 1, ml: 5 }} 
                        onClick={ () => addLink?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>
                    </Tooltip>

                    <TextField 
                      variant='outlined'
                      label='Drager'
                      size="small"
                      error={ valid['Drager']?.error }
                      helperText={ valid['Drager']?.helpTx }
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => {
                        let input = e.target.value;
                        onlyNum('Drager', input, MaxUserNo, setValid);
                        setDrager(input);
                      }}
                      value={ drager }              
                    />

                    <Tooltip
                      title='Remove DragAlong'
                      placement="top-end"
                      arrow
                    >           
                      <IconButton
                        disabled={ removeLinkLoading || hasError(valid)} 
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
                        disabled={ addFollowerLoading || hasError(valid)}
                        sx={{width: 20, height: 20, m: 1, ml: 10,}} 
                        onClick={ () => addFollower?.() }
                        color="primary"
                      >
                        <AddCircle/>
                      </IconButton>

                    </Tooltip>

                    <TextField 
                      variant='outlined'
                      label='Follower'
                      size="small"
                      error={ valid['Follower']?.error }
                      helperText={ valid['Follower']?.helpTx }
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      onChange={(e) => {
                        let input = e.target.value;
                        onlyNum('Follower', input, MaxUserNo, setValid);
                        setFollower(input);
                      }}
                      value={ follower }              
                    />

                    <Tooltip
                      title='Remove Obligor'
                      placement="top-end"
                      arrow
                    >

                      <IconButton
                        disabled={ removeFollowerLoading || hasError(valid)} 
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

              {links?.map((v) => (
                <AlongLinks key={ v.drager } link={ v } />
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

