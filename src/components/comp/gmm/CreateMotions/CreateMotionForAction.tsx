import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Bytes32Zero, HexType, MaxSeqNo, MaxUserNo } from "../../../../scripts/common";

import { 
  useGeneralKeeperCreateActionOfGm, 
} from "../../../../generated";

import { IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { AddCircle, EmojiPeople, RemoveCircle } from "@mui/icons-material";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyInt, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { Action, defaultAction } from "../../../../scripts/common/meetingMinutes";
import { CreateMotionProps } from "../../bmm/CreateMotionOfBoardMeeting";
import { LoadingButton } from "@mui/lab";

export function CreateMotionForAction({refresh}:CreateMotionProps) {

  const { gk, setErrMsg } = useComBooxContext();

  const [ seqOfVr, setSeqOfVr ] = useState<string>();
  const [ executor, setExecutor ] = useState<string>();

  const [ actions, setActions ] = useState<Action[]>([defaultAction]);

  const [ desHash, setDesHash ] = useState<HexType>(Bytes32Zero);

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const {
    isLoading: proposeActionLoading,
    write: proposeAction,
  } = useGeneralKeeperCreateActionOfGm({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const handleClick = ()=>{
    if (seqOfVr && desHash && executor) {
      proposeAction({
        args: [
          BigInt(seqOfVr), 
          actions.map(v => (v.target)), 
          actions.map(v => (BigInt(v.value))),
          actions.map(v => (v.params)),
          desHash, BigInt(executor)
        ],
      });
    }
  };

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

      <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
        <Stack direction="row" sx={{ alignItems:'start' }} >

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
            label='SeqOfVR'
            size="small"
            error={ valid['SeqOfVR']?.error }
            helperText={ valid['SeqOfVR']?.helpTx ?? ' ' }
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => {
              let input = e.target.value;
              onlyInt('SeqOfVR', input, MaxSeqNo, setValid);
              setSeqOfVr(input);
            }}
            value={ seqOfVr }
          />

          <TextField 
            variant='outlined'
            label='Executor'
            size="small"
            error={ valid['Executor']?.error }
            helperText={ valid['Executor']?.helpTx ?? ' ' }
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => {
              let input = e.target.value;
              onlyInt('Executor', input, MaxUserNo, setValid);
              setExecutor(input);
            }}
            value={ executor }
          />

          <TextField 
            variant='outlined'
            label='DocHash / CID in IPFS'
            size="small"
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
            disabled={ !proposeAction || proposeActionLoading || hasError(valid)}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            endIcon={<EmojiPeople />}
            sx={{ m:1, minWidth:218 }}
            onClick={ handleClick }
          >
            Propose
          </LoadingButton>

        </Stack>
      </Paper>

      {actions.map((v, i)=>(
        <Paper key={i} elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
          <Stack  direction="row" sx={{ alignItems:'start' }} >

            <Typography color='black' sx={{ml:1, mr:2}}  >
              Step: {i+1}
            </Typography>

            <TextField 
              variant='outlined'
              label='Address'
              size="small"
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
                });
              }}
              value={ actions[i].target }
            />

            <TextField 
              variant='outlined'
              label='Value'
              size="small"
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
              variant='outlined'
              label='Params'
              size="small"
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
                })
              }}
              value={ actions[i].params }
            />

          </Stack>
        </Paper>
      ))}

    </Paper>
  );
}


