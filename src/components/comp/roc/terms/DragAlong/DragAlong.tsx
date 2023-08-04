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
} from "../../../../../generated";


import { getDocAddr } from "../../../../../queries/rc";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AlongLinks } from "./AlongLinks";
import { AddTerm } from "../AddTerm";
import { CopyLongStrSpan } from "../../../../common/utils/CopyLongStr";


export interface LinkRule{
  triggerDate: number;
  effectiveDays: number;
  triggerType: number;
  shareRatioThreshold: number;
  rate: number;
  proRata: boolean;
  typeOfFollowers: number;
}

export const defaultLinkRule: LinkRule = {
  triggerDate: 0,
  effectiveDays: 0,
  triggerType: 0,
  shareRatioThreshold: 0,
  rate: 0,
  proRata: false,
  typeOfFollowers: 0
}

export function linkRuleSnParser(sn: HexType): LinkRule {
  let out: LinkRule = {
    triggerDate: parseInt(sn.substring(2, 14), 16),
    effectiveDays: parseInt(sn.substring(14, 18), 16),
    triggerType: parseInt(sn.substring(18, 20), 16),
    shareRatioThreshold: parseInt(sn.substring(20, 24), 16),
    rate: parseInt(sn.substring(24, 32), 16),
    proRata: parseInt(sn.substring(32, 34), 16) == 1,
    typeOfFollowers: parseInt(sn.substring(34, 36), 16),
  }
  return out;
}

export function linkRuleCodifier(rule: LinkRule): HexType {
  let out: HexType = `0x${
    rule.triggerDate.toString(16).padStart(12, '0') +
    rule.effectiveDays.toString(16).padStart(4, '0') +
    rule.triggerType.toString(16).padStart(2, '0') +
    rule.shareRatioThreshold.toString(16).padStart(4, '0') +
    rule.rate.toString(16).padStart(8, '0') +
    (rule.proRata ? '01' : '00') +
    rule.typeOfFollowers.toString(16).padStart(2, '0') +
    '0'.padEnd(30, '0')
  }`;
  return out;
}

export interface AlongLink {
  drager: number;
  linkRule: LinkRule;
  followers: number[];
}

export const defaultFollowers: number[] = [];

export const defaultLink: AlongLink ={
  drager: 0,
  linkRule: defaultLinkRule,
  followers: defaultFollowers,
} 

export const triggerTypes = [
  'NoCondition', 'CtrlChanged', 'CtrlChanged+Price', 'CtrlChanged+ROE'
]

export interface SetShaTermProps {
  sha: HexType,
  term: HexType,
  setTerms: Dispatch<SetStateAction<HexType[]>> ,
  isFinalized: boolean,
}

export async function getLinks(addr: HexType, dragers: readonly bigint[]): Promise<AlongLink[]> {
  let len = dragers.length;
  let output: AlongLink[] = [];

  while (len > 0) {

    let drager = dragers[len - 1];

    let linkRule = await readContract({
      address: addr,
      abi: dragAlongABI,
      functionName: 'linkRule',
      args: [ drager ],
    });

    let followers = await readContract({
      address: addr,
      abi: dragAlongABI,
      functionName: 'followers',
      args: [ drager ],
    });
    
    let item: AlongLink = {
      drager: Number(drager),
      linkRule: {
        triggerDate: linkRule.triggerDate,
        effectiveDays: linkRule.effectiveDays,
        triggerType: linkRule.triggerType,
        shareRatioThreshold: linkRule.shareRatioThreshold,
        rate: linkRule.rate,
        proRata: linkRule.proRata,
        typeOfFollowers: linkRule.typeOfFollowers
      },
      followers: followers.map(v=>Number(v)),
    }

    output.push(item);

    len--;
  }

  return output;
}


export function DragAlong({ sha, term, setTerms, isFinalized }: SetShaTermProps) {

  const [ links, setLinks ] = useState<AlongLink[]>();

  const {
    refetch:getDragers 
  } = useDragAlongDragers({
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
  } = useDragAlongCreateLink({
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
  } = useDragAlongRemoveDrager({
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
  } = useDragAlongAddFollower({
    address: term,
    args: drager && follower
      ? [ BigInt(drager),
          BigInt(follower)] :
            undefined, 
    onSuccess() {
      getDragers();
    }
  });

  const { 
    isLoading: removeFollowerLoading, 
    write: removeFollower 
  } = useDragAlongRemoveFollower({
    address: term,
    args: drager && follower 
      ? [ BigInt(drager), BigInt(follower)] 
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
        variant={term != AddrZero ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Drag Along 
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
                    <h4>Drag Along</h4>
                  </Toolbar>

                  <CopyLongStrSpan title="Addr" size="body1" src={term} />
                </Stack>

                {!isFinalized && (
                  <AddTerm sha={ sha } typeOfDoc={ 25 } setTerms={ setTerms } isCreated={ term != AddrZero }  />
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
                        variant='outlined'
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
                        variant='outlined'
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
                            triggerType: Number(e.target.value),
                          }))}
                        >
                          {triggerTypes.map((v, i) => (
                            <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                          ))}
                        </Select>
                      </FormControl>

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

                      <FormControl variant="outlined" sx={{ m: 1, minWidth: 218 }}>
                        <InputLabel id="typeOfFollowers-label">TypeOfFollowers</InputLabel>
                        <Select
                          labelId="typeOfFollowers-label"
                          id="typeOfFollowers-select"
                          label="TypeOfFollowers"
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

                  <Divider orientation="horizontal" sx={{ m:1 }} flexItem />


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
                      variant='outlined'
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
                      variant='outlined'
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

