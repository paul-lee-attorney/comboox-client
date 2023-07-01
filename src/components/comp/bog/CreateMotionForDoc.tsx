import { useState } from "react";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { HexType } from "../../../interfaces";
import { useGeneralKeeperProposeDocOfGm, usePrepareGeneralKeeperProposeDocOfGm } from "../../../generated";
import { BigNumber } from "ethers";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { EmojiPeople } from "@mui/icons-material";



interface CreateMotionForDocProps {
  getMotionsList: () => any;
}

export function CreateMotionForDoc({getMotionsList}:CreateMotionForDocProps) {

  const { gk, boox } = useComBooxContext();

  const [ doc, setDoc ] = useState<HexType>();
  const [ seqOfVr, setSeqOfVr ] = useState<number>();
  const [ executor, setExecutor ] = useState<number>();

  const {
    config: proposeDocOfGmConfig,
  } = usePrepareGeneralKeeperProposeDocOfGm({
    address: gk,
    args: doc && seqOfVr && executor
          ? [ doc, BigNumber.from(seqOfVr), BigNumber.from(executor) ]
          : undefined,
  });

  const {
    isLoading: proposeDocOfGmLoading,
    write: proposeDocOfGm,
  } = useGeneralKeeperProposeDocOfGm({
    ...proposeDocOfGmConfig,
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

