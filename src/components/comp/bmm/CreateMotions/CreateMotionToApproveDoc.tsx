import { useState } from "react";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { HexType } from "../../../../interfaces";

import { 
  useGeneralKeeperCreateMotionToApproveDoc, 
} from "../../../../generated";

import { Button, Paper, Stack, TextField } from "@mui/material";
import { EmojiPeople } from "@mui/icons-material";
import { HexParser } from "../../../../scripts/toolsKit";

interface CreateMotionToApproveDoc {
  getMotionsList: () => any;
}

export function CreateMotionToApproveDoc({getMotionsList}:CreateMotionToApproveDoc) {

  const { gk } = useComBooxContext();

  const [ doc, setDoc ] = useState<HexType>();
  const [ seqOfVr, setSeqOfVr ] = useState<number>();
  const [ executor, setExecutor ] = useState<number>();

  const {
    isLoading: proposeDocLoading,
    write: proposeDoc,
  } = useGeneralKeeperCreateMotionToApproveDoc({
    address: gk,
    args: doc && seqOfVr && executor
          ? [ doc, BigInt(seqOfVr), BigInt(executor) ]
          : undefined,
    onSuccess() {
      getMotionsList();
    }
  });

  return (

    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

      <Stack direction="row" sx={{ alignItems:'center' }} >

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
          disabled={ !proposeDoc || proposeDocLoading }
          variant="contained"
          endIcon={<EmojiPeople />}
          sx={{ m:1, minWidth:218 }}
          onClick={()=>proposeDoc?.()}
        >
          Propose
        </Button>

      </Stack>

    </Paper>

  );


}

