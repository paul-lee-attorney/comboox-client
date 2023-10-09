import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Bytes32Zero, HexType } from "../../../../scripts/common";

import { 
  useGeneralKeeperExecActionOfGm, 
} from "../../../../generated";

import { Button, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { AddCircle, RemoveCircle, Surfing } from "@mui/icons-material";
import { HexParser } from "../../../../scripts/common/toolsKit";
import { Action, defaultAction } from "../../../../scripts/common/meetingMinutes";
import { ExecActionProps } from "../../bmm/ExecMotions/ExecAction";

export function ExecActionOfGm({seqOfVr, seqOfMotion, setOpen, setTime}:ExecActionProps) {

  const { gk } = useComBooxContext();

  const [ actions, setActions ] = useState<Action[]>([ defaultAction ]);
  const [ desHash, setDesHash ] = useState<HexType>(Bytes32Zero);

  const {
    isLoading: execActionLoading,
    write: execAction,
  } = useGeneralKeeperExecActionOfGm({
    address: gk,
    args: seqOfVr && desHash && seqOfMotion
        ? [BigInt(seqOfVr), 
          actions.map(v => (v.target)), 
          actions.map(v => (BigInt(v.value))),
          actions.map(v => (v.params)),
          desHash, BigInt(seqOfMotion)]
        : undefined,
    onSuccess() {
      setTime(Date.now());
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

  const handleClick = () => {
    execAction();
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
        variant='outlined'
        label='DesHash / CID in IPFS'
        sx={{
          m:1,
          minWidth: 630,
        }}
        onChange={(e) => setDesHash(HexParser( e.target.value ))}
        value={ desHash }
      />

      <Button
        disabled={ !execAction || execActionLoading }
        variant="contained"
        endIcon={<Surfing />}
        sx={{ m:1, minWidth:218 }}
        onClick={ handleClick }
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
          variant='outlined'
          label='Address'
          sx={{
            m:1,
            minWidth: 450,
          }}
          onChange={(e) => setActions(a => {
            let arr:Action[] = [];
            arr = [...a];
            a[i].target = HexParser( e.target.value );
            return arr;
          })}
          value={ actions[i].target }
        />

        <TextField 
          variant='outlined'
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
          variant='outlined'
          label='Params'
          sx={{
            m:1,
            minWidth: 630,
          }}
          onChange={(e) => setActions(a => {
            let arr:Action[] = [];
            arr = [...a];
            arr[i].params = HexParser( e.target.value );
            return arr;
          })}
          value={ actions[i].params }
        />

      </Stack>
      ))}

    </Paper>
  );
}


