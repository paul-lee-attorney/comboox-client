import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../scripts/common";

import { 
  useGeneralKeeperExecAction,
} from "../../../../generated";

import { 
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
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyInt, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { ProposeMotionProps } from "../VoteMotions/ProposeMotionToBoardMeeting";
import { Action, defaultAction } from "../../../../scripts/common/meetingMinutes";
import { LoadingButton } from "@mui/lab";

export interface ExecActionProps extends ProposeMotionProps {
  seqOfVr: number;
}

export function ExecAction({seqOfVr, seqOfMotion, setOpen, refresh}:ExecActionProps) {

  const { gk, setErrMsg } = useComBooxContext();

  const [ actions, setActions ] = useState<Action[]>([defaultAction]);
  const [ desHash, setDesHash ] = useState<HexType>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: execActionLoading,
    write: execAction,
  } = useGeneralKeeperExecAction({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const execActionClick = ()=>{
    if (seqOfVr && desHash && seqOfMotion) {
      execAction({
        args: [
          BigInt(seqOfVr), 
          actions.map(v => (v.target)), 
          actions.map(v => (BigInt(v.value))),
          actions.map(v => (v.params)),
          desHash, BigInt(seqOfMotion)
        ],
      });
    }
  }

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
        error={ valid['DocHash']?.error }
        helperText={ valid['DocHash']?.helpTx ?? ' ' }
        sx={{
          m:1,
          minWidth: 630,
        }}
        onChange={(e) => {
          let input = HexParser( e.target.value );
          onlyHex('DocHash', input, 64, setValid); 
          setDesHash(input);
        }}
        value={ desHash }
      />

      <LoadingButton
        disabled={ execActionLoading || hasError(valid) }
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<Surfing />}
        sx={{ m:1, minWidth:218 }}
        onClick={ execActionClick }
      >
        Execute
      </LoadingButton>

      </Stack>

      {actions.map((v, i)=>(
      <Stack key={i} direction="row" sx={{ alignItems:'center' }} >

        <Typography color='black' sx={{ml:1, mr:2}}  >
          Step: {i+1}
        </Typography>

        <TextField 
          variant='filled'
          label='Address'
          error={ valid['Address']?.error }
          helperText={ valid['Address']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 450,
          }}
          onChange={(e) => {
            let input = HexParser( e.target.value );
            onlyHex('Address', input, 40, setValid);
            setActions(a => {
              let arr:Action[] = [];
              arr = [...a];
              a[i].target = input;
              return arr;
            })
          }}
          value={ actions[i].target }
        />

        <TextField 
          variant='filled'
          label='Value'
          error={ valid['Value']?.error }
          helperText={ valid['Value']?.helpTx ?? ' ' }          
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('Value', input, 0n, setValid);
            setActions(a => {
              let arr:Action[] = [];
              arr = [...a];
              arr[i].value = input;
              return arr;
            });
          }}
          value={ actions[i].value }
        />

        <TextField 
          variant='filled'
          label='Params'
          error={ valid['Params']?.error }
          helperText={ valid['Params']?.helpTx ?? ' ' }
          sx={{
            m:1,
            minWidth: 630,
          }}
          onChange={(e) => {
            let input = HexParser( e.target.value );
            onlyHex('Params', input, 0, setValid);
            setActions(a => {
              let arr:Action[] = [];
              arr = [...a];
              arr[i].params = input;
              return arr;
            });
          }}
          value={ actions[i].params }
        />

      </Stack>
      ))}

    </Paper>
  );
}


