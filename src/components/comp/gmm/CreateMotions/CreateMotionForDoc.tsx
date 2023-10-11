import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../scripts/common";
import { useGeneralKeeperProposeDocOfGm } from "../../../../generated";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { EmojiPeople } from "@mui/icons-material";
import { HexParser, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { CreateMotionProps } from "../../bmm/CreateMotionOfBoardMeeting";

export function CreateMotionForDoc({refresh}:CreateMotionProps) {

  const { gk } = useComBooxContext();

  const [ doc, setDoc ] = useState<HexType>();
  const [ seqOfVr, setSeqOfVr ] = useState<number>();
  const [ executor, setExecutor ] = useState<number>();

  const {
    isLoading: proposeDocOfGmLoading,
    write: proposeDocOfGm,
  } = useGeneralKeeperProposeDocOfGm({
    address: gk,
    args: doc && seqOfVr && executor
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

        <Button
          disabled={ !proposeDocOfGm || proposeDocOfGmLoading }
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

