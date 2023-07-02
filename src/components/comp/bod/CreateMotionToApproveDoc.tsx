import { useState } from "react";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { HexType } from "../../../interfaces";

import { 
  useGeneralKeeperCreateMotionToApproveDoc, 
  usePrepareGeneralKeeperCreateMotionToApproveDoc 
} from "../../../generated";

import { BigNumber } from "ethers";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { EmojiPeople } from "@mui/icons-material";

interface CreateMotionToApproveDoc {
  getMotionsList: () => any;
}

export function CreateMotionToApproveDoc({getMotionsList}:CreateMotionToApproveDoc) {

  const { gk } = useComBooxContext();

  const [ doc, setDoc ] = useState<HexType>();
  const [ seqOfVr, setSeqOfVr ] = useState<number>();
  const [ executor, setExecutor ] = useState<number>();

  const {
    config: proposeDocConfig,
  } = usePrepareGeneralKeeperCreateMotionToApproveDoc({
    address: gk,
    args: doc && seqOfVr && executor
          ? [ doc, BigNumber.from(seqOfVr), BigNumber.from(executor) ]
          : undefined,
  });

  const {
    isLoading: proposeDocLoading,
    write: proposeDoc,
  } = useGeneralKeeperCreateMotionToApproveDoc({
    ...proposeDocConfig,
    onSuccess() {
      getMotionsList();
    }
  });

  return (

    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >

      <Stack direction="row" sx={{ alignItems:'center' }} >

        <TextField 
          variant='filled'
          label='AddressOfDoc'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setDoc(`0x${e.target.value}`)}
          value={ doc?.substring(2) }
        />

        <TextField 
          variant='filled'
          label='SeqOfVR'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setSeqOfVr(parseInt(e.target.value))}
          value={ seqOfVr }
        />

        <TextField 
          variant='filled'
          label='Executor'
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

