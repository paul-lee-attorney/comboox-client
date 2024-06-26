import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForBoardMeeting,
} from "../../../../../../../generated";

import { Alert, Collapse, IconButton, Stack, TextField, } from "@mui/material";
import { Close, HandshakeOutlined, LoginSharp, } from "@mui/icons-material";
import { ProposeMotionProps } from "./ProposeMotionToBoardMeeting";
import { HexType, MaxUserNo } from "../../../../common";
import { FormResults, defFormResults, getReceipt, hasError, longSnParser, onlyInt } from "../../../../common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";


export type EntrustEvent = {
  seqOfMotion: string,
  delegate: string,
  principal: string,
}

export const defaultEvt: EntrustEvent = {
  seqOfMotion: '0',
  delegate: '0',
  principal: '0',
} 

export function EntrustDelegaterForBoardMeeting({ seqOfMotion, setOpen, refresh }: ProposeMotionProps) {

  const { gk, setErrMsg } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const [ evt, setEvt ] = useState<EntrustEvent>(defaultEvt); 
  const [ show, setShow ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setLoading(false);
  }

  const {
    isLoading: entrustDelegaterForBmLoading,
    write: entrustDelegaterForBm,
  } = useGeneralKeeperEntrustDelegaterForBoardMeeting({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      getReceipt(hash).then(
        r => {
          console.log('Receipt: ', r);
          
          if (r.logs.length > 0) {

            let lg = r.logs[r.logs.length - 1];

            if (lg.topics[0] == "0xfb530b01fe8da7c67ca83c49ce04d6ca6adbb57fb2b332097e62c6fe6cc6859b") {
              setEvt({
                seqOfMotion: BigInt(lg.topics[1]).toString(),
                delegate: Number(lg.topics[2]).toString(),
                principal: Number(lg.topics[3]).toString(),
              });
              setShow(true);
            }
          };

          updateResults();
        }
      )

    }
  });

  const handleClick = ()=> {
    if (delegater) {
      entrustDelegaterForBm({
        args: [
          seqOfMotion, 
          BigInt(delegater)
        ],
      });
    }
  }
    
  return (
    <Stack direction="row" sx={{ alignItems:'start' }} >

      <TextField 
        variant='outlined'
        label='Delegater'
        error={ valid['Delegater']?.error }
        helperText={ valid['Delegater']?.helpTx ?? ' ' }
        sx={{
          m:1,
          minWidth: 218,
        }}
        onChange={(e) => {
          let input = e.target.value;
          onlyInt('Delegater', input, MaxUserNo, setValid);
          setDelegater(input);
        }}
        value={ delegater }
        size='small'
      />

      <LoadingButton
        disabled={ !entrustDelegaterForBm || entrustDelegaterForBmLoading || hasError(valid)}
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<HandshakeOutlined />}
        sx={{ m:1, minWidth:118 }}
        onClick={ handleClick }
      >
        Entrust
      </LoadingButton>

      <Collapse in={show} sx={{ width:580 }} > 
          <Alert 
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setShow(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }

            variant='outlined' 
            severity='info' 
            sx={{ height: 55,  m: 1 }} 
          > 
            Principal: { longSnParser(evt.principal) + ' ' }
            Entrused Delegate: { longSnParser(evt.delegate) + ' ' }
            for Motion: { longSnParser(evt.seqOfMotion) }  
          </Alert>
        </Collapse>

    </Stack> 
  );
}



