import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { AddrZero, Bytes32Zero, HexType } from "../../../../scripts/common";

import { 
  useGeneralKeeperCreateAction,
} from "../../../../generated";

import { Button, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { AddCircle, EmojiPeople, RemoveCircle } from "@mui/icons-material";
import { HexParser } from "../../../../scripts/common/toolsKit";


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

interface CreateActionProps {
  getMotionsList: () => any;
}

export function CreateAction({getMotionsList}:CreateActionProps) {

  const { gk } = useComBooxContext();

  const [ seqOfVr, setSeqOfVr ] = useState<number>();
  const [ executor, setExecutor ] = useState<number>();

  const [ actions, setActions ] = useState<Action[]>([defaultAction]);

  const [ desHash, setDesHash ] = useState<HexType>(Bytes32Zero);

  const {
    isLoading: proposeActionLoading,
    write: proposeAction,
  } = useGeneralKeeperCreateAction({
    address: gk,
    args: seqOfVr && desHash && executor
        ? [BigInt(seqOfVr), 
          actions.map(v => (v.target)), 
          actions.map(v => (BigInt(v.value))),
          actions.map(v => (v.params)),
          desHash, BigInt(executor)]
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
            label='SeqOfVR'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setSeqOfVr(parseInt(e.target.value))}
            value={ seqOfVr }
          />

          <TextField 
            variant='outlined'
            label='Executor'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setExecutor(parseInt(e.target.value))}
            value={ executor }
          />

          <TextField 
            variant='outlined'
            label='DocHash / CID in IPFS'
            size="small"
            sx={{
              m:1,
              minWidth: 630,
            }}
            onChange={(e) => setDesHash(HexParser( e.target.value ))}
            value={ desHash }
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

      </Paper>

      {actions.map((v, i)=>(
        <Paper key={i} elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

          <Stack direction="row" sx={{ alignItems:'center' }} >

            <Typography color='black' sx={{ml:1, mr:2}}  >
              Step: {i+1}
            </Typography>

            <TextField 
              variant='outlined'
              label='Address'
              size="small"
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
              size="small"
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
              size="small"
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
        
        </Paper>
      ))}

    </Paper>
  );
}

