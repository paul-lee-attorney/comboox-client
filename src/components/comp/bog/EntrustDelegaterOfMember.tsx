import { useState } from "react";

import { 
  useGeneralKeeperEntrustDelegateOfMember, 
  usePrepareGeneralKeeperEntrustDelegateOfMember, 
} from "../../../generated";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Button, Stack, TextField, } from "@mui/material";
import { Handshake, } from "@mui/icons-material";

interface EntrustDelegaterOfMemberProps {
  seqOfMotion: string,
  setOpen: (flag: boolean) => void,
  getMotionsList: () => any,
}

export function EntrustDelegaterOfMember({ seqOfMotion, setOpen, getMotionsList }: EntrustDelegaterOfMemberProps) {

  const { gk } = useComBooxContext();

  const [ delegater, setDelegater ] = useState<string>();

  const {
    config: entrustDelegateOfMemberConfig
  } = usePrepareGeneralKeeperEntrustDelegateOfMember({
    address: gk,
    args: delegater
        ? [BigNumber.from(seqOfMotion), BigNumber.from(delegater) ]
        : undefined ,
  });

  const {
    isLoading: entrustDelegateOfMemberLoading,
    write: entrustDelegateOfMember,
  } = useGeneralKeeperEntrustDelegateOfMember({
    ...entrustDelegateOfMemberConfig,
    onSuccess() {
      getMotionsList();
      setOpen(false);
    },
  });

  return (
    <Stack direction="row" sx={{ alignItems:'center' }} >

      <TextField 
        variant='filled'
        label='Delegater'
        sx={{
          m:1,
          minWidth: 218,
        }}
        onChange={(e) => setDelegater(e.target.value)}
        value={ delegater }
        size='small'
      />

      <Button
        disabled={ !entrustDelegateOfMember || entrustDelegateOfMemberLoading }
        variant="contained"
        endIcon={<Handshake />}
        sx={{ m:1, minWidth:118 }}
        onClick={()=>entrustDelegateOfMember?.()}
      >
        Entrust
      </Button>

    </Stack> 
  );
}



