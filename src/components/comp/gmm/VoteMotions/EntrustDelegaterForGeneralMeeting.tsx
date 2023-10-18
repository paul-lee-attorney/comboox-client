import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegaterForGeneralMeeting, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Button, Stack, TextField, } from "@mui/material";
import { HandshakeOutlined, } from "@mui/icons-material";
import { ProposeMotionProps } from "../../bmm/VoteMotions/ProposeMotionToBoardMeeting";
import { HexType, MaxUserNo } from "../../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export function EntrustDelegaterForGeneralMeeting({ seqOfMotion, setOpen, refresh }: ProposeMotionProps) {

  const { gk } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();
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
    args: delegater && !hasError(valid)
        ? [seqOfMotion, BigInt(delegater) ]
        : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return (
    <Stack direction="row" sx={{ alignItems:'stretch' }} >

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
          onlyNum('Delegater', input, MaxUserNo, setValid);
          setDelegater(input);
        }}
        value={ delegater }
        size='small'
      />

      <LoadingButton
        disabled={ !entrustDelegaterOfMember || entrustDelegaterOfMemberLoading || hasError(valid)}
        loading={loading}
        loadingPosition="end"
        variant="contained"
        endIcon={<HandshakeOutlined />}
        sx={{ m:1, minWidth:128 }}
        onClick={()=>entrustDelegaterOfMember?.()}
      >
        Entrust
      </LoadingButton>

    </Stack> 
  );
}



