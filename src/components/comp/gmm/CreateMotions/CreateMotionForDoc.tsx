import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { HexType, MaxSeqNo, MaxUserNo } from "../../../../scripts/common";
import { useGeneralKeeperProposeDocOfGm } from "../../../../generated";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { EmojiPeople } from "@mui/icons-material";
import { FormResults, HexParser, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { CreateMotionProps } from "../../bmm/CreateMotionOfBoardMeeting";

export function CreateMotionForDoc({refresh}:CreateMotionProps) {

  const { gk } = useComBooxContext();

  const [ doc, setDoc ] = useState<HexType>();
  const [ seqOfVr, setSeqOfVr ] = useState<string>();
  const [ executor, setExecutor ] = useState<string>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: proposeDocOfGmLoading,
    write: proposeDocOfGm,
  } = useGeneralKeeperProposeDocOfGm({
    address: gk,
    args: doc && seqOfVr && executor && !hasError(valid)
          ? [ BigInt(doc), BigInt(seqOfVr), BigInt(executor) ]
          : undefined,
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (

    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

      <Stack direction="row" sx={{ alignItems:'stretch' }} >

        <TextField 
          variant='outlined'
          label='AddressOfDoc'
          size="small"
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setDoc(HexParser( e.target.value ))}
          value={ doc }
        />

        <TextField 
          variant='outlined'
          label='SeqOfVR'
          size="small"
          error={ valid['SeqOfVR']?.error }
          helperText={ valid['SeqOfVR']?.helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('SeqOfVR', input, MaxSeqNo, setValid);
            setSeqOfVr(input);
          }}
          value={ seqOfVr }
        />

        <TextField 
          variant='outlined'
          label='Executor'
          size="small"
          error={ valid['Executor']?.error }
          helperText={ valid['Executor']?.helpTx }
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => {
            let input = e.target.value;
            onlyNum('Executor', input, MaxUserNo, setValid);
            setExecutor(input);
          }}
          value={ executor }
        />

        <Button
          disabled={ !proposeDocOfGm || proposeDocOfGmLoading || hasError(valid)}
          variant="contained"
          endIcon={<EmojiPeople />}
          sx={{ m:1, minWidth:218 }}
          onClick={()=>proposeDocOfGm?.()}
        >
          Propose
        </Button>

      </Stack>

    </Paper>

  );


}

