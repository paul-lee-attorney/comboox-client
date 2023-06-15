import { useState } from "react";
import { useGeneralKeeperNominateDirector, useGeneralKeeperProposeActionOfGm, useGeneralKeeperProposeDocOfGm, useGeneralKeeperProposeToRemoveDirector, usePrepareGeneralKeeperAbandonRole, usePrepareGeneralKeeperNominateDirector, usePrepareGeneralKeeperProposeActionOfGm, usePrepareGeneralKeeperProposeDocOfGm, usePrepareGeneralKeeperProposeToRemoveDirector } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { AddrZero, HexType } from "../../../interfaces";
import { Box, Button, Collapse, FormControl, FormControlLabel, FormLabel, IconButton, Paper, Radio, RadioGroup, Stack, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { AddCircle, EmojiPeople, PersonAdd, PersonRemove, RemoveCircle } from "@mui/icons-material";

export interface Action {
  target: HexType;
  value: string;
  params: HexType;
}

const defaultAction: Action = {
  target: AddrZero,
  value: '0',
  params: `0x${'00'}`,
}

interface CreateMotionProps {
  getMotionsList: () => any,
}

export function CreateMotionOfGm({ getMotionsList }: CreateMotionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfPos, setSeqOfPos ] = useState<number>();
  const [ candidate, setCandidate ] = useState<number>();

  const {
    config: addDirectorConfig
  } = usePrepareGeneralKeeperNominateDirector({
    address: gk,
    args: seqOfPos && candidate
          ? [BigNumber.from(seqOfPos), BigNumber.from(candidate)]
          : undefined,
  });

  const {
    isLoading: addDirectorLoading,
    write: addDirector,
  } = useGeneralKeeperNominateDirector({
    ...addDirectorConfig,
    onSuccess(){
      getMotionsList();
    }
  });

  const {
    config: removeDirectorConfig
  } = usePrepareGeneralKeeperProposeToRemoveDirector({
    address: gk,
    args: seqOfPos 
          ? [ BigNumber.from(seqOfPos)]
          : undefined,
  });

  const{
    isLoading: removeDirectorLoading,
    write: removeDirector
  } = useGeneralKeeperProposeToRemoveDirector({
    ...removeDirectorConfig,
    onSuccess() {
      getMotionsList();
    }
  });

  const [ doc, setDoc ] = useState<HexType>();
  const [ seqOfVr, setSeqOfVr ] = useState<number>();
  const [ executor, setExecutor ] = useState<number>();

  const {
    config: proposeDocOfGmConfig,
  } = usePrepareGeneralKeeperProposeDocOfGm({
    address: gk,
    args: doc && seqOfVr && executor
          ? [ doc, BigNumber.from(seqOfVr), BigNumber.from(executor) ]
          : undefined,
  });

  const {
    isLoading: proposeDocOfGmLoading,
    write: proposeDocOfGm,
  } = useGeneralKeeperProposeDocOfGm({
    ...proposeDocOfGmConfig,
    onSuccess() {
      getMotionsList();
    }
  });

  // const [ targets, setTargets ] = useState<readonly HexType[]>();
  // const [ values, setValues ] = useState<string[]>();
  // const [ params, setParams ] = useState<readonly HexType[]>();

  const [ actions, setActions ] = useState<Action[]>([defaultAction]);

  const [ desHash, setDesHash ] = useState<HexType>();

  const {
    config: proposeActionConfig,
  } = usePrepareGeneralKeeperProposeActionOfGm({
    address: gk,
    args: seqOfVr && desHash && executor
        ? [BigNumber.from(seqOfVr), 
          actions.map(v => (v.target)), 
          actions.map(v => (BigNumber.from(v.value))),
          actions.map(v => (v.params)),
          desHash, BigNumber.from(executor)]
        : undefined,
  });

  const {
    isLoading: proposeActionLoading,
    write: proposeAction,
  } = useGeneralKeeperProposeActionOfGm({
    ...proposeActionConfig,
    onSuccess() {
      getMotionsList();
    }
  });

  const [ typeOfMotion, setTypeOfMotion ] = useState<string>('director');

  // const [ cp, setCp ] = useState([1]);

  const addAction = () => {
    setActions(v => {
      let arr = [...v];
      arr.push(defaultAction);      
      return arr;
    })
  }

  const removeAction = () => {
    setActions(v => {
      let arr = [...v];
      arr.pop();      
      return arr;
    })
  }

  return (
    <Paper sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Box sx={{ minWidth:200 }} >
          <Toolbar >
            <h4>Create Motion - Type Of Motion: </h4>
          </Toolbar>
        </Box>

        <RadioGroup
          row
          aria-labelledby="createMotionRadioGrup"
          name="createMotionRadioGroup"
          // defaultValue="director"
          onChange={(e)=>(setTypeOfMotion(e.target.value))}
          value={typeOfMotion}
        >
          <FormControlLabel value="director" control={<Radio size='small' />} label="Nominate/Remove Director" />
          <FormControlLabel value="doc" control={<Radio size='small' />} label="Approve Document" />
          <FormControlLabel value="action" control={<Radio size='small' />} label="Approve Action" />
        </RadioGroup>

      </Stack>

      <Collapse in={ typeOfMotion == 'director' } >
        <Stack direction="row" sx={{ alignItems:'center' }} >

          <Tooltip
            title='AddDirector'
            placement="top-start"
            arrow
          >
            <span>
            <IconButton
              disabled={ !addDirector || addDirectorLoading }
              sx={{width:20, height:20, m:1}}
              onClick={()=>addDirector?.()}
              color="primary"
            >
              <PersonAdd />
            </IconButton>
            </span>
          </Tooltip>

          <TextField 
            variant='filled'
            label='SeqOfPos'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setSeqOfPos(parseInt(e.target.value))}
            value={ seqOfPos }
            size='small'
          />

          <TextField 
            variant='filled'
            label='Candidate'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setCandidate(parseInt(e.target.value))}
            value={ candidate }
            size='small'
          />

          <Tooltip
            title='RemoveDirector'
            placement="top-end"
            arrow
          >
            <span>
            <IconButton
              disabled={ !removeDirector || removeDirectorLoading }
              sx={{width:20, height:20, m:1}}
              onClick={()=>removeDirector?.()}
              color="primary"
            >
              <PersonRemove />
            </IconButton>
            </span>
          </Tooltip>

        </Stack>      
      </Collapse>

      <Collapse in={ typeOfMotion == 'doc' } >
        <Stack direction="row" sx={{ alignItems:'center' }} >

          <TextField 
            variant='filled'
            label='AddressOfDoc'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setDoc(`0x${e.target.value}`)}
            value={ doc?.substring(2) }
          />

          <TextField 
            variant='filled'
            label='SeqOfVR'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setSeqOfVr(parseInt(e.target.value))}
            value={ seqOfVr }
          />

          <TextField 
            variant='filled'
            label='Executor'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setExecutor(parseInt(e.target.value))}
            value={ executor }
          />

          <Button
            disabled={ !proposeDocOfGm || proposeDocOfGmLoading }
            variant="contained"
            endIcon={<EmojiPeople />}
            sx={{ m:1, minWidth:218 }}
            onClick={()=>proposeDocOfGm?.()}
          >
            Propose
          </Button>

        </Stack>
      </Collapse>

      <Collapse in={ typeOfMotion == 'action' } >
        <Stack direction="row" sx={{ alignItems:'center' }} >

          <Tooltip
            title='AddSmartContract'
            placement="top-start"
            arrow            
          >
            <span>
            <IconButton 
              sx={{width: 20, height: 20, m: 1, p: 1}} 
              onClick={ addAction }
              color="primary"
            >
              <AddCircle />
            </IconButton>
            </span>
          </Tooltip>
      
          <Tooltip
            title='RemoveSmartContract'
            placement="top-start"
            arrow            
          >
            <span>
            <IconButton 
              disabled={ actions.length < 2 }
              sx={{width: 20, height: 20, m: 1, p: 1, }} 
              onClick={ removeAction }
              color="primary"
            >
              <RemoveCircle />
            </IconButton>
            </span>
          </Tooltip>

          <TextField 
            variant='filled'
            label='SeqOfVR'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setSeqOfVr(parseInt(e.target.value))}
            value={ seqOfVr }
          />

          <TextField 
            variant='filled'
            label='Executor'
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setExecutor(parseInt(e.target.value))}
            value={ executor }
          />

          <TextField 
            variant='filled'
            label='DocHash / CID in IPFS'
            sx={{
              m:1,
              minWidth: 550,
            }}
            onChange={(e) => setDesHash(`0x${e.target.value}`)}
            value={ desHash?.substring(2) }
          />

          <Button
            disabled={ !proposeAction || proposeActionLoading }
            variant="contained"
            endIcon={<EmojiPeople />}
            sx={{ m:1, minWidth:218 }}
            onClick={()=>proposeAction?.()}
          >
            Propose
          </Button>

        </Stack>

        {actions.map((v, i)=>(
          <Stack key={i} direction="row" sx={{ alignItems:'center' }} >

            <Typography color='black' sx={{ml:1, mr:2}}  >
              Step: {i+1}
            </Typography>

            <TextField 
              variant='filled'
              label='Address'
              sx={{
                m:1,
                minWidth: 550,
              }}
              onChange={(e) => setActions(a => {
                let arr:Action[] = [];
                arr = [...a];
                a[i].target = `0x${e.target.value}`;
                return arr;
              })}
              value={ actions[i].target.substring(2) }
            />

            <TextField 
              variant='filled'
              label='Value'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setActions(a => {
                let arr:Action[] = [];
                arr = [...a];
                arr[i].value = e.target.value;
                return arr;
              })}
              value={ actions[i].value }
            />

            <TextField 
              variant='filled'
              label='Params'
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setActions(a => {
                let arr:Action[] = [];
                arr = [...a];
                arr[i].params = `0x${e.target.value}`;
                return arr;
              })}
              value={ actions[i].params.substring(2) }
            />

          </Stack>
        ))}

      </Collapse>
    </Paper>
  );
}



