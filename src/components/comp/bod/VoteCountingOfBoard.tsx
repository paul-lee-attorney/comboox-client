
import { Button, Stack } from "@mui/material";
import { 
  filesFolderABI,
  useGeneralKeeperVoteCounting,
  usePrepareGeneralKeeperVoteCounting, 
} from "../../../generated";

import { HexType } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { BigNumber } from "ethers";
import { readContract } from "@wagmi/core";

interface VoteCountingOfBoard {
  seqOfMotion: BigNumber;
  setOpen: (flag: boolean) => void;
  getMotionsList: () => any;
}

export function VoteCountingOfBoard({ seqOfMotion, setOpen, getMotionsList }: VoteCountingOfBoard) {

  const { gk, boox } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperVoteCounting({
    address: gk,
    args: [ seqOfMotion ],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCounting({
    ...config,
    onSuccess() {
      getMotionsList();
      setOpen(false);
    },
  });

  return (
    <Stack sx={{ alignItems:'center' }} direction={ 'row' } >
      <Button
        disabled={ !write || isLoading}
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6 }}
        onClick={()=>write?.()}
      >
        Count
      </Button>

    </Stack>
  )

}