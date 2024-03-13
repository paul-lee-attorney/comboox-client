import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForGeneralMeeting, 
} from "../../../../../../generated";

import { Stack, TextField, } from "@mui/material";
import { HandshakeOutlined, } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { HexType, MaxUserNo } from "../../../../read";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx } from "../../../../read/toolsKit";
import { ActionsOnMotionProps } from "../ActionsOnMotion";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";

export function EntrustDelegaterForGeneralMeeting({ motion, setOpen, refresh }: ActionsOnMotionProps) {

  const { gk, setErrMsg } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>('0');
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    refresh();
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: entrustDelegaterOfMemberLoading,
    write: entrustDelegaterOfMember,
  } = useGeneralKeeperEntrustDelegaterForGeneralMeeting({
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

  const handleClick = ()=>{
    entrustDelegaterOfMember({
      args:[
        motion.head.seqOfMotion, 
        BigInt(delegater)
      ],
    });
  };

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
        disabled={ entrustDelegaterOfMemberLoading || hasError(valid)}
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<HandshakeOutlined />}
        sx={{ m:1, minWidth:128 }}
        onClick={ handleClick }
      >
        Entrust
      </LoadingButton>

    </Stack> 
  );
}



