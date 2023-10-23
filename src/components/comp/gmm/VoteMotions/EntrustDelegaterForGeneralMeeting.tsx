import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForGeneralMeeting, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Stack, TextField, } from "@mui/material";
import { HandshakeOutlined, } from "@mui/icons-material";
import { ProposeMotionProps } from "../../bmm/VoteMotions/ProposeMotionToBoardMeeting";
import { HexType, MaxUserNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function EntrustDelegaterForGeneralMeeting({ seqOfMotion, setOpen, refresh }: ProposeMotionProps) {

  const { gk } = useComBooxContext();

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
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    entrustDelegaterOfMember({
      args:[
        seqOfMotion, 
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



