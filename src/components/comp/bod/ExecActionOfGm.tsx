import { useState } from "react";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { AddrZero, HexType } from "../../../interfaces";

import { 
  useGeneralKeeperExecAction,
} from "../../../generated";

import { 
  Button, 
  IconButton, 
  Paper, 
  Stack, 
  TextField, 
  Tooltip, 
  Typography 
} from "@mui/material";

import { 
  AddCircle, 
  RemoveCircle, 
  Surfing 
} from "@mui/icons-material";

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

interface ExecActionProps {
  seqOfVr: number;
  seqOfMotion: bigint;
  setOpen: (flag: boolean)=>void;
  getMotionsList: () => any;
}

export function ExecAction({seqOfVr, seqOfMotion, setOpen, getMotionsList}:ExecActionProps) {

  const { gk } = useComBooxContext();

  const [ actions, setActions ] = useState<Action[]>([defaultAction]);
  const [ desHash, setDesHash ] = useState<HexType>();

  // const {
  //   config: execActionConfig,
  // } = usePrepareGeneralKeeperExecAction({
  //   address: gk,
  //   args: seqOfVr && desHash && seqOfMotion
  //       ? [BigInt(seqOfVr), 
  //         actions.map(v => (v.target)), 
  //         actions.map(v => (BigInt(v.value))),
  //         actions.map(v => (v.params)),
  //         desHash, BigInt(seqOfMotion)]
  //       : undefined,
  // });

  const {
    isLoading: execActionLoading,
    write: execAction,
  } = useGeneralKeeperExecAction({
    address: gk,
    args: seqOfVr && desHash && seqOfMotion
        ? [BigInt(seqOfVr), 
          actions.map(v => (v.target)), 
          actions.map(v => (BigInt(v.value))),
          actions.map(v => (v.params)),
          desHash, BigInt(seqOfMotion)]
        : undefined,
    onSuccess() {
      getMotionsList();
    }
  });

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
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

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
        label='DesHash / CID in IPFS'
        sx={{
          m:1,
          minWidth: 630,
        }}
        onChange={(e) => setDesHash(`0x${e.target.value}`)}
        value={ desHash?.substring(2) }
      />

      <Button
        disabled={ execActionLoading }
        variant="contained"
        endIcon={<Surfing />}
        sx={{ m:1, minWidth:218 }}
        onClick={()=>execAction?.()}
      >
        Execute
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
            minWidth: 450,
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
            minWidth: 630,
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

    </Paper>
  );
}


